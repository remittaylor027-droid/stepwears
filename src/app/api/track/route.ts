import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: "Order ID and email are required." }, { status: 400 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, created_at, customer_name, customer_email, status, items, subtotal, shipping, total, city, address, updated_at")
      .ilike("customer_email", email.trim());

    if (error) {
      console.error("Track order error:", error);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }

    const orderIdClean = orderId.trim().toLowerCase();
    const data = orders?.find((o) => o.id.toLowerCase().startsWith(orderIdClean));

    if (!data) {
      return NextResponse.json({ error: "No order found with those details. Please check your order ID and email." }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
