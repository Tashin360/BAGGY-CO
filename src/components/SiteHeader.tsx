import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-ink py-2 text-center">
        <span className="eyebrow text-paper/90">
          Limited releases. Exclusive drops. Elegance is now live.
        </span>
      </div>

      {/* Main bar */}
      <div className="border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-6 lg:px-10">
          <nav className="hidden items-center gap-4 md:flex md:gap-6 lg:gap-8">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="eyebrow whitespace-nowrap text-ink/70 transition-colors hover:text-ink"
                activeOptions={{ exact: true }}
                activeProps={{ className: "eyebrow whitespace-nowrap text-ink underline underline-offset-[6px]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="impact justify-self-center whitespace-nowrap text-lg tracking-[0.04em] sm:text-xl md:text-2xl lg:text-3xl">
            BAGGY/CO
          </Link>

          <div className="flex items-center justify-end gap-3 text-ink sm:gap-4 md:gap-5">
            <button aria-label="Search" className="hover:text-ink/60"><Search className="h-5 w-5" /></button>
            <Link to="/account" aria-label="Account" className="hover:text-ink/60"><User className="h-5 w-5" /></Link>
            <Link to="/checkout" aria-label="Bag" className="relative hover:text-ink/60">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-semibold text-paper">2</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
