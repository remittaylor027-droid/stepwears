import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();

  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
