-- NobreDNA — preparação inicial. Executar uma única vez em um projeto dedicado,
-- após revisão e validação. Sem dados fictícios e sem acesso público à loja.
begin;

create table public.store_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  author text not null check (char_length(author) between 1 and 200),
  description text not null default '',
  isbn text,
  cover_url text,
  price_cents integer check (price_cents > 0),
  stock integer not null default 0 check (stock >= 0),
  weight_g integer check (weight_g > 0),
  width_mm integer check (width_mm > 0),
  height_mm integer check (height_mm > 0),
  length_mm integer check (length_mm > 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint complete_active_product check (status <> 'active' or (
    price_cents is not null and length(trim(description)) > 0 and cover_url is not null
    and weight_g is not null and width_mm is not null and height_mm is not null and length_mm is not null
  ))
);

create table public.store_orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null check (jsonb_typeof(shipping_address) = 'object'),
  shipping_service text not null,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null check (shipping_cents >= 0),
  total_cents integer generated always as (subtotal_cents + shipping_cents) stored,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded','cancelled')),
  fulfillment_status text not null default 'pending' check (fulfillment_status in ('pending','preparing','shipped','delivered','cancelled')),
  tracking_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete restrict,
  product_id uuid not null references public.store_products(id) on delete restrict,
  title_snapshot text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity integer not null check (quantity > 0),
  line_total_cents bigint generated always as (unit_price_cents::bigint * quantity) stored,
  unique (order_id, product_id)
);

-- Apenas eventos conferidos no provedor serão gravados pelo backend futuro.
create table public.store_payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete restrict,
  provider text not null,
  provider_event_id text not null,
  provider_payment_id text not null,
  status text not null,
  amount_cents integer not null check (amount_cents >= 0),
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create index store_orders_created_idx on public.store_orders (created_at desc);
create index store_order_items_product_idx on public.store_order_items (product_id);
create index store_payment_events_order_idx on public.store_payment_events (order_id);

alter table public.store_admins enable row level security;
alter table public.store_products enable row level security;
alter table public.store_orders enable row level security;
alter table public.store_order_items enable row level security;
alter table public.store_payment_events enable row level security;

revoke all on public.store_admins, public.store_products, public.store_orders,
  public.store_order_items, public.store_payment_events from anon, authenticated, public;

grant select on public.store_admins to authenticated;
grant select, insert, update on public.store_products to authenticated;
grant select on public.store_orders, public.store_order_items to authenticated;
grant all on public.store_admins, public.store_products, public.store_orders,
  public.store_order_items, public.store_payment_events to service_role;

create policy "Read own admin membership" on public.store_admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Admin reads products" on public.store_products for select to authenticated
  using (exists (select 1 from public.store_admins where user_id = (select auth.uid())));
create policy "Admin creates products" on public.store_products for insert to authenticated
  with check (exists (select 1 from public.store_admins where user_id = (select auth.uid())));
create policy "Admin updates products" on public.store_products for update to authenticated
  using (exists (select 1 from public.store_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.store_admins where user_id = (select auth.uid())));

create policy "Admin reads orders" on public.store_orders for select to authenticated
  using (exists (select 1 from public.store_admins where user_id = (select auth.uid())));
create policy "Admin reads order items" on public.store_order_items for select to authenticated
  using (exists (select 1 from public.store_admins where user_id = (select auth.uid())));

commit;
