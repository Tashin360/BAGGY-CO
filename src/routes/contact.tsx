import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Baggy/Co" },
      { name: "description", content: "Wholesale, press, or just to say hi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-24 pt-12 md:grid-cols-12 lg:px-10">
      <div className="md:col-span-5">
        <p className="eyebrow text-ink/60">Get in touch</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">Say<br/>hello.</h1>

        <div className="mt-12 space-y-8 text-sm">
          <div>
            <p className="eyebrow text-ink/50">Studio</p>
            <p className="mt-2">Hornsgatan 24<br/>118 20 Stockholm, Sweden</p>
          </div>
          <div>
            <p className="eyebrow text-ink/50">General</p>
            <a href="mailto:hello@baggy.co" className="mt-2 inline-block border-b border-ink">hello@baggy.co</a>
          </div>
          <div>
            <p className="eyebrow text-ink/50">Wholesale & press</p>
            <a href="mailto:trade@baggy.co" className="mt-2 inline-block border-b border-ink">trade@baggy.co</a>
          </div>
        </div>
      </div>

      <form
        className="md:col-span-6 md:col-start-7"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thanks — we'll be in touch.");
        }}
      >
        <div className="space-y-8">
          {[
            { id: "name", label: "Name" },
            { id: "email", label: "Email", type: "email" },
            { id: "subject", label: "Subject" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="eyebrow text-ink/60">{f.label}</label>
              <input
                id={f.id}
                type={f.type ?? "text"}
                required
                className="mt-2 w-full border-b border-ink/30 bg-transparent py-3 text-lg focus:border-ink focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label htmlFor="msg" className="eyebrow text-ink/60">Message</label>
            <textarea
              id="msg"
              rows={5}
              required
              className="mt-2 w-full border-b border-ink/30 bg-transparent py-3 text-lg focus:border-ink focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-ink py-5 eyebrow text-paper hover:bg-ink/85">
            Send →
          </button>
        </div>
      </form>
    </div>
  );
}
