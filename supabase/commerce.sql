-- Catálogo publicável e conciliação do pagamento, após checkout.sql.
begin;

alter table public.store_products add column published boolean not null default false;
alter table public.store_products add constraint published_active_product check (not published or status = 'active');
grant select (id, slug, title, author, description, isbn, cover_url, price_cents, stock, published, status) on public.store_products to anon;
create policy "Published active books are publicly readable" on public.store_products for select to anon
  using (published and status = 'active');

-- A verificação também acontece dentro da transação que bloqueia o produto,
-- para impedir a reserva de um título retirado da vitrine após a consulta.
create function public.store_require_published_item() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if not exists(select 1 from public.store_products where id=new.product_id and published and status='active') then
    raise exception 'product_unavailable' using errcode='P0001';
  end if;
  return new;
end $$;
revoke all on function public.store_require_published_item() from public,anon,authenticated;
grant execute on function public.store_require_published_item() to service_role;
create trigger store_require_published_item before insert on public.store_order_items
for each row execute function public.store_require_published_item();

alter table public.store_orders add column provider_payment_id text unique;
alter table public.store_orders add column payment_review boolean not null default false;
alter table public.store_orders add column checkout_url text;

-- Apenas o backend pode chamar após consultar o pagamento na API oficial.
-- O retorno do navegador nunca é suficiente para mudar a situação.
create function public.store_reconcile_payment(
  p_reference text, p_event_id text, p_payment_id text, p_status text,
  p_amount_cents integer, p_currency text, p_refunded_cents integer
) returns text
language plpgsql security invoker set search_path = '' as $$
declare
  target_order public.store_orders%rowtype;
  inserted_id uuid;
begin
  select * into target_order from public.store_orders where reference = p_reference for update;
  if not found then return 'ignored'; end if;
  if p_payment_id is null or p_event_id is null or p_status is null or p_amount_cents is null
    or p_amount_cents < 0 or p_refunded_cents is null or p_refunded_cents < 0 then
    raise exception 'invalid_payment';
  end if;
  insert into public.store_payment_events(order_id,provider,provider_event_id,provider_payment_id,status,amount_cents)
    values (target_order.id,'mercadopago',p_event_id,p_payment_id,p_status,p_amount_cents)
    on conflict (provider,provider_event_id) do nothing returning id into inserted_id;
  if inserted_id is null then return 'duplicate'; end if;

  if p_currency is distinct from 'BRL' or p_amount_cents <> target_order.total_cents then
    update public.store_orders set payment_review=true,updated_at=now() where id=target_order.id;
    return 'review';
  end if;
  if p_status in ('approved','refunded','charged_back') and (
    target_order.reservation_status not in ('payment_started','committed') or
    (target_order.provider_payment_id is not null and target_order.provider_payment_id <> p_payment_id) or
    exists(select 1 from public.store_orders where provider_payment_id=p_payment_id and id<>target_order.id)
  ) then
    update public.store_orders set payment_review=true,updated_at=now() where id=target_order.id;
    return 'review';
  end if;

  if p_status='approved' and p_refunded_cents=0 and target_order.payment_status='pending' then
    update public.store_orders set payment_status='paid',reservation_status='committed',provider_payment_id=p_payment_id,
      fulfillment_status='preparing',updated_at=now() where id=target_order.id;
    return 'paid';
  end if;
  if p_status='refunded' and p_refunded_cents=p_amount_cents and target_order.provider_payment_id=p_payment_id and target_order.payment_status='paid' then
    update public.store_orders set payment_status='refunded',payment_review=true,updated_at=now() where id=target_order.id;
    return 'refunded'; -- Estoque não volta automaticamente: depende da devolução física.
  end if;
  if p_status in ('refunded','charged_back') or p_refunded_cents>0 then
    update public.store_orders set payment_review=true,updated_at=now() where id=target_order.id;
    return 'review';
  end if;
  -- Pagamentos ainda pendentes ou recusados não liberam a reserva. Pode haver
  -- nova tentativa dentro da preferência; é necessária conciliação de expiração.
  return target_order.payment_status;
end;
$$;
revoke all on function public.store_reconcile_payment(text,text,text,text,integer,text,integer) from public,anon,authenticated;
grant execute on function public.store_reconcile_payment(text,text,text,text,integer,text,integer) to service_role;

commit;

