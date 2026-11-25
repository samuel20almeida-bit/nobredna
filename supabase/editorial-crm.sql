-- Extensão compatível com a captação existente. Aplicar após editorial-leads.sql.
begin;
alter table public.editorial_leads drop constraint editorial_leads_status_check;
alter table public.editorial_leads add constraint editorial_leads_status_check
  check(status in ('new','contacted','proposal_sent','negotiating','closed','lost'));
alter table public.editorial_leads add column internal_notes text not null default ''
  check(char_length(internal_notes)<=4000);
grant update(internal_notes) on public.editorial_leads to authenticated;
create index editorial_leads_source_created_idx on public.editorial_leads(source,created_at desc);
commit;
