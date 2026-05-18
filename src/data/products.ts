import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  color: "Black" | "White";
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    slug: "wide-cargo-001",
    name: "Wide Cargo 001",
    category: "Pants",
    price: 180,
    color: "Black",
    image: p1,
    description:
      "Heavyweight cotton twill cargo pant with a deep, dropped seat and 32cm leg opening. Cut for volume, finished raw at the hem.",
  },
  {
    slug: "boxy-hoodie-002",
    name: "Boxy Hoodie 002",
    category: "Tops",
    price: 220,
    color: "White",
    image: p2,
    description:
      "Box-fit hoodie in 480gsm brushed cotton. Dropped shoulder, ribbed cuffs, two-panel hood. Garment-washed for permanent slouch.",
  },
  {
    slug: "wide-denim-003",
    name: "Wide Denim 003",
    category: "Pants",
    price: 240,
    color: "Black",
    image: p3,
    description:
      "Selvedge black denim cut wide from the knee down. Five-pocket construction. Shrunk once, never again.",
  },
  {
    slug: "oversized-tee-004",
    name: "Oversized Tee 004",
    category: "Tops",
    price: 90,
    color: "White",
    image: p4,
    description:
      "Boxy 240gsm cotton tee. Wide neckline, dropped sleeve. Sized to be worn one or two up.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
