-- Expedição e fila transacional de e-mails, após commerce.sql.
begin;

create table public.store_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete restrict,
  kind text not null check(kind in ('payment_confirmed','shipped')),
  status text not null default 'pending' check(status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  first_attempt_at timestamptz,
  updated_at timestamptz not null default now(),
  provider_id text,
  created_at timestamptz not null default now(),
  unique(order_id,kind)
);
alter table public.store_notifications enable row level security;
revoke all on public.store_notifications from public,anon,authenticated;
grant all on public.store_notifications to service_role;
grant select on public.store_notifications to authenticated;
grant insert(order_id,kind) on public.store_notifications to authenticated;
create policy "Admin reads notification status" on public.store_notifications for select to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create policy "Admin queues eligible notifications" on public.store_notifications for insert to authenticated
with check(exists(select 1 from public.store_admins where user_id=(select auth.uid())) and exists(
  select 1 from public.store_orders o where o.id=order_id and o.payment_status='paid' and not o.payment_review
  and (kind='payment_confirmed' or (kind='shipped' and o.fulfillment_status in ('shipped','delivered')))
));

grant update(fulfillment_status,tracking_code,updated_at) on public.store_orders to authenticated;
create policy "Admin ships confirmed orders" on public.store_orders for update to authenticated
using(payment_status='paid' and not payment_review and exists(select 1 from public.store_admins where user_id=(select auth.uid())))
with check(payment_status='paid' and not payment_review and exists(select 1 from public.store_admins where user_id=(select auth.uid())));

create function public.store_check_fulfillment() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if current_user='authenticated' then
    if old.payment_status<>'paid' or old.payment_review then raise exception 'payment_not_confirmed'; end if;
    if not ((old.fulfillment_status='preparing' and new.fulfillment_status='shipped') or
       (old.fulfillment_status='shipped' and new.fulfillment_status='delivered') or
       (old.fulfillment_status=new.fulfillment_status)) then raise exception 'invalid_fulfillment_transition'; end if;
    if new.fulfillment_status in ('shipped','delivered') and (new.tracking_code is null or new.tracking_code !~ '^[A-Za-z0-9_-]{4,80}$') then
      raise exception 'tracking_required';
    end if;
    if old.fulfillment_status in ('shipped','delivered') and new.tracking_code is distinct from old.tracking_code then
      raise exception 'tracking_already_sent';
    end if;
  end if;
  return new;
end $$;
revoke all on function public.store_check_fulfillment() from public,anon,authenticated;
create trigger store_check_fulfillment before update on public.store_orders for each row execute function public.store_check_fulfillment();

create function public.store_queue_notification() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.payment_status='paid' and not new.payment_review and old.payment_status is distinct from new.payment_status then
    insert into public.store_notifications(order_id,kind) values(new.id,'payment_confirmed') on conflict(order_id,kind) do nothing;
  end if;
  if new.payment_status='paid' and not new.payment_review and new.fulfillment_status='shipped' and old.fulfillment_status<>'shipped' then
    insert into public.store_notifications(order_id,kind) values(new.id,'shipped') on conflict(order_id,kind) do nothing;
  end if;
  return new;
end $$;
revoke all on function public.store_queue_notification() from public,anon,authenticated;
create trigger store_queue_notification after update on public.store_orders for each row execute function public.store_queue_notification();

-- Guarda de requisições: apenas identificadores pseudonimizados e curta retenção.
create table public.store_request_limits (
  scope text not null check(scope in ('quote','checkout')),
  key_hash text not null,
  bucket timestamptz not null,
  hits integer not null default 1,
  primary key(scope,key_hash,bucket)
);
alter table public.store_request_limits enable row level security;
revoke all on public.store_request_limits from public,anon,authenticated;
grant all on public.store_request_limits to service_role;
create index store_request_limits_bucket_idx on public.store_request_limits(bucket);
create function public.store_allow_request(p_scope text,p_hash text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer; b timestamptz; max_hits integer;
begin
  if p_scope not in ('quote','checkout') or p_hash !~ '^[0-9a-f]{64}$' then return false; end if;
  b:=date_bin(interval '15 minutes',now(),timestamptz '2020-01-01 00:00:00+00');
  max_hits:=case when p_scope='quote' then 20 else 4 end;
  delete from public.store_request_limits where bucket<now()-interval '2 hours';
  insert into public.store_request_limits(scope,key_hash,bucket) values(p_scope,p_hash,b)
  on conflict(scope,key_hash,bucket) do update set hits=public.store_request_limits.hits+1 returning hits into n;
  return n<=max_hits;
end $$;
revoke all on function public.store_allow_request(text,text) from public,anon,authenticated;
grant execute on function public.store_allow_request(text,text) to service_role;

commit;
