import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ProductDetail from "./ProductDetail";
import type { Product } from "@/lib/products";

// Don't pre-generate static params — fetch dynamically from Supabase
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_available", true)
    .single();

  if (error || !product) notFound();

  // Fetch related products (same category, excluding this one)
  const { data: related } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_available", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  return <ProductDetail product={product as Product} related={(related ?? []) as Product[]} />;
}
