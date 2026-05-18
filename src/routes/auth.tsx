import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · Baggy/Co Admin" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin-lol` },
        });
        if (error) throw error;
        setErr("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin-lol" });
      }
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-bone px-4">
      <div className="w-full max-w-md border border-ink/10 bg-paper p-8">
        <p className="eyebrow text-ink/50">Admin Console</p>
        <h1 className="display mt-2 text-3xl">{mode === "signin" ? "Sign in" : "Create admin"}</h1>
        <p className="mt-2 text-sm text-ink/60">
          {mode === "signin" ? "Access the Baggy/Co admin panel." : "First signup automatically becomes the admin."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="eyebrow text-ink/60">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:border-ink focus:outline-none" />
          </div>
          <div>
            <label className="eyebrow text-ink/60">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:border-ink focus:outline-none" />
          </div>
          {err && <p className="text-sm text-ink/80 border border-ink/30 bg-bone p-3">{err}</p>}
          <button disabled={busy} type="submit" className="w-full bg-ink px-5 py-3 eyebrow text-paper disabled:opacity-50">
            {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 eyebrow border-b border-ink/30 pb-0.5 text-ink/70 hover:text-ink">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
