import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { fetchProducts } from "@/lib/products";
import { PageLoader } from "@/components/PageLoader";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Baggy/Co" },
      { name: "description", content: "Oversized pieces in heavyweight cotton. Black or white." },
    ],
  }),
  loader: () => fetchProducts(),
  pendingComponent: () => <PageLoader label="Loading the shop" />,
  pendingMs: 0,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="display text-3xl">Couldn't load shop</p>
        <p className="mt-4 text-sm text-ink/60">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 eyebrow border-b border-ink pb-1"
        >
          Retry
        </button>
      </div>
    );
  },
  notFoundComponent: () => <div className="p-12 text-center">Not found</div>,
  component: Shop,
});

function Shop() {
  const products = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-12 lg:px-10">
      <div className="border-b border-ink/15 pb-10">
        <p className="eyebrow text-ink/60">Collection 01</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">All Pieces</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          {["All", "Pants", "Tops", "Black", "White"].map((f, i) => (
            <button
              key={f}
              className={`eyebrow border px-4 py-2 transition-colors ${i === 0 ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink/50">No pieces yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p: typeof products[number], i: number) => (
            <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
              <div className="relative overflow-hidden bg-bone">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="eyebrow absolute left-3 top-3 bg-paper px-2 py-1">
                  N° {String(i + 1).padStart(3, "0")}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="eyebrow mt-1 text-ink/50">{p.color} · {p.category}</p>
                </div>
                <p className="text-sm">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
