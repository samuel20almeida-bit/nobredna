-- Resumo em uma consulta e outbox de confirmações. Após editorial-crm.sql.
begin;
create function public.editorial_admin_overview() returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'total',(select count(*) from public.editorial_leads),
  'states',coalesce((select jsonb_object_agg(status,n) from (select status,count(*) n from public.editorial_leads group by status) s),'{}'::jsonb),
  'sources',coalesce((select jsonb_object_agg(source,n) from (select source,count(*) n from public.editorial_leads group by source) s),'{}'::jsonb),
  'books',(select count(*) from public.store_products),
  'orders',(select count(*) from public.store_orders where payment_status='paid' and fulfillment_status in ('preparing','shipped')),
  'lowStock',(select count(*) from public.store_products where status='active' and stock<=3)
 ) where exists(select 1 from public.store_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.editorial_admin_overview() from public,anon,authenticated;
grant execute on function public.editorial_admin_overview() to authenticated;

create table public.editorial_notifications (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.editorial_leads(id) on delete cascade,
 kind text not null check(kind in ('receipt','admin_alert')),
 status text not null default 'pending' check(status in ('pending','sending','sent','failed','review')),
 attempts integer not null default 0 check(attempts>=0),
 recipient text,
 first_attempt_at timestamptz,
 next_attempt_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 provider_id text,
 failure_code text,
 created_at timestamptz not null default now(),
 unique(lead_id,kind)
);
alter table public.editorial_notifications enable row level security;
revoke all on public.editorial_notifications from public,anon,authenticated;
grant select(id,lead_id,kind,status,attempts,updated_at,failure_code) on public.editorial_notifications to authenticated;
grant select,insert,update on public.editorial_notifications to service_role;
grant select on public.editorial_leads to service_role;
create policy "Admin views editorial email progress" on public.editorial_notifications for select to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create index editorial_notifications_pending_idx on public.editorial_notifications(lead_id,status);

-- Executada apenas após um INSERT que já passou pela política de captação.
-- Sem leitura ou envio de e-mails pelo papel anônimo.
create function nobredna_private.queue_editorial_notifications() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if new.email is not null and new.email not like '%@%.invalid' then
  insert into public.editorial_notifications(lead_id,kind) values(new.id,'receipt');
 end if;
 if new.email is null or new.email not like '%@%.invalid' then
  insert into public.editorial_notifications(lead_id,kind) values(new.id,'admin_alert');
 end if;
 return new;
end $$;
revoke all on function nobredna_private.queue_editorial_notifications() from public,anon,authenticated;
create trigger editorial_notifications_insert after insert on public.editorial_leads
for each row execute function nobredna_private.queue_editorial_notifications();
commit;
