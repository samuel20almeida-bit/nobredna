-- Teste transacional: não envia e-mails e não deixa registros de teste.
begin;
do $$ begin
 assert not has_column_privilege('authenticated','public.store_orders','payment_status','UPDATE');
 assert has_column_privilege('authenticated','public.store_orders','fulfillment_status','UPDATE');
 assert not has_function_privilege('anon','public.store_allow_request(text,text)','EXECUTE');
end $$;

-- Fixture isolada de autorização; revertida no fim.
insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000071','fixture@example.invalid');
insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000071');
set local role service_role;
do $$
declare
 b uuid:=gen_random_uuid();
 result jsonb;
 ref text;
 oid uuid;
begin
 insert into public.store_products(id,slug,title,author,description,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published)
 values(b,'teste-'||b::text,'Fixture','Autoria teste','Sinopse','/capa.png',4990,5,300,120,20,180,'active',true);
 result:=public.store_reserve_order(gen_random_uuid(),'Teste','fixture@example.invalid','{}','Frete teste',1500,jsonb_build_array(jsonb_build_object('product_id',b,'quantity',1,'unit_price_cents',4990)));
 ref:=result->>'reference'; oid:=(result->>'id')::uuid;
 perform set_config('nobredna.fixture_ref',ref,true);
 assert public.store_begin_payment(oid);
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,gen_random_uuid()::text,'approved',6490,'BRL',0)='paid';
 assert (select count(*) from public.store_notifications where order_id=oid and kind='payment_confirmed')=1;
 for i in 1..4 loop assert public.store_allow_request('checkout',repeat('a',64));end loop;
 assert not public.store_allow_request('checkout',repeat('a',64));
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000071',true);
set local role authenticated;
do $$
declare ref text:=current_setting('nobredna.fixture_ref');
begin
 assert auth.uid()='00000000-0000-4000-8000-000000000071'::uuid;
 update public.store_orders set fulfillment_status='shipped',tracking_code='TEST12345' where reference=ref;
 assert (select fulfillment_status from public.store_orders where reference=ref)='shipped';
 assert (select count(*) from public.store_notifications where order_id=(select id from public.store_orders where reference=ref) and kind='shipped')=1;
 update public.store_orders set fulfillment_status='delivered' where reference=ref;
 assert (select fulfillment_status from public.store_orders where reference=ref)='delivered';
end $$;
rollback;
