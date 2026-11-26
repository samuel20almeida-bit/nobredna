-- Transactional integration test. No request, token, rate bucket or history persists.
-- Run only in the dedicated NobreDNA database as its authorized maintainer.
begin;
select set_config('nobredna.test.support_token',gen_random_uuid()::text,true);
select set_config('nobredna.test.support_id',gen_random_uuid()::text,true);
select set_config('nobredna.test.admin_id',(select user_id::text from public.store_admins limit 1),true);

-- Test-only capture configuration is isolated within the rollback transaction.
update nobredna_private.capture_config set token_hash=encode(sha256(convert_to(current_setting('nobredna.test.support_token'),'UTF8')),'hex') where singleton;
select set_config('request.headers','{}',true);
set local role anon;
do $$ begin
  begin
    insert into public.store_support_requests(id,category,customer_name,email,consent)
      values(current_setting('nobredna.test.support_id')::uuid,'withdrawal','QA transacional','qa@example.invalid',true);
    raise exception 'capture without credential must not succeed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.headers',jsonb_build_object('x-nobredna-capture',current_setting('nobredna.test.support_token'),'x-nobredna-rate-key',encode(sha256(convert_to(current_setting('nobredna.test.support_id'),'UTF8')),'hex'))::text,true);
insert into public.store_support_requests(id,category,customer_name,email,consent)
  values(current_setting('nobredna.test.support_id')::uuid,'withdrawal','QA transacional','qa@example.invalid',true);
do $$ begin
  begin
    perform id from public.store_support_requests where id=current_setting('nobredna.test.support_id')::uuid;
    raise exception 'anonymous access must fail';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('request.jwt.claim.sub'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
  if exists(select 1 from public.store_support_requests where id=current_setting('nobredna.test.support_id')::uuid) then raise exception 'non-admin can read'; end if;
  if public.store_support_admin_counts() is not null then raise exception 'non-admin counts exposed'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('nobredna.test.admin_id'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('nobredna.test.admin_id'),'role','authenticated')::text,true);
set local role authenticated;
do $$ declare r public.store_support_requests%rowtype; begin
  select * into r from public.store_support_requests where id=current_setting('nobredna.test.support_id')::uuid;
  if r.status is distinct from 'new' or r.response_due_at-r.created_at is distinct from interval '5 days' or r.protocol not like 'ND-S-%' then raise exception 'incorrect initial state'; end if;
  if (public.store_support_admin_counts()->>'pending')::int < 1 then raise exception 'pending counter missing'; end if;
  begin
    update public.store_support_requests set status='resolved' where id=r.id;
    raise exception 'response must be registered before resolution';
  exception when check_violation then null; end;
  update public.store_support_requests set status='reviewing',first_response_at=now(),internal_notes='QA only' where id=r.id;
  if not exists(select 1 from public.store_support_events where request_id=r.id and response_recorded and to_status='reviewing') then raise exception 'missing audit event'; end if;
  update public.store_support_requests set status='resolved',first_response_at=null where id=r.id;
  if not exists(select 1 from public.store_support_requests where id=r.id and status='resolved' and first_response_at is not null) then raise exception 'response timestamp must be preserved'; end if;
end $$;
reset role;
rollback;
select 'PASS: capture, privacy, admin workflow, five-day deadline and history' as result;
