import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import look1 from "@/assets/lookbook-1.jpg";
import look2 from "@/assets/lookbook-2.jpg";
import p1 from "@/assets/product-1.jpg";
import p3 from "@/assets/product-3.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Baggy/Co" },
      { name: "description", content: "FW25 lookbook. Oversized silhouettes shot in black and white." },
    ],
  }),
  component: Lookbook,
});

function Lookbook() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-12 lg:px-10">
      <div className="border-b border-ink/15 pb-10">
        <p className="eyebrow text-ink/60">FW25 / Vol. 01</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">Lookbook</h1>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-6">
        <figure className="col-span-12 md:col-span-7">
          <img src={hero} alt="Look 01" loading="lazy" width={1080} height={1920} className="aspect-[3/4] w-full bg-bone object-cover" />
          <figcaption className="eyebrow mt-3 text-ink/60">Look 01 — Boxy Tee 004 / Wide Cargo 001</figcaption>
        </figure>
        <div className="col-span-12 flex flex-col justify-end md:col-span-5">
          <p className="display text-4xl md:text-6xl">Volume<br/>over noise.</p>
          <p className="mt-6 max-w-sm text-ink/70">A study in proportion. The pieces are intentionally one or two sizes larger than the body — the silhouette does the talking.</p>
        </div>

        <figure className="col-span-12 mt-16 md:col-span-5">
          <img src={p1} alt="Look 02" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full bg-bone object-cover" />
          <figcaption className="eyebrow mt-3 text-ink/60">Look 02 — Wide Cargo 001</figcaption>
        </figure>
        <figure className="col-span-12 mt-16 md:col-span-7">
          <img src={look1} alt="Look 03" loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full bg-bone object-cover" />
          <figcaption className="eyebrow mt-3 text-ink/60">Look 03 — Long coat / Wide Denim</figcaption>
        </figure>

        <figure className="col-span-12 mt-16 md:col-span-7">
          <img src={look2} alt="Look 04" loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full bg-bone object-cover" />
          <figcaption className="eyebrow mt-3 text-ink/60">Look 04 — Fabric study</figcaption>
        </figure>
        <figure className="col-span-12 mt-16 md:col-span-5">
          <img src={p3} alt="Look 05" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full bg-bone object-cover" />
          <figcaption className="eyebrow mt-3 text-ink/60">Look 05 — Wide Denim 003</figcaption>
        </figure>
      </div>
    </div>
  );
}
