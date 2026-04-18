// Product types — data now comes from Supabase via /api/products

export type ProductColor = { name: string; hex: string; image?: string };
export type ProductSize  = { size: string; stock: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  promo_price: number | null;
  image: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  description: string;
  is_available: boolean;
  featured: boolean;
  is_promoted: boolean;
  promo_text: string | null;
  promo_tag: string | null;
  promo_tag_color: string | null;
  promo_order: number;
  created_at: string;
};

// All products are now managed via the admin panel and fetched from Supabase.
export const products: Product[] = [];

export function getProductBySlug(_slug: string): Product | undefined {
  return undefined;
}

export function getRelatedProducts(_product: Product, _count = 4): Product[] {
  return [];
}
