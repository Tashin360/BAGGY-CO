import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { fetchProductBySlug, fetchProducts, type Product } from "@/lib/products";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const [product, all] = await Promise.all([
      fetchProductBySlug(params.slug),
      fetchProducts(),
    ]);
    if (!product) throw notFound();
    const others = all.filter((p) => p.slug !== product.slug).slice(0, 3);
    return { product, others };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Baggy/Co` },
          { name: "description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="display text-6xl">404</p>
      <p className="mt-4 text-ink/60">Piece not found.</p>
      <Link to="/shop" className="eyebrow mt-8 inline-block border-b border-ink pb-1">Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="display text-3xl">Something broke</p>
        <p className="mt-4 text-sm text-ink/60">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 eyebrow border-b border-ink pb-1">Retry</button>
      </div>
    );
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, others } = Route.useLoaderData();

  return (
    <div>
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full bg-bone object-cover"
          />
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-ink/50">{product.category} · {product.color}</p>
          <h1 className="display mt-4 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-2xl">${product.price}</p>
          <p className="mt-8 max-w-md text-ink/70">{product.description}</p>

          <div className="mt-10">
            <p className="eyebrow text-ink/60">Size</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {["XS", "S", "M", "L", "XL"].map((s) => (
                <button key={s} className="eyebrow border border-ink/30 py-3 hover:border-ink">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-8 block w-full bg-ink py-5 text-center eyebrow text-paper transition-colors hover:bg-ink/80"
          >
            Add to bag — ${product.price}
          </Link>
          <p className="mt-4 text-xs text-ink/50">Free shipping over $200 · 30-day returns</p>

          <div className="mt-12 space-y-px border-t border-ink/15">
            {[
              ["Fabric", "100% heavyweight cotton, milled in Portugal."],
              ["Fit", "Boxy, dropped shoulder. Size up for extra volume."],
              ["Care", "Cold wash inside out. Hang dry. Iron low."],
            ].map(([k, v]) => (
              <details key={k} className="group border-b border-ink/15">
                <summary className="flex cursor-pointer items-center justify-between py-4 eyebrow">
                  {k}
                  <span className="transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 text-sm text-ink/70">{v}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="mx-auto max-w-[1600px] border-t border-ink/15 px-6 py-20 lg:px-10">
          <p className="eyebrow text-ink/60">Also from the drop</p>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
            {others.map((p: Product) => (
              <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full bg-bone object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-sm">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
