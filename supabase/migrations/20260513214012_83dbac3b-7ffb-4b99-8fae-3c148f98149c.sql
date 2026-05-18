
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null default 'Tops',
  color text not null default 'Black',
  price numeric(10,2) not null default 0,
  stock integer not null default 0,
  image_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('ORD-' || lpad((floor(random()*100000))::text, 5, '0')),
  customer_name text not null,
  customer_email text not null,
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products: public read, authenticated write
create policy "products_select_all" on public.products for select using (true);
create policy "products_insert_auth" on public.products for insert to authenticated with check (true);
create policy "products_update_auth" on public.products for update to authenticated using (true) with check (true);
create policy "products_delete_auth" on public.products for delete to authenticated using (true);

-- Orders: anyone can create, only authenticated can view/update
create policy "orders_insert_anyone" on public.orders for insert with check (true);
create policy "orders_select_auth" on public.orders for select to authenticated using (true);
create policy "orders_update_auth" on public.orders for update to authenticated using (true) with check (true);
create policy "orders_delete_auth" on public.orders for delete to authenticated using (true);

create policy "order_items_insert_anyone" on public.order_items for insert with check (true);
create policy "order_items_select_auth" on public.order_items for select to authenticated using (true);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();
