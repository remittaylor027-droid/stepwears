import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — public approved reviews
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, created_at, customer_name, customer_location, rating, message, product_name, is_verified")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data ?? [] });
}

// POST — submit a new review (goes to pending)
export async function POST(req: NextRequest) {
  try {
    const { name, location, rating, message, product_name } = await req.json();

    if (!name || !rating || !message) {
      return NextResponse.json({ error: "Name, rating and message are required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("reviews").insert([{
      customer_name: name.trim(),
      customer_location: location?.trim() || null,
      rating: Number(rating),
      message: message.trim(),
      product_name: product_name?.trim() || null,
      status: "pending",
    }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
