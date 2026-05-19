import { supabase } from "@/integrations/supabase/client";
import fallback1 from "@/assets/product-1.jpg";
import fallback2 from "@/assets/product-2.jpg";
import fallback3 from "@/assets/product-3.jpg";
import fallback4 from "@/assets/product-4.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  description: string;
  stock: number;
};

const fallbacks = [fallback1, fallback2, fallback3, fallback4];

const fallbackProducts: Product[] = [
  {
    id: "heavy-cotton-tee",
    slug: "heavy-cotton-tee",
    name: "Heavy Cotton Tee",
    category: "Tops",
    price: 140,
    color: "Bone",
    image: fallback1,
    description: "A boxy heavyweight cotton tee cut with extra room through the body.",
    stock: 12,
  },
  {
    id: "wide-cargo-pant",
    slug: "wide-cargo-pant",
    name: "Wide Cargo Pant",
    category: "Bottoms",
    price: 180,
    color: "Ink",
    image: fallback2,
    description: "Oversized cargo trousers with a relaxed leg and structured drape.",
    stock: 8,
  },
  {
    id: "oversized-hoodie",
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Layers",
    price: 210,
    color: "Black",
    image: fallback3,
    description: "A dense fleece hoodie with dropped shoulders and a wide silhouette.",
    stock: 10,
  },
  {
    id: "boxy-long-sleeve",
    slug: "boxy-long-sleeve",
    name: "Boxy Long Sleeve",
    category: "Tops",
    price: 160,
    color: "White",
    image: fallback4,
    description: "A long sleeve staple with a square cut and heavyweight hand feel.",
    stock: 14,
  },
];

function normalize(row: any, idx = 0): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category ?? "Tops",
    color: row.color ?? "Black",
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    image: row.image_url || fallbacks[idx % fallbacks.length],
    description: row.description ?? "",
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data?.length ? data.map((r, i) => normalize(r, i)) : fallbackProducts;
  } catch (error) {
    console.warn("[Products] Using local fallback catalog.", error);
    return fallbackProducts;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? normalize(data) : (fallbackProducts.find((p) => p.slug === slug) ?? null);
  } catch (error) {
    console.warn("[Products] Using local fallback product.", error);
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }
}
