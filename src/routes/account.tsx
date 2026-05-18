import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account · Baggy/Co" },
      { name: "description", content: "Sign in to track your Baggy/Co orders." },
    ],
  }),
  component: AccountPage,
});

type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
};

function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="eyebrow text-ink/40">Loading account…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 lg:px-10">
      <p className="eyebrow text-ink/60">Customer</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">My Account</h1>

      <div className="mt-12">
        {session ? <SignedIn session={session} /> : <AuthForm />}
      </div>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (error) throw error;
        setMsg("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="border border-ink/15 bg-paper p-8">
          <p className="eyebrow text-ink/50">{mode === "signin" ? "Returning customer" : "New customer"}</p>
          <h2 className="display mt-2 text-3xl">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {mode === "signin"
              ? "Sign in to view your orders and shipping info."
              : "Make checkout faster and keep track of your orders."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />

            {msg && <p className="text-sm text-ink/80 border border-ink/20 bg-bone p-3">{msg}</p>}
            {err && <p className="text-sm text-ink border border-ink/40 bg-bone p-3">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink py-4 eyebrow text-paper hover:bg-ink/85 disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setErr(null); setMsg(null); setMode(mode === "signin" ? "signup" : "signin"); }}
            className="mt-5 eyebrow text-ink/60 underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "New here? Create an account →" : "Have an account? Sign in →"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="border border-ink/15 bg-bone p-10">
          <p className="eyebrow text-ink/50">Member benefits</p>
          <ul className="mt-6 space-y-4 text-sm text-ink/80">
            <li>◇ Track every order placed with your email.</li>
            <li>◇ Faster checkout — your details, ready to go.</li>
            <li>◇ Early access to limited drops.</li>
            <li>◇ Cash on delivery on every order.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SignedIn({ session }: { session: Session }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id, order_number, total, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setOrders(data as Order[]);
      });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-4">
        <div className="border border-ink/15 bg-paper p-8">
          <p className="eyebrow text-ink/50">Signed in as</p>
          <p className="mt-3 text-base font-medium break-all">{session.user.email}</p>
          <p className="mt-1 text-xs text-ink/50">
            Member since {new Date(session.user.created_at).toLocaleDateString()}
          </p>

          <div className="mt-6 space-y-2">
            <Link to="/shop" className="block w-full bg-ink py-3 text-center eyebrow text-paper hover:bg-ink/85">
              Continue shopping
            </Link>
            <button
              onClick={signOut}
              className="block w-full border border-ink py-3 text-center eyebrow text-ink hover:bg-ink hover:text-paper"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8">
        <p className="eyebrow text-ink/60">Your orders</p>
        <h2 className="display mt-2 text-3xl">Order history</h2>

        <div className="mt-6 border border-ink/15 bg-paper">
          {orders === null && (
            <p className="p-8 text-sm text-ink/50">Loading orders…</p>
          )}
          {err && <p className="p-8 text-sm text-ink/70">{err}</p>}
          {orders && orders.length === 0 && (
            <div className="p-10 text-center">
              <p className="display text-2xl text-ink/80">No orders yet.</p>
              <p className="mt-2 text-sm text-ink/50">
                When you place an order with this email, it'll appear here.
              </p>
              <Link to="/shop" className="eyebrow mt-6 inline-block border-b border-ink pb-1">
                Browse the shop →
              </Link>
            </div>
          )}
          {orders && orders.length > 0 && (
            <ul className="divide-y divide-ink/10">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="text-sm font-medium">{o.order_number}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(o.created_at).toLocaleDateString()} · {o.status}
                    </p>
                  </div>
                  <p className="text-sm">${Number(o.total).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label, type = "text", value, onChange, required, minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-ink/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="mt-2 w-full border border-ink/15 bg-paper px-3 py-3 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}
