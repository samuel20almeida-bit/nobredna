-- Após fulfillment.sql. Operação idempotente e exclusiva do backend.
begin;

create function public.store_sweep_expired_reservations(p_limit integer default 50)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare row_id uuid; released integer := 0; waiting integer := 0;
begin
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception 'invalid_limit' using errcode='22023';
  end if;
  for row_id in
    select id from public.store_orders
    where reservation_status='reserved' and payment_status='pending'
      and reservation_expires_at<=now() and payment_preference_id is null
    order by reservation_expires_at, id
    limit p_limit for update skip locked
  loop
    if public.store_release_unsubmitted_order(row_id) then released:=released+1; end if;
  end loop;
  -- Uma reserva que chegou ao provedor nunca é liberada apenas pelo relógio:
  -- Pix, boleto e falhas de comunicação podem ter confirmação tardia.
  select count(*) into waiting from public.store_orders
    where reservation_status='payment_started' and payment_status='pending'
      and reservation_expires_at<=now();
  return jsonb_build_object('released',released,'awaiting_reconciliation',waiting);
end;
$$;
revoke all on function public.store_sweep_expired_reservations(integer) from public,anon,authenticated;
grant execute on function public.store_sweep_expired_reservations(integer) to service_role;
create index store_orders_payment_pending_idx on public.store_orders(reservation_expires_at)
  where reservation_status='payment_started' and payment_status='pending';

commit;
