-- Isolated fixtures, reverted at the end; no provider calls.
begin;
do $$ begin
  assert not has_function_privilege('anon','public.store_sweep_expired_reservations(integer)','EXECUTE');
  assert not has_function_privilege('authenticated','public.store_sweep_expired_reservations(integer)','EXECUTE');
end $$;
set local role service_role;
do $$
declare b uuid:=gen_random_uuid();
  first_order uuid;
  started_order uuid;
  result jsonb;
  items jsonb;
begin
  insert into public.store_products(id,slug,title,author,description,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published)
  values(b,'teste-'||b::text,'Fixture manutenção','Teste','Sinopse','/capa.png',2990,5,300,120,20,180,'active',true);
  items:=jsonb_build_array(jsonb_build_object('product_id',b,'quantity',1,'unit_price_cents',2990));
  result:=public.store_reserve_order(gen_random_uuid(),'Teste','fixture@example.invalid','{}','Frete teste',1000,items);
  first_order:=(result->>'id')::uuid;
  result:=public.store_reserve_order(gen_random_uuid(),'Teste','fixture@example.invalid','{}','Frete teste',1000,items);
  started_order:=(result->>'id')::uuid;
  assert public.store_begin_payment(started_order);
  update public.store_orders set reservation_expires_at=now()-interval '1 hour' where id in(first_order,started_order);
  result:=public.store_sweep_expired_reservations(50);
  assert (result->>'released')::integer>=1;
  assert (result->>'awaiting_reconciliation')::integer>=1;
  assert (select reservation_status from public.store_orders where id=first_order)='released';
  assert (select reservation_status from public.store_orders where id=started_order)='payment_started';
  assert (select stock from public.store_products where id=b)=4;
  perform public.store_sweep_expired_reservations(50);
  assert (select stock from public.store_products where id=b)=4;
end $$;
rollback;
