-- Segunda etapa: reserva transacional do estoque, antes do pagamento.
-- Aplicar após setup.sql, em um projeto dedicado. Funções privadas para o backend.
begin;

alter table public.store_orders
  add column checkout_key uuid unique,
  add column reservation_status text not null default 'reserved'
    check (reservation_status in ('reserved','payment_started','committed','released')),
  add column reservation_expires_at timestamptz,
  add column payment_preference_id text unique;

-- O backend deve enviar preços obtidos do catálogo, nunca preços do navegador.
-- Cada função executa em uma transação. A resposta contém apenas a referência
-- e o total; endereços e demais dados pessoais não são devolvidos.
create function public.store_reserve_order(
  p_checkout_key uuid,
  p_customer_name text,
  p_customer_email text,
  p_shipping_address jsonb,
  p_shipping_service text,
  p_shipping_cents integer,
  p_items jsonb
) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  existing public.store_orders%rowtype;
  book public.store_products%rowtype;
  line record;
  item_count integer;
  subtotal bigint := 0;
  created_order public.store_orders%rowtype;
  canonical_items jsonb;
  existing_items jsonb;
begin
  if p_checkout_key is null or p_customer_name is null or char_length(trim(p_customer_name)) not between 1 and 200
    or p_customer_email is null or char_length(p_customer_email) not between 3 and 254
    or p_shipping_address is null or jsonb_typeof(p_shipping_address) <> 'object'
    or p_shipping_service is null or char_length(trim(p_shipping_service)) not between 1 and 160
    or p_shipping_cents is null or p_shipping_cents not between 0 and 10000000
    or p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'invalid_order' using errcode = '22023';
  end if;

  item_count := jsonb_array_length(p_items);
  if item_count not between 1 and 30 then raise exception 'invalid_cart' using errcode = '22023'; end if;
  if exists (
    select 1 from jsonb_to_recordset(p_items) as i(product_id uuid, quantity integer, unit_price_cents integer)
    where i.product_id is null or i.quantity is null or i.quantity not between 1 and 12
      or i.unit_price_cents is null or i.unit_price_cents not between 1 and 10000000
  ) or (select count(distinct i.product_id) from jsonb_to_recordset(p_items) as i(product_id uuid)) <> item_count
    or (select sum(i.quantity) from jsonb_to_recordset(p_items) as i(quantity integer)) > 30 then
    raise exception 'invalid_cart' using errcode = '22023';
  end if;

  select jsonb_agg(jsonb_build_object('product_id', i.product_id, 'quantity', i.quantity, 'unit_price_cents', i.unit_price_cents) order by i.product_id)
    into canonical_items from jsonb_to_recordset(p_items) as i(product_id uuid, quantity integer, unit_price_cents integer);

  -- Serializa repetições da mesma tentativa sem afetar outros carrinhos.
  perform pg_advisory_xact_lock(hashtextextended(p_checkout_key::text, 0));
  select * into existing from public.store_orders where checkout_key = p_checkout_key;
  if found then
    select jsonb_agg(jsonb_build_object('product_id', i.product_id, 'quantity', i.quantity, 'unit_price_cents', i.unit_price_cents) order by i.product_id)
      into existing_items from public.store_order_items i where i.order_id = existing.id;
    if existing.customer_name is distinct from p_customer_name or existing.customer_email is distinct from p_customer_email
      or existing.shipping_address is distinct from p_shipping_address or existing.shipping_service is distinct from p_shipping_service
      or existing.shipping_cents is distinct from p_shipping_cents or existing_items is distinct from canonical_items then
      raise exception 'checkout_key_conflict' using errcode = '22023';
    end if;
    return jsonb_build_object('id', existing.id, 'reference', existing.reference, 'subtotal_cents', existing.subtotal_cents,
      'shipping_cents', existing.shipping_cents, 'total_cents', existing.total_cents, 'reservation_status', existing.reservation_status,
      'expires_at', existing.reservation_expires_at);
  end if;

  -- Mesma ordem de bloqueio em todos os pedidos, evitando deadlocks entre livros.
  for line in select * from jsonb_to_recordset(canonical_items) as i(product_id uuid, quantity integer, unit_price_cents integer) order by i.product_id loop
    select * into book from public.store_products where id = line.product_id for update;
    if not found or book.status <> 'active' or book.price_cents is null then raise exception 'product_unavailable' using errcode = 'P0001'; end if;
    if book.stock < line.quantity then raise exception 'insufficient_stock' using errcode = 'P0001'; end if;
    if book.price_cents <> line.unit_price_cents then raise exception 'price_changed' using errcode = 'P0001'; end if;
    subtotal := subtotal + book.price_cents::bigint * line.quantity;
  end loop;

  insert into public.store_orders (reference, checkout_key, customer_name, customer_email, shipping_address, shipping_service,
    subtotal_cents, shipping_cents, reservation_expires_at)
  values ('NDNA-' || upper(replace(gen_random_uuid()::text, '-', '')), p_checkout_key, p_customer_name, p_customer_email,
    p_shipping_address, p_shipping_service, subtotal::integer, p_shipping_cents, now() + interval '30 minutes')
  returning * into created_order;

  for line in select * from jsonb_to_recordset(canonical_items) as i(product_id uuid, quantity integer, unit_price_cents integer) order by i.product_id loop
    update public.store_products set stock = stock - line.quantity, updated_at = now() where id = line.product_id returning * into book;
    insert into public.store_order_items (order_id, product_id, title_snapshot, unit_price_cents, quantity)
      values (created_order.id, book.id, book.title, book.price_cents, line.quantity);
  end loop;

  return jsonb_build_object('id', created_order.id, 'reference', created_order.reference, 'subtotal_cents', created_order.subtotal_cents,
    'shipping_cents', created_order.shipping_cents, 'total_cents', created_order.total_cents, 'reservation_status', created_order.reservation_status,
    'expires_at', created_order.reservation_expires_at);
