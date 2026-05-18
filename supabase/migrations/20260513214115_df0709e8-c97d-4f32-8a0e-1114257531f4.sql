
-- Restrict order creation: must be Pending status (admins can later update)
drop policy if exists "orders_insert_anyone" on public.orders;
create policy "orders_insert_public" on public.orders for insert
  with check (status = 'Pending');

drop policy if exists "order_items_insert_anyone" on public.order_items;
create policy "order_items_insert_public" on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.status = 'Pending')
  );

-- Revoke public/auth execute on internal functions
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
