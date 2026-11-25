-- Organiza retornos, histórico e contatos públicos, sem alterar os registros existentes.
begin;
alter table public.editorial_leads add column next_action text not null default '' check(char_length(next_action)<=240);
alter table public.editorial_leads add column follow_up_on date;
grant update(next_action,follow_up_on) on public.editorial_leads to authenticated;
create index editorial_leads_followup_idx on public.editorial_leads(follow_up_on) where status not in ('closed','lost') and follow_up_on is not null;

create table public.editorial_lead_events (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.editorial_leads(id) on delete cascade,
 created_at timestamptz not null default now(),
 from_status text not null,
 to_status text not null,
 notes_changed boolean not null default false,
 next_action text not null default '',
 follow_up_on date
);
alter table public.editorial_lead_events enable row level security;
revoke all on public.editorial_lead_events from public,anon,authenticated;
grant select on public.editorial_lead_events to authenticated;
create policy "Editors read own workspace history" on public.editorial_lead_events for select to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create index editorial_lead_events_recent_idx on public.editorial_lead_events(lead_id,created_at desc);
-- História somente por trigger, sem direito de inserção/edição pela API pública.
create function nobredna_private.record_editorial_lead_event() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if exists(select 1 from public.store_admins where user_id=(select auth.uid())) and
    (old.status is distinct from new.status or old.internal_notes is distinct from new.internal_notes or old.next_action is distinct from new.next_action or old.follow_up_on is distinct from new.follow_up_on) then
  insert into public.editorial_lead_events(lead_id,from_status,to_status,notes_changed,next_action,follow_up_on)
  values(new.id,old.status,new.status,old.internal_notes is distinct from new.internal_notes,new.next_action,new.follow_up_on);
 end if;
 return new;
end $$;
revoke all on function nobredna_private.record_editorial_lead_event() from public,anon,authenticated;
create trigger editorial_lead_activity after update on public.editorial_leads
for each row execute function nobredna_private.record_editorial_lead_event();

create table public.editorial_support_settings(
 singleton boolean primary key default true check(singleton),
 editorial_whatsapp text check(editorial_whatsapp is null or editorial_whatsapp ~ '^55[1-9][0-9]{9,10}$'),
 technical_whatsapp text check(technical_whatsapp is null or technical_whatsapp ~ '^55[1-9][0-9]{9,10}$')
);
alter table public.editorial_support_settings enable row level security;
revoke all on public.editorial_support_settings from public,anon,authenticated;
grant select(singleton,editorial_whatsapp) on public.editorial_support_settings to anon;
grant select(singleton,editorial_whatsapp,technical_whatsapp),update(editorial_whatsapp) on public.editorial_support_settings to authenticated;
create policy "Public support number" on public.editorial_support_settings for select to anon using(singleton);
create policy "Editors read support settings" on public.editorial_support_settings for select to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create policy "Editors update public support number" on public.editorial_support_settings for update to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())))
with check(singleton and exists(select 1 from public.store_admins where user_id=(select auth.uid())));
insert into public.editorial_support_settings(singleton) values(true);

create or replace function public.editorial_admin_overview() returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'total',(select count(*) from public.editorial_leads),
  'states',coalesce((select jsonb_object_agg(status,n) from (select status,count(*) n from public.editorial_leads group by status) s),'{}'::jsonb),
  'sources',coalesce((select jsonb_object_agg(source,n) from (select source,count(*) n from public.editorial_leads group by source) s),'{}'::jsonb),
  'books',(select count(*) from public.store_products),
  'orders',(select count(*) from public.store_orders where payment_status='paid' and fulfillment_status in ('preparing','shipped')),
  'readyToShip',(select count(*) from public.store_orders where payment_status='paid' and not payment_review and fulfillment_status='preparing'),
  'lowStock',(select count(*) from public.store_products where status='active' and stock<=3),
  'due',(select count(*) from public.editorial_leads where status not in ('closed','lost') and follow_up_on <= (now() at time zone 'America/Sao_Paulo')::date),
  'overdue',(select count(*) from public.editorial_leads where status not in ('closed','lost') and follow_up_on < (now() at time zone 'America/Sao_Paulo')::date)
 ) where exists(select 1 from public.store_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.editorial_admin_overview() from public,anon,authenticated;
grant execute on function public.editorial_admin_overview() to authenticated;
commit;
