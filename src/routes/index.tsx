import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchProducts, type Product } from "@/lib/products";
import { PageLoader } from "@/components/PageLoader";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import m1 from "@/assets/model-1.jpg";
import m2 from "@/assets/model-2.jpg";
import m3 from "@/assets/model-3.jpg";
import m4 from "@/assets/model-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baggy/Co — Cut Wide. Worn Forever." },
      { name: "description", content: "Heavyweight, oversized, monochrome clothing. Cut wide. Made to last." },
    ],
  }),
  loader: () => fetchProducts(),
  pendingComponent: () => <PageLoader label="Loading the collection" />,
  pendingMs: 0,
  errorComponent: ({ error }) => (
    <div className="p-12 text-center text-sm text-ink/60">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-12 text-center">Not found</div>,
  component: Index,
});

const heroGrid = [m1, m2, m3, m4];

function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <div className={`overflow-hidden border-y py-3 ${dark ? "border-paper/20 bg-ink text-paper" : "border-ink/80 bg-paper text-ink"}`}>
      <div className="marquee-track flex whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
            {Array.from({ length: 8 }).map((_, j) => (
              <span key={j} className="eyebrow flex items-center gap-10">
                {items[j % items.length]}
                <span aria-hidden>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const products = Route.useLoaderData();
  return (
    <div className="bg-paper text-ink">
      {/* HERO — black headline bands + 4 model grid + floating CTA */}
      <section className="relative bg-paper">
        {/* Editorial split: oversized type + hero image + thumbnail strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left — type column */}
          <div className="relative z-10 flex flex-col justify-between border-b border-ink/10 px-6 py-12 lg:col-span-7 lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-ink/60">FW25 — Vol. 01</p>
              <p className="eyebrow text-ink/40">N° 001</p>
            </div>

            <div className="py-12 lg:py-0">
              <h1 className="impact text-[22vw] leading-[0.82] text-ink lg:text-[10.5vw]">
                CUT
                <br />
                WIDE.
              </h1>
              <p className="display mt-6 text-3xl text-ink/90 lg:text-5xl">
                Worn forever.
              </p>
              <p className="mt-6 max-w-md text-sm text-ink/60 lg:text-base">
                Heavyweight cotton, oversized patterns, two shades only. A small set
                of staples cut for people who take up space.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="eyebrow inline-flex items-center gap-3 bg-ink px-7 py-4 text-paper transition-colors hover:bg-ink/85"
                >
                  Shop FW25 →
                </Link>
                <Link
                  to="/lookbook"
                  className="eyebrow inline-flex items-center gap-2 border-b border-ink pb-1 text-ink"
                >
                  View lookbook
                </Link>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-ink/10 pt-6 text-xs text-ink/50">
              <span>◇ Made in Portugal</span>
              <span>◇ 380 gsm cotton</span>
              <span>◇ Cash on delivery</span>
            </div>
          </div>

          {/* Right — hero image + thumbnail strip */}
          <div className="relative lg:col-span-5">
            <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-bone lg:h-[80vh]">
              <img
                src={m2}
                alt="Featured FW25 look"
                className="h-full w-full object-cover"
                width={1200}
                height={1600}
              />
              <span className="eyebrow absolute left-4 top-4 bg-paper px-2 py-1 text-ink">
                Look 01 / The Heavy Tee
              </span>
              <div className="absolute bottom-4 right-4 hidden bg-paper/95 p-4 backdrop-blur md:block">
                <p className="eyebrow text-ink/50">Featured</p>
                <p className="display mt-1 text-lg text-ink">Heavy Cotton Tee</p>
                <p className="mt-1 text-xs text-ink/60">$140 · Bone / Ink</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom marquee headline band */}
        <div className="overflow-hidden border-y border-ink bg-ink py-4">
          <h2 className="impact whitespace-nowrap px-4 text-[14vw] leading-none text-paper md:text-[10vw]">
            BAGGY · COLLECTION · FW25 · BAGGY · COLLECTION
          </h2>
        </div>
      </section>

      {/* Marquee — limited edition / new arrival */}
      <Marquee
        dark
        items={["⊙ Limited Edition", "⊙ New Arrival", "⊙ Heavyweight Cotton", "⊙ Cut Wide", "⊙ Worn Forever"]}
      />

      {/* Editorial back-shot grid */}
      <section className="bg-paper px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[lookbook1, lookbook2, lookbook1].map((src, i) => (
            <figure key={i} className="relative aspect-[3/4] overflow-hidden bg-bone">
              <img
                src={src}
                alt={`Editorial ${i + 1}`}
                className="h-full w-full object-cover grayscale transition-transform duration-700 hover:scale-[1.04]"
                width={1024}
                height={1365}
                loading="lazy"
              />
              <figcaption className="eyebrow absolute bottom-3 left-3 bg-paper px-2 py-1 text-ink">
                Look 0{i + 1}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* DESIGNED TO DISRUPT */}
      <section className="bg-ink py-24 text-paper">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow text-paper/50">N° 002 — Manifesto</p>
          <h2 className="impact mt-6 text-5xl md:text-7xl">Designed to disrupt</h2>
          <p className="mx-auto mt-8 max-w-xl text-paper/70">
            Heavy staples for people who take up space. Precision-cut patterns, no logos, no seasons —
            black and white only. This isn't fashion. It's a posture.
          </p>
          <div className="mt-10 flex justify-center gap-6">
            <Link to="/about" className="eyebrow border-b border-paper pb-1">Read more</Link>
            <Link to="/shop" className="eyebrow border-b border-paper/40 pb-1 text-paper/70 hover:text-paper">Shop the drop</Link>
          </div>
        </div>

        {/* Featured products — dark */}
        <div className="mx-auto mt-20 max-w-[1600px] px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {products.map((p: Product, i: number) => (
              <Link
                key={p.slug}
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="relative overflow-hidden bg-paper/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="eyebrow absolute left-2 top-2 bg-paper px-2 py-1 text-ink">
                    Sale
                  </span>
                  <span className="eyebrow absolute right-2 top-2 bg-ink/80 px-2 py-1 text-paper">
                    N° {String(i + 1).padStart(3, "0")}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-paper/70">
                    <span className="line-through text-paper/40 mr-2">${p.price + 30}</span>
                    ${p.price}
                  </p>
                </div>
                <p className="eyebrow mt-1 text-paper/40">{p.color} · {p.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee bottom */}
      <Marquee items={["✕ FW25", "✕ Cut Wide", "✕ Worn Forever", "✕ Made in Portugal", "✕ Heavyweight Cotton"]} />

      {/* Mission split */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto">
          <img src={lookbook2} alt="Mission" className="h-full w-full object-cover grayscale" />
        </div>
        <div className="flex flex-col justify-center bg-paper p-10 md:p-16">
          <p className="eyebrow text-ink/50">Our Mission</p>
          <p className="display mt-6 text-4xl md:text-5xl">
            No seasons. No logos. Just heavy cotton in two shades.
          </p>
          <p className="mt-6 max-w-md text-ink/70">
            We cut a small set of patterns in the heaviest cotton our mill will sell us, and keep
            making them until they sell out. Then we make them again.
          </p>
          <Link to="/about" className="mt-8 inline-block w-fit eyebrow border-b border-ink pb-1">
            Read the manifesto →
          </Link>
        </div>
      </section>
    </div>
  );
}
