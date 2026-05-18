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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r, i) => normalize(r, i));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? normalize(data) : null;
}
