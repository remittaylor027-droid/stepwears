import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST — public submission from the Hire Me form
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, shoe_size, color, details, reference_image, reference_images } =
      await req.json();

    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Name, email and details are required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("custom_orders").insert([{
      name:             name.trim(),
      email:            email.trim(),
      phone:            phone?.trim()           || null,
      shoe_size:        shoe_size?.trim()        || null,
      color:            color?.trim()            || null,
      details:          details.trim(),
      reference_image:  reference_image          || null,
      reference_images: reference_images         || [],
      status:           "new",
    }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