end;
$$;

-- Antes de tentar criar uma preferência externa, o backend deve marcar o
-- pedido como payment_started. Após essa transição, só uma conciliação com
-- o provedor poderá liberar o estoque; não basta o tempo ter expirado.
create function public.store_begin_payment(p_order_id uuid) returns boolean
language sql security invoker set search_path = '' as $$
  with changed as (
    update public.store_orders set reservation_status = 'payment_started', updated_at = now()
    where id = p_order_id and reservation_status = 'reserved' and payment_status = 'pending'
      and reservation_expires_at > now()
    returning id
  ) select exists(select 1 from changed);
$$;

-- Cancela apenas reservas ainda não encaminhadas ao provedor. Operação
-- idempotente: a segunda tentativa não incrementa o estoque novamente.
create function public.store_release_unsubmitted_order(p_order_id uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  reserved public.store_orders%rowtype;
  line record;
begin
  select * into reserved from public.store_orders where id = p_order_id for update;
  if not found or reserved.reservation_status <> 'reserved' or reserved.payment_status <> 'pending'
    or reserved.payment_preference_id is not null then return false; end if;
  for line in select product_id, quantity from public.store_order_items where order_id = p_order_id order by product_id loop
    update public.store_products set stock = stock + line.quantity, updated_at = now() where id = line.product_id;
  end loop;
  update public.store_orders set reservation_status = 'released', payment_status = 'cancelled',
    fulfillment_status = 'cancelled', updated_at = now() where id = p_order_id;
  return true;
end;
$$;

revoke all on function public.store_reserve_order(uuid,text,text,jsonb,text,integer,jsonb) from public, anon, authenticated;
revoke all on function public.store_begin_payment(uuid) from public, anon, authenticated;
revoke all on function public.store_release_unsubmitted_order(uuid) from public, anon, authenticated;
grant execute on function public.store_reserve_order(uuid,text,text,jsonb,text,integer,jsonb) to service_role;
grant execute on function public.store_begin_payment(uuid) to service_role;
grant execute on function public.store_release_unsubmitted_order(uuid) to service_role;

create index store_order_reservation_idx on public.store_orders (reservation_expires_at) where reservation_status = 'reserved';

commit;
