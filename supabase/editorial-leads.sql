-- Captação exclusiva da NobreDNA. Aplicar depois de setup.sql.
begin;
create schema nobredna_private;
revoke all on schema nobredna_private from public,anon,authenticated;
grant usage on schema nobredna_private to anon,authenticated;

create table nobredna_private.capture_config (
  singleton boolean primary key default true check(singleton),
  token_hash text not null check(token_hash ~ '^[0-9a-f]{64}$')
);
create table nobredna_private.capture_rate_limits (
  key_hash text not null check(key_hash ~ '^[0-9a-f]{64}$'),
  bucket timestamptz not null,
  hits integer not null default 1,
  primary key(key_hash,bucket)
);
create table nobredna_private.admin_invites (
  email text primary key check(email=lower(email)),
  created_at timestamptz not null default now()
);
alter table nobredna_private.capture_config enable row level security;
alter table nobredna_private.capture_rate_limits enable row level security;
alter table nobredna_private.admin_invites enable row level security;
revoke all on all tables in schema nobredna_private from public,anon,authenticated;
create index capture_rate_limits_bucket_idx on nobredna_private.capture_rate_limits(bucket);

create function nobredna_private.capture_allowed() returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from nobredna_private.capture_config c where c.singleton and c.token_hash =
    encode(sha256(convert_to(coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-nobredna-capture',''),'UTF8')),'hex'));
$$;
revoke all on function nobredna_private.capture_allowed() from public,anon,authenticated;
grant execute on function nobredna_private.capture_allowed() to anon;

create table public.editorial_leads (
  id uuid primary key,
  protocol text generated always as ('ND-'||upper(replace(id::text,'-',''))) stored unique,
  source text not null check(source in ('editorial','coautoria','livros')),
  customer_name text not null check(char_length(trim(customer_name)) between 2 and 100),
  email text check(email is null or (char_length(email)<=160 and email=lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  phone text check(phone is null or phone ~ '^[0-9]{10,13}$'),
  details jsonb not null check(jsonb_typeof(details)='object' and octet_length(details::text)<=4000),
  consent boolean not null check(consent),
  status text not null default 'new' check(status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(email is not null or phone is not null)
);
alter table public.editorial_leads enable row level security;
revoke all on public.editorial_leads from public,anon,authenticated;
grant insert(id,source,customer_name,email,phone,details,consent) on public.editorial_leads to anon;
grant select on public.editorial_leads to authenticated;
grant update(status,updated_at) on public.editorial_leads to authenticated;
create policy "Capture via authorized website" on public.editorial_leads for insert to anon with check((select nobredna_private.capture_allowed()) and status='new' and consent);
create policy "Admin reads captured submissions" on public.editorial_leads for select to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create policy "Admin updates lead stage" on public.editorial_leads for update to authenticated
using(exists(select 1 from public.store_admins where user_id=(select auth.uid())))
with check(exists(select 1 from public.store_admins where user_id=(select auth.uid())));
create index editorial_leads_created_idx on public.editorial_leads(created_at desc);
create index editorial_leads_status_created_idx on public.editorial_leads(status,created_at desc);

create function nobredna_private.limit_capture() returns trigger
language plpgsql security definer set search_path='' as $$
declare k text; b timestamptz; n integer;
begin
  if not nobredna_private.capture_allowed() then raise exception 'capture_not_authorized' using errcode='42501'; end if;
  k:=nullif(current_setting('request.headers',true),'')::jsonb->>'x-nobredna-rate-key';
  if k is null or k !~ '^[0-9a-f]{64}$' then raise exception 'capture_not_authorized' using errcode='42501'; end if;
  b:=date_bin(interval '15 minutes',now(),timestamptz '2020-01-01 00:00:00+00');
  delete from nobredna_private.capture_rate_limits where bucket<now()-interval '2 hours';
  insert into nobredna_private.capture_rate_limits(key_hash,bucket) values(k,b)
  on conflict(key_hash,bucket) do update set hits=nobredna_private.capture_rate_limits.hits+1 returning hits into n;
  if n>12 then raise exception 'capture_rate_limited' using errcode='P0001'; end if;
  return new;
end $$;
revoke all on function nobredna_private.limit_capture() from public,anon,authenticated;
create trigger editorial_leads_limit before insert on public.editorial_leads for each row execute function nobredna_private.limit_capture();

-- A primeira entrada é concedida apenas após autenticação com link/código
-- de e-mail, a um e-mail explicitamente autorizado e confirmado pelo Auth.
create function nobredna_private.can_claim_admin(p_user_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select p_user_id=(select auth.uid()) and exists(
    select 1 from auth.users u join nobredna_private.admin_invites i on i.email=lower(u.email)
    where u.id=p_user_id and u.email_confirmed_at is not null
  ) and exists(select 1 from jsonb_array_elements(coalesce((select auth.jwt())->'amr','[]'::jsonb)) a
    where a->>'method' in ('otp','magiclink'));
$$;
revoke all on function nobredna_private.can_claim_admin(uuid) from public,anon,authenticated;
grant execute on function nobredna_private.can_claim_admin(uuid) to authenticated;
grant insert(user_id) on public.store_admins to authenticated;
create policy "Verified email invite claims own admin access" on public.store_admins for insert to authenticated
with check((select nobredna_private.can_claim_admin(user_id)));
commit;
