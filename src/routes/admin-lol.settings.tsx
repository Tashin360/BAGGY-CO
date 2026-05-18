import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-lol/settings")({ component: Settings });

function Settings() {
  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <p className="eyebrow text-ink/50">Configuration</p>
        <h1 className="display mt-2 text-4xl">Settings</h1>
      </header>

      <div className="space-y-6 border border-ink/10 bg-paper p-6">
        <div>
          <label className="eyebrow text-ink/60">Store name</label>
          <input defaultValue="Baggy/Co" className="mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:border-ink focus:outline-none" />
        </div>
        <div>
          <label className="eyebrow text-ink/60">Support email</label>
          <input defaultValue="hello@baggy.co" className="mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:border-ink focus:outline-none" />
        </div>
        <div>
          <label className="eyebrow text-ink/60">Currency</label>
          <select className="mt-2 w-full border border-ink/15 bg-paper px-3 py-2.5 text-sm">
            <option>USD — US Dollar</option><option>EUR — Euro</option><option>SEK — Krona</option>
          </select>
        </div>
        <button className="bg-ink px-5 py-2.5 eyebrow text-paper">Save changes</button>
      </div>
    </div>
  );
}
