import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name, phone, email,
      address, city, notes,
      payment, items, subtotal, shipping, total,
    } = body;

    // Basic validation
    if (!name || !phone || !address || !city || !payment || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          customer_name:  name,
          customer_phone: phone,
          customer_email: email || null,
          address,
          city,
          notes:          notes || null,
          payment_method: payment,
          items,
          subtotal,
          shipping,
          total,
          status:         "pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Send confirmation email (non-blocking — won't fail the order if email fails)
    if (email) {
      sendOrderConfirmation({
        orderId:       data.id,
        customerName:  name,
        customerEmail: email,
        address,
        city,
        notes,
        paymentMethod: payment,
        items,
        subtotal,
        shipping,
        total,
      }).catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ success: true, orderId: data.id }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
