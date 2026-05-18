import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatusPill } from "./admin-lol.index";

export const Route = createFileRoute("/admin-lol/orders")({ component: Orders });

type Item = { product_name: string; quantity: number; unit_price: number };
type Order = {
  id: string; order_number: string; customer_name: string; customer_email: string;
  subtotal: number; shipping: number; total: number; status: string; created_at: string;
  order_items: Item[];
};

const STATUSES = ["Pending", "Paid", "Shipped", "Refunded"] as const;

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*, order_items(product_name, quantity, unit_price)").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
  };

  const totals = orders.reduce((acc, o) => {
    if (o.status !== "Refunded") acc.revenue += Number(o.total);
    acc.units += o.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    return acc;
  }, { revenue: 0, units: 0 });

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="eyebrow text-ink/50">Fulfillment</p>
          <h1 className="display mt-2 text-4xl">Orders</h1>
        </div>
        <div className="text-right text-sm">
          <p className="text-ink/60">Revenue (excl. refunds)</p>
          <p className="display text-2xl">${totals.revenue.toFixed(2)}</p>
          <p className="text-xs text-ink/50">{totals.units} units · {orders.length} orders</p>
        </div>
      </header>

      <div className="border border-ink/10 bg-paper">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-ink/10 text-left eyebrow text-ink/50">
            <th className="px-4 py-3">Order</th><th>Customer</th><th>Items</th>
            <th>Subtotal</th><th>Shipping</th><th>Total</th><th>Status</th><th>Date</th>
          </tr></thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/50">No orders yet.</td></tr>}
            {orders.map((o) => {
              const units = o.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
              const isOpen = openId === o.id;
              return (
                <Fragment key={o.id}>
                  <tr className="border-b border-ink/5 cursor-pointer hover:bg-bone/40" onClick={() => setOpenId(isOpen ? null : o.id)}>
                    <td className="px-4 py-3 font-medium">{o.order_number}</td>
                    <td><p>{o.customer_name}</p><p className="text-xs text-ink/50">{o.customer_email}</p></td>
                    <td>{units}</td>
                    <td>${Number(o.subtotal).toFixed(2)}</td>
                    <td>${Number(o.shipping).toFixed(2)}</td>
                    <td className="font-semibold">${Number(o.total).toFixed(2)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="border border-ink/15 bg-paper px-2 py-1 text-xs">
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-ink/60">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-bone/40"><td colSpan={8} className="px-4 py-4">
                      <p className="eyebrow text-ink/50 mb-2">Line items</p>
                      <ul className="space-y-1 text-sm">
                        {o.order_items?.map((i, idx) => (
                          <li key={idx} className="flex justify-between border-b border-ink/5 py-1">
                            <span>{i.product_name} × {i.quantity}</span>
                            <span>${(Number(i.unit_price) * i.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </td></tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink/50">Tip: click any row to see line items. Status: <StatusPill status="Pending" /> <StatusPill status="Paid" /> <StatusPill status="Refunded" /></p>
    </div>
  );
}
