import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Search, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/admin-lol/products")({ component: ProductsAdmin });

type Product = {
  id: string; slug: string; name: string; category: string; color: string;
  price: number; stock: number; image_url: string | null; description: string | null;
};

const empty = { slug: "", name: "", category: "Tops", color: "Black", price: 0, stock: 0, image_url: "", description: "" };

function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<typeof empty>(empty);
  const [editing, setEditing] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Product[]);
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setBusy(true);
    const slug = draft.slug.trim() || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("products").insert({
      ...draft, slug, price: Number(draft.price), stock: Number(draft.stock),
      image_url: draft.image_url || null, description: draft.description || null,
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setDraft(empty); setOpen(false); load();
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setErr(null); setBusy(true);
    const { error } = await supabase.from("products").update({
      name: editing.name, slug: editing.slug, category: editing.category, color: editing.color,
      price: Number(editing.price), stock: Number(editing.stock),
      image_url: editing.image_url || null, description: editing.description || null,
    }).eq("id", editing.id);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setEditing(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  };

  const updateField = async (p: Product, field: "price" | "stock", value: number) => {
    setItems((prev) => prev.map((x) => x.id === p.id ? { ...x, [field]: value } : x));
    const patch = field === "price" ? { price: value } : { stock: value };
    await supabase.from("products").update(patch).eq("id", p.id);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="eyebrow text-ink/50">Catalog</p>
          <h1 className="display mt-2 text-4xl">Products</h1>
        </div>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-ink px-4 py-2.5 eyebrow text-paper">
          <Plus className="h-4 w-4" /> {open ? "Cancel" : "New product"}
        </button>
      </header>

      {open && (
        <form onSubmit={add} className="border border-ink/10 bg-paper p-6 grid gap-4 md:grid-cols-2">
          <Field label="Name"><input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Slug (optional)"><input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} /></Field>
          <Field label="Category">
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputCls}>
              <option>Tops</option><option>Pants</option><option>Outerwear</option>
            </select>
          </Field>
          <Field label="Color">
            <select value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} className={inputCls}>
              <option>Black</option><option>White</option>
            </select>
          </Field>
          <Field label="Price (USD)"><input type="number" min={0} step="0.01" required value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={inputCls} /></Field>
          <Field label="Stock"><input type="number" min={0} required value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className={inputCls} /></Field>
          <Field label="Image URL" className="md:col-span-2"><input value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="https://..." className={inputCls} /></Field>
          <Field label="Description" className="md:col-span-2"><textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} /></Field>
          {err && <p className="md:col-span-2 text-sm text-ink/80 border border-ink/30 bg-bone p-3">{err}</p>}
          <div className="md:col-span-2"><button disabled={busy} className="bg-ink px-5 py-2.5 eyebrow text-paper disabled:opacity-50">{busy ? "Saving…" : "Save product"}</button></div>
        </form>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="w-full border border-ink/15 bg-paper py-2.5 pl-10 pr-4 text-sm focus:border-ink focus:outline-none" />
      </div>

      <div className="border border-ink/10 bg-paper">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-ink/10 text-left eyebrow text-ink/50">
            <th className="px-4 py-3">Product</th><th>Category</th><th>Color</th><th>Price</th><th>Stock</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/50">No products yet.</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink/5">
                <td className="flex items-center gap-3 px-4 py-3">
                  {p.image_url && <img src={p.image_url} alt="" className="h-12 w-10 object-cover" />}
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-ink/50">{p.slug}</p></div>
                </td>
                <td>{p.category}</td><td>{p.color}</td>
                <td><input type="number" step="0.01" value={p.price} onChange={(e) => updateField(p, "price", Number(e.target.value))} className="w-24 border border-ink/15 bg-paper px-2 py-1" /></td>
                <td><input type="number" value={p.stock} onChange={(e) => updateField(p, "stock", Number(e.target.value))} className="w-20 border border-ink/15 bg-paper px-2 py-1" /></td>
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditing(p)} className="text-ink/60 hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => del(p.id)} className="text-ink/60 hover:text-ink" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={saveEdit} className="w-full max-w-2xl border border-ink/10 bg-paper p-6 grid gap-4 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
            <div className="md:col-span-2 flex items-center justify-between">
              <h2 className="display text-2xl">Edit product</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-ink/60 hover:text-ink"><X className="h-5 w-5" /></button>
            </div>
            <Field label="Name"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Slug"><input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} /></Field>
            <Field label="Category">
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls}>
                <option>Tops</option><option>Pants</option><option>Outerwear</option>
              </select>
            </Field>
            <Field label="Color">
              <select value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} className={inputCls}>
                <option>Black</option><option>White</option>
              </select>
            </Field>
            <Field label="Price (USD)"><input type="number" min={0} step="0.01" required value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="Stock"><input type="number" min={0} required value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="Image URL" className="md:col-span-2"><input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." className={inputCls} /></Field>
            <Field label="Description" className="md:col-span-2"><textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls} /></Field>
            {err && <p className="md:col-span-2 text-sm text-ink/80 border border-ink/30 bg-bone p-3">{err}</p>}
            <div className="md:col-span-2 flex gap-3">
              <button disabled={busy} className="bg-ink px-5 py-2.5 eyebrow text-paper disabled:opacity-50">{busy ? "Saving…" : "Save changes"}</button>
              <button type="button" onClick={() => setEditing(null)} className="px-5 py-2.5 eyebrow text-ink/70 hover:text-ink">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:border-ink focus:outline-none";
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="eyebrow text-ink/60">{label}</span><div className="mt-2">{children}</div></label>;
}
