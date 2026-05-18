import { createFileRoute } from "@tanstack/react-router";
import look2 from "@/assets/lookbook-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Baggy/Co" },
      { name: "description", content: "A small Stockholm studio cutting oversized cotton in two shades." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-12 lg:px-10">
        <p className="eyebrow text-ink/60">About</p>
        <h1 className="display mt-6 max-w-5xl text-5xl md:text-8xl">
          We started in a basement in Stockholm with one pattern and a roll of cotton.
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-6 py-12 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <img src={look2} alt="Fabric" loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-12">
          <p className="eyebrow text-ink/60">N° 01 — Why baggy</p>
          <p className="mt-4 text-xl text-ink/80">
            Most clothes are cut to flatter. We cut to last and to move. Wide legs, dropped shoulders, room to breathe — the silhouette ages slowly because it never tried to be current.
          </p>

          <p className="eyebrow mt-12 text-ink/60">N° 02 — Why two colors</p>
          <p className="mt-4 text-xl text-ink/80">
            Black and white go with everything you already own. Anything else would just be inventory we'd have to convince you to buy.
          </p>

          <p className="eyebrow mt-12 text-ink/60">N° 03 — How we make it</p>
          <p className="mt-4 text-xl text-ink/80">
            Cotton is woven in Portugal. Patterns cut and sewn in Porto by a family workshop we've worked with since day one. We make small runs. When a piece sells out, we make it again.
          </p>
        </div>
      </section>

      <section className="border-t border-ink/15">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 divide-ink/15 px-6 md:grid-cols-3 md:divide-x lg:px-10">
          {[
            ["2023", "Started in a basement"],
            ["04", "Pieces in the line"],
            ["100%", "Heavyweight cotton"],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col gap-2 px-6 py-12">
              <span className="display text-6xl">{n}</span>
              <span className="eyebrow text-ink/60">{l}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
