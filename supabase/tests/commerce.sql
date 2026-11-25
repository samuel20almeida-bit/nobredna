-- Executar em banco de teste após os três scripts de schema. Fixtures revertidas.
begin;
do $$ begin
  assert not has_function_privilege('anon','public.store_reconcile_payment(text,text,text,text,integer,text,integer)','EXECUTE');
  assert not has_function_privilege('authenticated','public.store_reconcile_payment(text,text,text,text,integer,text,integer)','EXECUTE');
  assert not has_table_privilege('anon','public.store_orders','SELECT');
end $$;
set local role service_role;
do $$
declare
  b uuid:=gen_random_uuid();
  hidden uuid:=gen_random_uuid();
  ref text;
  oid uuid;
  result jsonb;
  payment text:=gen_random_uuid()::text;
  event text:=gen_random_uuid()::text;
  items jsonb;
begin
  insert into public.store_products(id,slug,title,author,description,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published)
  values(b,'teste-'||b::text,'Teste publicado','Autoria teste','Sinopse','/capa.png',4990,5,300,120,20,180,'active',true),
        (hidden,'teste-'||hidden::text,'Teste interno','Autoria teste','Sinopse','/capa.png',4990,5,300,120,20,180,'active',false);
  begin
    perform public.store_reserve_order(gen_random_uuid(),'Teste','teste@example.invalid','{}','Frete teste',1500,jsonb_build_array(jsonb_build_object('product_id',hidden,'quantity',1,'unit_price_cents',4990)));
    raise exception 'expected_failure';
  exception when raise_exception then assert sqlerrm='product_unavailable'; end;
  assert (select stock from public.store_products where id=hidden)=5;
  items:=jsonb_build_array(jsonb_build_object('product_id',b,'quantity',1,'unit_price_cents',4990));
  result:=public.store_reserve_order(gen_random_uuid(),'Teste','teste@example.invalid','{}','Frete teste',1500,items);
  ref:=result->>'reference'; oid:=(result->>'id')::uuid;
  assert public.store_begin_payment(oid);
  assert public.store_reconcile_payment(ref,event,payment,'pending',6490,'BRL',0)='pending';
  assert public.store_reconcile_payment(ref,event,payment,'pending',6490,'BRL',0)='duplicate';
  assert public.store_reconcile_payment(ref,event||'approved',payment,'approved',6490,'BRL',0)='paid';
  assert (select payment_status from public.store_orders where id=oid)='paid';
  assert (select stock from public.store_products where id=b)=4;
  assert public.store_reconcile_payment(ref,event||'other',gen_random_uuid()::text,'approved',6490,'BRL',0)='review';
  assert (select payment_review from public.store_orders where id=oid);
  assert public.store_reconcile_payment(ref,event||'refund',payment,'refunded',6490,'BRL',6490)='refunded';
  assert (select stock from public.store_products where id=b)=4;
  result:=public.store_reserve_order(gen_random_uuid(),'Teste','teste@example.invalid','{}','Frete teste',1500,items);
  ref:=result->>'reference'; oid:=(result->>'id')::uuid;
  assert public.store_begin_payment(oid);
  assert public.store_reconcile_payment(ref,event||'wrong-amount',gen_random_uuid()::text,'approved',1,'BRL',0)='review';
  assert (select payment_status from public.store_orders where id=oid)='pending';
end $$;
reset role;
set local role anon;
do $$ begin
 assert (select count(slug) from public.store_products where title='Teste publicado')=1;
 assert (select count(slug) from public.store_products where title='Teste interno')=0;
end $$;
rollback;
