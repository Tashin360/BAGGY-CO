import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin-lol")({
  head: () => ({ meta: [{ title: "Admin · Baggy/Co" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin-lol", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin-lol/products", label: "Products", icon: Package, exact: false },
  { to: "/admin-lol/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { to: "/admin-lol/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!mounted) return;
      const isAdmin = roles?.some((r) => r.role === "admin");
      setEmail(session.user.email ?? null);
      setStatus(isAdmin ? "ok" : "denied");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => { if (!s) navigate({ to: "/auth" }); });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  if (status === "loading") return <div className="flex min-h-screen items-center justify-center bg-bone text-ink/60">Loading…</div>;
  if (status === "denied") return (
    <div className="flex min-h-screen items-center justify-center bg-bone p-6 text-center">
      <div>
        <h1 className="display text-3xl">Access denied</h1>
        <p className="mt-2 text-ink/60">This account isn't an admin.</p>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }} className="mt-6 bg-ink px-5 py-2.5 eyebrow text-paper">Sign out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bone text-ink">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="border-r border-ink/10 bg-paper p-6 flex flex-col">
          <Link to="/" className="impact block text-2xl">BAGGY/CO</Link>
          <p className="eyebrow mt-1 text-ink/50">Admin Console</p>

          <nav className="mt-10 space-y-1">
            {links.map((l) => {
              const Icon = l.icon;
              const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${active ? "bg-ink text-paper" : "text-ink/70 hover:bg-bone"}`}>
                  <Icon className="h-4 w-4" />{l.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 text-xs text-ink/50">{email}</div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
            className="mt-3 flex items-center gap-3 px-3 py-2.5 text-sm text-ink/60 hover:text-ink">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        <main className="p-8 lg:p-12"><Outlet /></main>
      </div>
    </div>
  );
}
