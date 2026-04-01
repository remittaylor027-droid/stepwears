import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featuredOnly = searchParams.get("featured")  === "true";
  const promotedOnly = searchParams.get("promoted")  === "true";

  let query = supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (featuredOnly) {
    // Return products that are featured OR promoted (so promo badges always show)
    query = query.or("featured.eq.true,is_promoted.eq.true");
  }
  if (promotedOnly) {
    query = query.eq("is_promoted", true).order("promo_order", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data ?? [] });
}
