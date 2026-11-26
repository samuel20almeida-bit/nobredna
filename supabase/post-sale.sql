-- Separate, private case management. Apply after editorial-leads.sql.
begin;
create table public.store_support_requests (
  id uuid primary key,
  protocol text generated always as ('ND-S-'||upper(replace(id::text,'-',''))) stored unique,
  category text not null check(category in ('withdrawal','defect','wrong_item','delivery','other')),
  customer_name text not null check(char_length(trim(customer_name)) between 2 and 100),
  email text not null check(email=lower(email) and char_length(email)<=160 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text check(phone is null or phone ~ '^[0-9]{10,13}$'),
  order_reference text not null default '' check(char_length(order_reference)<=100),
  book_title text not null default '' check(char_length(book_title)<=160),
  description text not null default '' check(char_length(description)<=2000),
  consent boolean not null check(consent),
  status text not null default 'new' check(status in ('new','reviewing','waiting_customer','resolved')),
  internal_notes text not null default '' check(char_length(internal_notes)<=4000),
  next_action text not null default '' check(char_length(next_action)<=240),
  first_response_at timestamptz,
  created_at timestamptz not null default now(),
  response_due_at timestamptz not null default (now()+interval '5 days'),
  updated_at timestamptz not null default now(),
  check(status<>'resolved' or first_response_at is not null)
);
alter table public.store_support_requests enable row level security;
revoke all on public.store_support_requests from public,anon,authenticated;
grant insert(id,category,customer_name,email,phone,order_reference,book_title,description,consent) on public.store_support_requests to anon;
grant select on public.store_support_requests to authenticated;
grant update(status,internal_notes,next_action,first_response_at) on public.store_support_requests to authenticated;
create policy "Capture support requests through official website" on public.store_support_requests for insert to anon
  with check((select nobredna_private.capture_allowed()) and status='new' and consent and first_response_at is null);
create policy "Administrators read support cases" on public.store_support_requests for select to authenticated
  using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create policy "Administrators manage support cases" on public.store_support_requests for update to authenticated
  using(exists(select 1 from public.store_admins where user_id=(select auth.uid())))
  with check(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create trigger store_support_limit before insert on public.store_support_requests for each row execute function nobredna_private.limit_capture();
create index store_support_status_created_idx on public.store_support_requests(status,created_at desc);
create index store_support_response_due_idx on public.store_support_requests(response_due_at) where first_response_at is null;

create table public.store_support_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.store_support_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  from_status text not null,
  to_status text not null,
  response_recorded boolean not null default false,
  notes_changed boolean not null default false
);
alter table public.store_support_events enable row level security;
revoke all on public.store_support_events from public,anon,authenticated;
grant select on public.store_support_events to authenticated;
create policy "Administrators read support case history" on public.store_support_events for select to authenticated
  using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create index store_support_events_recent_idx on public.store_support_events(request_id,created_at desc);

create function nobredna_private.record_support_change() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if not exists(select 1 from public.store_admins where user_id=(select auth.uid())) then
    raise exception 'support_not_authorized' using errcode='42501';
  end if;
  -- Registered response is monotonic and uses the database clock. A status
  -- change is operational only: it never updates an order or payment.
  if old.first_response_at is not null then new.first_response_at:=old.first_response_at;
  elsif new.first_response_at is not null then new.first_response_at:=now(); end if;
  new.updated_at:=now();
  if old.status is distinct from new.status or old.first_response_at is distinct from new.first_response_at
     or old.internal_notes is distinct from new.internal_notes or old.next_action is distinct from new.next_action then
    insert into public.store_support_events(request_id,from_status,to_status,response_recorded,notes_changed)
    values(new.id,old.status,new.status,old.first_response_at is null and new.first_response_at is not null,
           old.internal_notes is distinct from new.internal_notes or old.next_action is distinct from new.next_action);
  end if;
  return new;
end $$;
revoke all on function nobredna_private.record_support_change() from public,anon,authenticated;
create trigger store_support_changed before update on public.store_support_requests for each row execute function nobredna_private.record_support_change();

create function public.store_support_admin_counts() returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object(
    'new',count(*) filter(where status='new'),
    'pending',count(*) filter(where first_response_at is null),
    'overdue',count(*) filter(where first_response_at is null and response_due_at<=now()),
    'open',count(*) filter(where status in ('reviewing','waiting_customer')),
    'resolved',count(*) filter(where status='resolved')
  ) from public.store_support_requests
  having exists(select 1 from public.store_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.store_support_admin_counts() from public,anon,authenticated;
grant execute on function public.store_support_admin_counts() to authenticated;
commit;
