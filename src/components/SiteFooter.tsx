import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-ink/15 bg-ink text-paper">
      <div className="overflow-hidden border-b border-paper/10 py-6">
        <div className="marquee-track flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 pr-12">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="display text-5xl md:text-7xl">
                  BAGGY · OVERSIZED · UNCUT ·
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <p className="display text-3xl">Made loose.<br/>Worn forever.</p>
          <p className="mt-6 max-w-sm text-sm text-paper/60">
            A small studio cutting oversized silhouettes in heavyweight cotton. Black or white. Nothing else.
          </p>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-paper text-paper/80">All</Link></li>
            <li><Link to="/lookbook" className="hover:text-paper text-paper/80">Lookbook</Link></li>
            <li><Link to="/about" className="hover:text-paper text-paper/80">About</Link></li>
            <li><Link to="/contact" className="hover:text-paper text-paper/80">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Newsletter</p>
          <form className="mt-4 flex border-b border-paper/30">
            <input
              placeholder="Email"
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-paper/40 focus:outline-none"
            />
            <button className="eyebrow text-paper">→</button>
          </form>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between border-t border-paper/10 px-6 py-6 text-xs text-paper/50 lg:px-10">
        <span>© {new Date().getFullYear()} Baggy/Co</span>
        <span className="eyebrow">EST. 2025 — STOCKHOLM</span>
      </div>
    </footer>
  );
}
