-- Commercial reporting and factual fulfillment timestamps. No payment or order
-- transition logic is changed. Existing timestamps are not invented.
begin;
alter table public.store_orders
  add column paid_at timestamptz,
  add column shipped_at timestamptz,
  add column delivered_at timestamptz,
  add column refunded_at timestamptz,
  add column cancelled_at timestamptz;

create function nobredna_private.stamp_order_state() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='INSERT' then
    new.paid_at:=case when new.payment_status='paid' then now() end;
    new.shipped_at:=case when new.fulfillment_status='shipped' then now() end;
    new.delivered_at:=case when new.fulfillment_status='delivered' then now() end;
    new.refunded_at:=case when new.payment_status='refunded' then now() end;
    new.cancelled_at:=case when new.payment_status='cancelled' then now() end;
  else
    new.paid_at:=coalesce(old.paid_at,case when old.payment_status<>new.payment_status and new.payment_status='paid' then now() end);
    new.shipped_at:=coalesce(old.shipped_at,case when old.fulfillment_status<>new.fulfillment_status and new.fulfillment_status='shipped' then now() end);
    new.delivered_at:=coalesce(old.delivered_at,case when old.fulfillment_status<>new.fulfillment_status and new.fulfillment_status='delivered' then now() end);
    new.refunded_at:=coalesce(old.refunded_at,case when old.payment_status<>new.payment_status and new.payment_status='refunded' then now() end);
    new.cancelled_at:=coalesce(old.cancelled_at,case when old.payment_status<>new.payment_status and new.payment_status='cancelled' then now() end);
  end if;
  return new;
end $$;
revoke all on function nobredna_private.stamp_order_state() from public,anon,authenticated;
create trigger store_order_timestamps before insert or update of payment_status,fulfillment_status on public.store_orders
  for each row execute function nobredna_private.stamp_order_state();

create index store_order_paid_at_idx on public.store_orders(paid_at) where payment_status='paid' and not payment_review;
create index store_order_operations_idx on public.store_orders(payment_status,fulfillment_status,payment_review,created_at desc);
create index store_support_order_reference_idx on public.store_support_requests(order_reference) where order_reference<>'';

-- Metrics reflect current verified paid orders in the selected confirmation
-- period, not draft orders, leads, refunds or disputed amounts. Operational
-- counts cover all dates so a pending shipment cannot disappear with a filter.
create function public.store_commercial_admin_summary(p_period text default 'month') returns jsonb
language sql stable security invoker set search_path='' as $$
  with bounds as (
    select case p_period
      when 'all' then '-infinity'::timestamptz
      when '7d' then (((now() at time zone 'America/Sao_Paulo')::date-6)::timestamp at time zone 'America/Sao_Paulo')
      when '30d' then (((now() at time zone 'America/Sao_Paulo')::date-29)::timestamp at time zone 'America/Sao_Paulo')
      else date_trunc('month',now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'
    end as start_at
  ), eligible_orders as (
    select o.id,o.total_cents,o.subtotal_cents,o.shipping_cents from public.store_orders o cross join bounds b
    where o.payment_status='paid' and not o.payment_review and o.paid_at>=b.start_at
  ), commercial as (
    select count(*) as sales,coalesce(sum(total_cents),0) as revenue,
           coalesce(sum(subtotal_cents),0) as merchandise,coalesce(sum(shipping_cents),0) as shipping,
           coalesce(round(avg(total_cents)),0) as average from eligible_orders
  ), ranking as (
    select i.product_id,max(i.title_snapshot) as title,sum(i.quantity) as units,sum(i.line_total_cents) as revenue
    from public.store_order_items i join eligible_orders o on o.id=i.order_id
    group by i.product_id order by units desc,revenue desc,i.product_id limit 5
  ), stock as (
    select count(*) as titles,coalesce(sum(stock),0) as units,count(*) filter(where stock<=3) as low
    from public.store_products where status='active' and published
  ), ops as (
    select count(*) filter(where payment_status='pending' and not payment_review) as pending,
           count(*) filter(where payment_status='paid' and not payment_review and fulfillment_status='preparing') as preparing,
           count(*) filter(where payment_status='paid' and not payment_review and fulfillment_status='shipped') as shipped,
           count(*) filter(where payment_status='paid' and not payment_review and fulfillment_status='delivered') as delivered,
           count(*) filter(where (payment_review or (payment_status='paid' and fulfillment_status not in ('preparing','shipped','delivered'))) and payment_status not in ('refunded','failed','cancelled')) as review,
           count(*) filter(where payment_status in ('refunded','failed','cancelled')) as closed,
           count(*) filter(where payment_status='paid' and not payment_review and paid_at is null) as missing_date
    from public.store_orders
  )
  select jsonb_build_object('sales',c.sales,'revenue',c.revenue,'merchandise',c.merchandise,'shipping',c.shipping,'average',c.average,
    'ranking',coalesce((select jsonb_agg(jsonb_build_object('title',r.title,'units',r.units,'revenue',r.revenue) order by r.units desc,r.revenue desc,r.product_id) from ranking r),'[]'::jsonb),
    'stockTitles',s.titles,'stockUnits',s.units,'lowStock',s.low,'pending',o.pending,'preparing',o.preparing,'shipped',o.shipped,'delivered',o.delivered,'review',o.review,'closed',o.closed,'missingDate',o.missing_date)
  from commercial c cross join stock s cross join ops o
  where exists(select 1 from public.store_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.store_commercial_admin_summary(text) from public,anon,authenticated;
grant execute on function public.store_commercial_admin_summary(text) to authenticated;
commit;
