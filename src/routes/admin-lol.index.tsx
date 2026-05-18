import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin-lol/")({ component: Dashboard });

type Order = { id: string; order_number: string; customer_name: string; total: number; status: string; created_at: string };
type Product = { id: string; name: string; price: number; stock: number; image_url: string | null };

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: o }, { data: p }] = await Promise.all([
        supabase.from("orders").select("id,order_number,customer_name,total,status,created_at").order("created_at", { ascending: false }),
        supabase.from("products").select("id,name,price,stock,image_url").order("created_at", { ascending: false }),
      ]);
      setOrders((o ?? []) as Order[]);
      setProducts((p ?? []) as Product[]);
    })();
  }, []);

  const revenue = orders.filter((o) => o.status !== "Refunded").reduce((s, o) => s + Number(o.total), 0);
  const stats = [
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign },
    { label: "Orders", value: String(orders.length), icon: ShoppingCart },
    { label: "SKUs live", value: String(products.length), icon: Package },
    { label: "Units in stock", value: String(products.reduce((s, p) => s + (p.stock ?? 0), 0)), icon: TrendingUp },
  ];

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <p className="eyebrow text-ink/50">Overview</p>
          <h1 className="display mt-2 text-4xl">Dashboard</h1>
        </div>
        <p className="text-sm text-ink/60">{new Date().toLocaleDateString()}</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-ink/10 bg-paper p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-ink/50">{s.label}</span>
                <Icon className="h-4 w-4 text-ink/40" />
              </div>
              <p className="display mt-3 text-3xl">{s.value}</p>
            </div>
          );
        })}
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="border border-ink/10 bg-paper p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          {orders.length === 0 ? <p className="mt-4 text-sm text-ink/50">No orders yet.</p> : (
            <table className="mt-4 w-full text-sm">
              <thead><tr className="border-b border-ink/10 text-left eyebrow text-ink/50">
                <th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th>
              </tr></thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-b border-ink/5">
                    <td className="py-3 font-medium">{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="border border-ink/10 bg-paper p-6">
          <h2 className="text-lg font-semibold">Inventory</h2>
          <ul className="mt-4 space-y-4">
            {products.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                {p.image_url && <img src={p.image_url} alt="" className="h-12 w-10 object-cover" />}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-ink/50">{p.stock} in stock · ${Number(p.price).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const cls = status === "Paid" || status === "Shipped" ? "bg-ink text-paper"
    : status === "Refunded" ? "bg-paper text-ink/50 border border-ink/15"
    : "bg-bone text-ink border border-ink/20";
  return <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{status}</span>;
}
