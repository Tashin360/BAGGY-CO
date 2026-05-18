import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Baggy/Co" },
      { name: "description", content: "Review your bag and complete your order." },
    ],
  }),
  component: Checkout,
});

// Demo bag — first two products, qty 1 each.
const demoBag = [
  { product: products[0], size: "L", qty: 1 },
  { product: products[3], size: "M", qty: 1 },
];

function Checkout() {
  const [items, setItems] = useState(demoBag);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  const updateQty = (slug: string, delta: number) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.slug === slug ? { ...i, qty: Math.max(0, i.qty + delta) } : i,
        )
        .filter((i) => i.qty > 0),
    );

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow text-ink">Order received</p>
        <h1 className="display mt-4 text-5xl md:text-6xl">Thank you.</h1>
        <p className="mt-6 text-ink/70">
          A confirmation is on its way. Your pieces will ship within 2 business days.
        </p>
        <Link
          to="/shop"
          className="eyebrow mt-10 inline-block border-b border-ink pb-1"
        >
          Keep browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <p className="eyebrow text-ink/60">Step 02 / 02</p>
      <h1 className="display mt-4 text-5xl md:text-7xl">Checkout</h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (items.length === 0) return;
            setBusy(true); setErr(null);
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const customer_name = `${fd.get("first")} ${fd.get("last")}`.trim();
            const customer_email = String(fd.get("email") ?? "");
            const { data: order, error } = await supabase.from("orders").insert({
              customer_name, customer_email,
              subtotal, shipping, total, status: "Pending",
            }).select("id").single();
            if (error || !order) { setErr(error?.message ?? "Failed to place order"); setBusy(false); return; }
            const { error: itemsErr } = await supabase.from("order_items").insert(
              items.map((i) => ({ order_id: order.id, product_name: i.product.name, quantity: i.qty, unit_price: i.product.price }))
            );
            setBusy(false);
            if (itemsErr) { setErr(itemsErr.message); return; }
            setSubmitted(true);
          }}
          className="space-y-10 lg:col-span-7"
        >
          <Section title="Contact">
            <Field label="Email" type="email" name="email" required placeholder="you@domain.com" />
          </Section>

          <Section title="Shipping">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" name="first" required />
              <Field label="Last name" name="last" required />
            </div>
            <Field label="Address" name="address" required />
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" name="city" required />
              <Field label="Postal code" name="zip" required />
              <Field label="Country" name="country" required defaultValue="Sweden" />
            </div>
          </Section>

          <Section title="Payment">
            <div className="border border-ink/30 bg-bone p-5">
              <p className="eyebrow text-ink">Cash on Delivery</p>
              <p className="mt-2 text-sm text-ink/70">
                Pay with cash when your order is delivered to your address. No card required.
              </p>
            </div>
          </Section>

          {err && <p className="text-sm text-ink/80 border border-ink/30 bg-bone p-3">{err}</p>}
          <button
            type="submit"
            disabled={items.length === 0 || busy}
            className="w-full bg-ink py-5 eyebrow text-paper transition-colors hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Placing order…" : `Confirm order (Cash on Delivery) — $${total}`}
          </button>
          <p className="text-xs text-ink/50">
            By placing your order you agree to our terms. You'll pay in cash when your order arrives.
          </p>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="border border-ink/15 bg-bone/40 p-6 md:p-8">
            <p className="eyebrow text-ink/60">Your bag ({items.length})</p>

            <ul className="mt-6 divide-y divide-ink/10">
              {items.length === 0 && (
                <li className="py-6 text-sm text-ink/60">
                  Your bag is empty.{" "}
                  <Link to="/shop" className="underline">Add a piece</Link>.
                </li>
              )}
              {items.map(({ product, size, qty }) => (
                <li key={product.slug} className="flex gap-4 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square h-20 w-20 bg-paper object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm">${product.price * qty}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-ink/60">Size {size} · {product.color}</p>
                      <div className="flex items-center border border-ink/20">
                        <button
                          type="button"
                          onClick={() => updateQty(product.slug, -1)}
                          className="px-2 text-sm hover:bg-ink hover:text-paper"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 text-xs">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.slug, 1)}
                          className="px-2 text-sm hover:bg-ink hover:text-paper"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-ink/15 pt-6 text-sm">
              <Row label="Subtotal" value={`$${subtotal}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping}`} />
              <Row label="Total" value={`$${total}`} bold />
            </dl>
          </div>

          <p className="mt-4 text-xs text-ink/50">
            Free shipping over $200. 30-day returns on unworn pieces.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-4 text-ink/60">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs text-ink/60">{label}</span>
      <input
        {...props}
        className="mt-1 w-full border border-ink/20 bg-paper px-3 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-medium" : "text-ink/70"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}