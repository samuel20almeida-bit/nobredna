-- Run in the dedicated test database after editorial-crm.sql; no fixtures remain.
begin;
insert into nobredna_private.capture_config(singleton,token_hash)
values(true,encode(sha256(convert_to('fixture-capture-token','UTF8')),'hex'))
on conflict(singleton) do update set token_hash=excluded.token_hash;
insert into nobredna_private.admin_invites(email) values('fixture-admin@example.invalid');
insert into auth.users(id,email,email_confirmed_at) values
('00000000-0000-4000-8000-000000000081','fixture-admin@example.invalid',now()),
('00000000-0000-4000-8000-000000000082','fixture-nonadmin@example.invalid',now());
do $$ begin
 assert not has_table_privilege('anon','public.editorial_leads','SELECT');
 assert not has_column_privilege('anon','public.editorial_leads','status','INSERT');
 assert not has_column_privilege('authenticated','public.editorial_leads','email','UPDATE');
 assert not has_column_privilege('anon','public.editorial_leads','internal_notes','UPDATE');
 assert has_column_privilege('authenticated','public.editorial_leads','internal_notes','UPDATE');
end $$;
set local role anon;
do $$ begin
 begin
   insert into public.editorial_leads(id,source,customer_name,email,details,consent) values
   ('00000000-0000-4000-8000-000000000083','editorial','Teste','fixture@example.invalid','{}',true);
   raise exception 'expected unauthorized';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.headers','{"x-nobredna-capture":"fixture-capture-token","x-nobredna-rate-key":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}',true);
insert into public.editorial_leads(id,source,customer_name,email,details,consent) values
('00000000-0000-4000-8000-000000000083','editorial','Teste de triagem','fixture@example.invalid','{"respostas":[]}',true);
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000082","role":"authenticated","amr":[{"method":"otp","timestamp":1}]}',true);
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000082',true);
set local role authenticated;
do $$ begin
 assert (select count(*) from public.editorial_leads)=0;
 begin
   insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000082');
   raise exception 'expected unauthorized';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000081","role":"authenticated","amr":[{"method":"password","timestamp":1}]}',true);
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000081',true);
set local role authenticated;
do $$ begin
 begin
   insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000081');
   raise exception 'expected OTP requirement';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000081","role":"authenticated","amr":[{"method":"otp","timestamp":1}]}',true);
set local role authenticated;
insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000081');
do $$ begin
 assert (select count(*) from public.editorial_leads where customer_name='Teste de triagem')=1;
 update public.editorial_leads set status='contacted' where id='00000000-0000-4000-8000-000000000083';
 assert (select status from public.editorial_leads where id='00000000-0000-4000-8000-000000000083')='contacted';
 update public.editorial_leads set status='proposal_sent',internal_notes='Fixture de acompanhamento' where id='00000000-0000-4000-8000-000000000083';
 assert (select status='proposal_sent' and internal_notes='Fixture de acompanhamento' from public.editorial_leads where id='00000000-0000-4000-8000-000000000083');
end $$;
reset role;
rollback;
