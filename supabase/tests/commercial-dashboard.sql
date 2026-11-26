-- All simulated orders, payment events, inventory and admin fixture roll back.
begin;
do $$ begin
 assert not has_function_privilege('anon','public.store_commercial_admin_summary(text)','EXECUTE');
 assert not has_column_privilege('authenticated','public.store_orders','paid_at','UPDATE');
 assert not has_column_privilege('authenticated','public.store_orders','payment_status','UPDATE');
end $$;
insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000083','commercial-fixture@example.invalid');
insert into public.store_admins(user_id) values('00000000-0000-4000-8000-000000000083');
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000083',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000083","role":"authenticated"}',true);
set local role authenticated;
select set_config('nobredna.fixture.sales_baseline',public.store_commercial_admin_summary('all')::text,true);
select set_config('nobredna.fixture.month_baseline',public.store_commercial_admin_summary('month')::text,true);
reset role;
set local role service_role;
do $$ declare
 b uuid:=gen_random_uuid(); result jsonb; ref text; oid uuid; payment text; items jsonb;
begin
 insert into public.store_products(id,slug,title,author,description,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published)
 values(b,'teste-'||b::text,'Fixture comercial','Autoria teste','Sinopse','/capa.png',5000,10,300,120,20,180,'active',true);
 items:=jsonb_build_array(jsonb_build_object('product_id',b,'quantity',1,'unit_price_cents',5000));
 -- Current verified paid sale: 5,000 merchandise + 1,000 shipping.
 result:=public.store_reserve_order(gen_random_uuid(),'QA','qa@example.invalid','{}','Frete teste',1000,items);ref:=result->>'reference';oid:=(result->>'id')::uuid;
 perform set_config('nobredna.fixture.order',ref,true);
 assert public.store_begin_payment(oid);
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,gen_random_uuid()::text,'approved',6000,'BRL',0)='paid';
 assert (select paid_at is not null from public.store_orders where id=oid);
 -- Pending checkout never contributes to revenue.
 result:=public.store_reserve_order(gen_random_uuid(),'QA','qa@example.invalid','{}','Frete teste',1000,items);
 -- One fully refunded sale never contributes to current confirmed revenue.
 result:=public.store_reserve_order(gen_random_uuid(),'QA','qa@example.invalid','{}','Frete teste',1000,items);ref:=result->>'reference';oid:=(result->>'id')::uuid;payment:=gen_random_uuid()::text;
 assert public.store_begin_payment(oid);
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,payment,'approved',6000,'BRL',0)='paid';
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,payment,'refunded',6000,'BRL',6000)='refunded';
 assert (select refunded_at is not null from public.store_orders where id=oid);
 -- One confirmed order under review is excluded.
 result:=public.store_reserve_order(gen_random_uuid(),'QA','qa@example.invalid','{}','Frete teste',1000,items);ref:=result->>'reference';oid:=(result->>'id')::uuid;
 assert public.store_begin_payment(oid);
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,gen_random_uuid()::text,'approved',6000,'BRL',0)='paid';
 update public.store_orders set payment_review=true where id=oid;
 -- Older paid order remains in the operational queue, not the current month.
 result:=public.store_reserve_order(gen_random_uuid(),'QA','qa@example.invalid','{}','Frete teste',1000,items);ref:=result->>'reference';oid:=(result->>'id')::uuid;
 assert public.store_begin_payment(oid);
 assert public.store_reconcile_payment(ref,gen_random_uuid()::text,gen_random_uuid()::text,'approved',6000,'BRL',0)='paid';
 update public.store_orders set paid_at=now()-interval '40 days' where id=oid;
end $$;
reset role;
set local role authenticated;
do $$ declare b jsonb:=current_setting('nobredna.fixture.sales_baseline')::jsonb; m0 jsonb:=current_setting('nobredna.fixture.month_baseline')::jsonb; a jsonb:=public.store_commercial_admin_summary('all'); m jsonb:=public.store_commercial_admin_summary('month'); ref text:=current_setting('nobredna.fixture.order'); begin
 assert (a->>'sales')::bigint=(b->>'sales')::bigint+2;
 assert (a->>'revenue')::bigint=(b->>'revenue')::bigint+12000;
 assert (a->>'merchandise')::bigint=(b->>'merchandise')::bigint+10000;
 assert (a->>'shipping')::bigint=(b->>'shipping')::bigint+2000;
 assert (m->>'sales')::bigint=(m0->>'sales')::bigint+1;
 assert (m->>'revenue')::bigint=(m0->>'revenue')::bigint+6000;
 if (m0->>'sales')::bigint=0 then
   assert (m->>'average')::bigint=6000;
   assert m->'ranking' @> '[{"title":"Fixture comercial","units":1,"revenue":5000}]'::jsonb;
 end if;
 assert (a->>'pending')::bigint=(b->>'pending')::bigint+1;
 assert (a->>'review')::bigint=(b->>'review')::bigint+1;
 assert (a->>'closed')::bigint=(b->>'closed')::bigint+1;
 assert (m->>'preparing')::bigint=(m0->>'preparing')::bigint+2;
 assert (a->>'stockUnits')::bigint=(b->>'stockUnits')::bigint+5;
 update public.store_orders set fulfillment_status='shipped',tracking_code='FIXTURE123' where reference=ref;
 assert (select shipped_at is not null from public.store_orders where reference=ref);
 update public.store_orders set fulfillment_status='delivered' where reference=ref;
 assert (select delivered_at is not null and shipped_at is not null and paid_at is not null from public.store_orders where reference=ref);
end $$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('request.jwt.claim.sub'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin assert public.store_commercial_admin_summary('all') is null;end $$;
reset role;
rollback;
select 'PASS: confirmed sales, refunds, review, inventory, period, fulfillment and admin permissions' as result;
