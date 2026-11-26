-- Read-only authorization assertions plus an isolated fixture, always rollback.
begin;
select set_config('nobredna.test.admin_id',(select user_id::text from public.store_admins limit 1),true);
insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000097','perf-fixture@example.invalid');
insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000097');
select set_config('request.jwt.claim.sub',current_setting('nobredna.test.admin_id'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('nobredna.test.admin_id'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.store_admins)=1;
  assert (select user_id from public.store_admins)=auth.uid();
end $$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('request.jwt.claim.sub'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin assert (select count(*) from public.store_admins)=0;end $$;
reset role;
rollback;
select 'PASS: admin membership query only returns the authenticated caller; nonmembers see none' as result;
