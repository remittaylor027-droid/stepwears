import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface OrderItem {
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  notes?: string | null;
  paymentMethod: "cod" | "bank";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

function buildEmailHtml(d: OrderEmailData): string {
  const ref = d.orderId.slice(0, 8).toUpperCase();
  const payLabel = d.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer";

  const itemRows = d.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0e8e3;">
          <div style="font-size:14px;font-weight:600;color:#2d1f1a;">${item.product_name}</div>
          <div style="font-size:12px;color:#9a8880;margin-top:3px;">${item.color} · Size ${item.size} · Qty ${item.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0e8e3;text-align:right;font-size:14px;font-weight:700;color:#2d1f1a;white-space:nowrap;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Order Confirmation — Step Wears</title>
</head>
<body style="margin:0;padding:0;background:#f7f3f0;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2d1f1a;border-radius:20px 20px 0 0;padding:36px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#f2e8e1;">Step Wears</div>
            <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#b8704a;margin-top:4px;">Premium Ladies' Footwear</div>
          </td>
        </tr>

        <!-- Hero banner -->
        <tr>
          <td style="background:#b8704a;padding:28px 40px;text-align:center;">
            <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.75);margin-bottom:8px;">Order Confirmed ✓</div>
            <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Thank you, ${d.customerName.split(" ")[0]}!</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.85);margin-top:8px;">Your order has been received and is being processed.</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:36px 40px;">

            <!-- Reference badge -->
            <div style="background:#fdf9f7;border:1px solid #ede8e3;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;">
              <table width="100%"><tr>
                <td>
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#b8704a;">Order Reference</div>
                  <div style="font-size:20px;font-weight:900;color:#2d1f1a;letter-spacing:1px;margin-top:4px;">#${ref}</div>
                </td>
                <td style="text-align:right;">
                  <div style="font-size:11px;color:#9a8880;">Payment</div>
                  <div style="font-size:13px;font-weight:700;color:#2d1f1a;margin-top:4px;">${payLabel}</div>
                </td>
              </tr></table>
            </div>

            <!-- Items -->
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9a8880;margin-bottom:12px;">Your Items</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRows}
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#9a8880;">Subtotal</td>
                <td style="padding:6px 0;font-size:13px;color:#9a8880;text-align:right;">Rs. ${d.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#9a8880;">Shipping</td>
                <td style="padding:6px 0;font-size:13px;color:#9a8880;text-align:right;">${d.shipping === 0 ? "Free" : `Rs. ${d.shipping}`}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-size:16px;font-weight:900;color:#2d1f1a;border-top:2px solid #f0e8e3;">Total</td>
                <td style="padding:14px 0 0;font-size:16px;font-weight:900;color:#b8704a;text-align:right;border-top:2px solid #f0e8e3;">Rs. ${d.total.toLocaleString()}</td>
              </tr>
            </table>

            <!-- Divider -->
            <div style="height:1px;background:#f0e8e3;margin:28px 0;"></div>

            <!-- Delivery info -->
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9a8880;margin-bottom:12px;">Delivery Address</div>
            <div style="background:#fdf9f7;border:1px solid #ede8e3;border-radius:12px;padding:16px 20px;">
              <div style="font-size:14px;font-weight:700;color:#2d1f1a;">${d.customerName}</div>
              <div style="font-size:13px;color:#7a6a62;margin-top:4px;">${d.address}</div>
              <div style="font-size:13px;color:#7a6a62;">${d.city}</div>
              ${d.notes ? `<div style="font-size:12px;color:#9a8880;margin-top:8px;font-style:italic;">Note: ${d.notes}</div>` : ""}
            </div>

            <!-- COD notice -->
            ${
              d.paymentMethod === "cod"
                ? `<div style="background:#fff8ed;border:1px solid #fde8c0;border-radius:12px;padding:14px 18px;margin-top:16px;">
                    <div style="font-size:12px;font-weight:700;color:#92400e;">💳 Cash on Delivery</div>
                    <div style="font-size:12px;color:#b45309;margin-top:4px;">Please keep Rs. ${d.total.toLocaleString()} ready at the time of delivery.</div>
                   </div>`
                : `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px 18px;margin-top:16px;">
                    <div style="font-size:12px;font-weight:700;color:#1e40af;">🏦 Bank Transfer</div>
                    <div style="font-size:12px;color:#1d4ed8;margin-top:4px;">Please complete your bank transfer to confirm shipping. We'll reach out if needed.</div>
                   </div>`
            }

            <!-- What's next -->
            <div style="margin-top:28px;padding:20px;background:#fdf9f7;border-radius:12px;border:1px solid #ede8e3;">
              <div style="font-size:13px;font-weight:700;color:#2d1f1a;margin-bottom:12px;">What happens next?</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${["Order confirmed", "Being packed", "Out for delivery", "Delivered to you"].map((step, i) => `
                <tr>
                  <td style="padding:6px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:28px;height:28px;background:${i === 0 ? "#b8704a" : "#ede8e3"};border-radius:50%;text-align:center;vertical-align:middle;">
                        <span style="font-size:12px;font-weight:800;color:${i === 0 ? "#fff" : "#9a8880"};">${i + 1}</span>
                      </td>
                      <td style="padding-left:12px;font-size:13px;color:${i === 0 ? "#2d1f1a" : "#9a8880"};font-weight:${i === 0 ? 600 : 400};">${step}</td>
                    </tr></table>
                  </td>
                </tr>`).join("")}
              </table>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#2d1f1a;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;">
            <div style="font-size:13px;color:#7a6a62;">Questions? WhatsApp us at</div>
            <div style="font-size:15px;font-weight:700;color:#b8704a;margin-top:4px;">+92 339 0912145</div>
            <div style="font-size:11px;color:#4a3a32;margin-top:16px;">© 2025 Step Wears · Premium Ladies' Footwear</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || !resend) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }
  if (!data.customerEmail) {
    console.warn("No customer email — skipping confirmation email");
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    const { error } = await resend.emails.send({
      from: `Step Wears <${fromAddress}>`,
      to:   [data.customerEmail],
      subject: `✅ Order Confirmed — #${data.orderId.slice(0, 8).toUpperCase()} | Step Wears`,
      html: buildEmailHtml(data),
    });

    if (error) console.error("Resend error:", error);
    else       console.log("✅ Order confirmation sent to", data.customerEmail);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
