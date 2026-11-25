begin;
create or replace function public.editorial_admin_overview() returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'total',(select count(*) from public.editorial_leads),
  'states',coalesce((select jsonb_object_agg(status,n) from (select status,count(*) n from public.editorial_leads group by status) s),'{}'::jsonb),
  'sources',coalesce((select jsonb_object_agg(source,n) from (select source,count(*) n from public.editorial_leads group by source) s),'{}'::jsonb),
  'editorialTotal',(select count(*) from public.editorial_leads where source<>'livros'),
  'editorialStates',coalesce((select jsonb_object_agg(status,n) from (select status,count(*) n from public.editorial_leads where source<>'livros' group by status) s),'{}'::jsonb),
  'purchaseStates',coalesce((select jsonb_object_agg(status,n) from (select status,count(*) n from public.editorial_leads where source='livros' group by status) s),'{}'::jsonb),
  'editorialDue',(select count(*) from public.editorial_leads where source<>'livros' and status not in ('closed','lost') and follow_up_on <= (now() at time zone 'America/Sao_Paulo')::date),
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
