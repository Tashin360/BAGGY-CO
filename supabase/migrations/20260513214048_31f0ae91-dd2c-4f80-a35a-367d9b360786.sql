
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- Auto-grant admin to the first signup, user role to everyone else
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_first boolean;
begin
  select count(*) = 0 into is_first from public.user_roles where role = 'admin';
  insert into public.user_roles (user_id, role)
  values (new.id, case when is_first then 'admin'::public.app_role else 'user'::public.app_role end);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Fix search_path on existing function
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Tighten policies: admins only for management
drop policy if exists "products_insert_auth" on public.products;
drop policy if exists "products_update_auth" on public.products;
drop policy if exists "products_delete_auth" on public.products;
drop policy if exists "orders_select_auth" on public.orders;
drop policy if exists "orders_update_auth" on public.orders;
drop policy if exists "orders_delete_auth" on public.orders;
drop policy if exists "order_items_select_auth" on public.order_items;

create policy "products_admin_insert" on public.products for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "products_admin_update" on public.products for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "products_admin_delete" on public.products for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "orders_admin_select" on public.orders for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "orders_admin_update" on public.orders for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "orders_admin_delete" on public.orders for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "order_items_admin_select" on public.order_items for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Roles policies: users can view their own roles
create policy "user_roles_self_select" on public.user_roles for select to authenticated
  using (auth.uid() = user_id);
