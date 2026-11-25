-- Execute apenas em um banco de teste após setup.sql, checkout.sql e commerce.sql.
-- Os dados de teste são revertidos ao final.
begin;

do $$
begin
  assert not has_function_privilege('anon','public.store_reserve_order(uuid,text,text,jsonb,text,integer,jsonb)','EXECUTE');
  assert not has_function_privilege('authenticated','public.store_reserve_order(uuid,text,text,jsonb,text,integer,jsonb)','EXECUTE');
  assert has_function_privilege('service_role','public.store_reserve_order(uuid,text,text,jsonb,text,integer,jsonb)','EXECUTE');
  assert not has_table_privilege('authenticated','public.store_orders','UPDATE');
end $$;

set local role service_role;

do $$
declare
  book uuid := gen_random_uuid();
  book_b uuid := gen_random_uuid();
  checkout uuid := gen_random_uuid();
  addr jsonb := '{"cep":"80010000"}'::jsonb;
  items jsonb;
  result jsonb;
  repeat_result jsonb;
  v_order_id uuid;
begin
  insert into public.store_products(id,slug,title,author,description,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published)
    values (book,'teste-' || book::text,'Livro de teste','Autoria teste','Sinopse de teste','/capa.png',4990,3,300,120,20,180,'active',true),
      (book_b,'teste-' || book_b::text,'Segundo teste','Autoria teste','Sinopse de teste','/capa.png',2990,0,300,120,20,180,'active',true);
  items := jsonb_build_array(jsonb_build_object('product_id',book,'quantity',2,'unit_price_cents',4990));

  result := public.store_reserve_order(checkout,'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,items);
  v_order_id := (result->>'id')::uuid;
  assert (result->>'total_cents')::integer = 11480;
  assert (select stock from public.store_products where id = book) = 1;
  assert (select title_snapshot from public.store_order_items where store_order_items.order_id = v_order_id) = 'Livro de teste';

  repeat_result := public.store_reserve_order(checkout,'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,items);
  assert repeat_result->>'id' = result->>'id';
  assert (select stock from public.store_products where id = book) = 1;

  begin
    perform public.store_reserve_order(checkout,'Outro cliente','teste@example.invalid',addr,'Frete de teste',1500,items);
    raise exception 'esperava conflito de tentativa';
  exception when invalid_parameter_value then assert sqlerrm = 'checkout_key_conflict'; end;

  begin
    perform public.store_reserve_order(gen_random_uuid(),'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,items);
    raise exception 'esperava falha de estoque';
  exception when raise_exception then assert sqlerrm = 'insufficient_stock'; end;

  begin
    perform public.store_reserve_order(gen_random_uuid(),'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,
      jsonb_build_array(jsonb_build_object('product_id',book,'quantity',1,'unit_price_cents',1)));
    raise exception 'esperava rejeição de preço';
  exception when raise_exception then assert sqlerrm = 'price_changed'; end;

  begin
    perform public.store_reserve_order(gen_random_uuid(),'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,
      jsonb_build_array(jsonb_build_object('product_id',book,'quantity',1,'unit_price_cents',4990),
        jsonb_build_object('product_id',book_b,'quantity',1,'unit_price_cents',2990)));
    raise exception 'esperava falha de estoque';
  exception when raise_exception then assert sqlerrm = 'insufficient_stock'; end;
  assert (select stock from public.store_products where id = book) = 1;

  assert public.store_release_unsubmitted_order(v_order_id);
  assert not public.store_release_unsubmitted_order(v_order_id);
  assert (select stock from public.store_products where id = book) = 3;

  result := public.store_reserve_order(gen_random_uuid(),'Cliente fictício','teste@example.invalid',addr,'Frete de teste',1500,items);
  v_order_id := (result->>'id')::uuid;
  assert public.store_begin_payment(v_order_id);
  assert not public.store_begin_payment(v_order_id);
  assert not public.store_release_unsubmitted_order(v_order_id);
  assert (select stock from public.store_products where id = book) = 1;
end $$;

rollback;
