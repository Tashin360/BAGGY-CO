CREATE POLICY "orders_owner_select"
ON public.orders
FOR SELECT
TO authenticated
USING (lower(customer_email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "order_items_owner_select"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND lower(o.customer_email) = lower((auth.jwt() ->> 'email'))
  )
);