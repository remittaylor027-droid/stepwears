"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, User, Phone, Mail, MapPin,
  Landmark, Truck, CheckCircle, ShoppingBag, Copy, Check, MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 250;

const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "Step Wears (Pvt.) Ltd.",
  accountNumber: "0123-4567890-1",
  iban: "PK36MEZN0001010123456789",
};

type PaymentMethod = "cod" | "bank";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "12px",
  border: "1px solid #e8d8ce",
  backgroundColor: "#fdf9f7",
  fontSize: "0.875rem",
  color: "#2d1f1a",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#c0a090",
  marginBottom: "6px",
};

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", city: "", notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const shipping = payment === "bank" ? 0 : (subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST);
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          notes: form.notes,
          payment,
          items: items.map((i) => ({
            product_id:   i.product.id,
            product_name: i.product.name,
            image:        i.product.image,
            color:        i.color,
            size:         i.size,
            quantity:     i.quantity,
            price:        i.product.price,
          })),
          subtotal,
          shipping,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOrderRef(data.orderId?.slice(0, 8).toUpperCase() ?? "SW-ORDER");
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Empty cart guard ── */
  if (items.length === 0 && !submitted) {
    return (
      <main style={{ background: "#fdf9f7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 40px", paddingTop: "100px" }}>
        <ShoppingBag style={{ width: "48px", height: "48px", color: "#c0a090", marginBottom: "20px" }} />
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 12px", textAlign: "center" }}>Nothing to Checkout</h1>
        <p style={{ color: "#7a6a62", marginBottom: "28px", textAlign: "center" }}>Your cart is empty. Add some products first.</p>
        <Link href="/shop" style={{ backgroundColor: "#2d1f1a", color: "#f2e8e1", padding: "12px 28px", borderRadius: "999px", textDecoration: "none", fontWeight: 700 }}>
          Shop Now
        </Link>
      </main>
    );
  }

  /* ── Success state ── */
  if (submitted) {
    const displayRef = orderRef || `SW-${Date.now().toString(36).toUpperCase()}`;
    return (
      <main style={{ background: "#fdf9f7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", paddingTop: "100px" }}>
        <div style={{
          maxWidth: "520px", width: "100%",
          backgroundColor: "#fff", borderRadius: "24px",
          border: "1px solid #ede8e3", padding: "48px 36px",
          textAlign: "center",
        }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", backgroundColor: "#f0fdf4", border: "1px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle style={{ width: "32px", height: "32px", color: "#22c55e" }} />
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#2d1f1a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Order Placed! 🎉
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a6a62", lineHeight: 1.75, margin: "0 0 24px" }}>
            Thank you, <strong style={{ color: "#2d1f1a" }}>{form.name}</strong>! Your order has been received. We&apos;ll confirm via{" "}
            <strong style={{ color: "#2d1f1a" }}>{form.phone}</strong> within 24 hours.
          </p>

          {/* Order ref */}
          <div style={{ backgroundColor: "#fdf9f7", border: "1px solid #ede8e3", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "6px" }}>Order Reference</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#b8704a", letterSpacing: "0.05em" }}>{displayRef}</div>
          </div>

          {/* Bank transfer reminder */}
          {payment === "bank" && (
            <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "16px 18px", marginBottom: "24px", textAlign: "left" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#92400e", margin: "0 0 6px" }}>⚠ Action Required — Bank Transfer</p>
              <p style={{ fontSize: "0.8rem", color: "#78350f", lineHeight: 1.65, margin: 0 }}>
                Please transfer <strong>Rs. {total.toLocaleString()}</strong> to the account provided and send your payment screenshot on WhatsApp to confirm your order.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            <Link href="/" style={{ display: "block", padding: "12px", borderRadius: "12px", backgroundColor: "#2d1f1a", color: "#f2e8e1", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
              Back to Home
            </Link>
            <Link href="/shop" style={{ display: "block", padding: "12px", borderRadius: "12px", border: "1px solid #e8d8ce", color: "#4a2a18", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#7a6a62", textDecoration: "none", fontWeight: 500, marginBottom: "10px" }}>
            <ArrowLeft style={{ width: "13px", height: "13px" }} /> Back to Cart
          </Link>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "#2d1f1a", letterSpacing: "-0.02em", marginTop: "6px", marginBottom: 0 }}>
            Checkout
          </h1>

          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
            {[{ label: "Cart", done: true }, { label: "Details", active: true }, { label: "Confirm", done: false }].map((step, i, arr) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", fontSize: "11px", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: step.done ? "#b8704a" : (step.active ? "#2d1f1a" : "#e8d8ce"),
                    color: (step.done || step.active) ? "#fff" : "#c0a090",
                  }}>{step.done ? "✓" : i + 1}</div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: step.active ? "#2d1f1a" : "#c0a090" }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: "32px", height: "1px", backgroundColor: "#e8d8ce" }} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px", alignItems: "flex-start" }} className="co-split">

            {/* ── LEFT: Form ─────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Contact info */}
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <User style={{ width: "16px", height: "16px", color: "#b8704a" }} /> Contact Information
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="co-form-row">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input name="name" type="text" required value={form.name} onChange={handleChange}
                      placeholder="e.g. Ayesha Khan" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                      placeholder="+92 300 0000000" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin style={{ width: "16px", height: "16px", color: "#b8704a" }} /> Delivery Address
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="co-form-row">
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Street Address *</label>
                      <input name="address" type="text" required value={form.address} onChange={handleChange}
                        placeholder="House No., Street, Area" style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>City *</label>
                      <input name="city" type="text" required value={form.city} onChange={handleChange}
                        placeholder="e.g. Lahore, Karachi, Islamabad" style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Order Notes (optional)</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
                      placeholder="Any special instructions for your order or delivery..."
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Landmark style={{ width: "16px", height: "16px", color: "#b8704a" }} /> Payment Method
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Cash on Delivery */}
                  <button type="button" onClick={() => setPayment("cod")} style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px",
                    borderRadius: "14px", border: `2px solid ${payment === "cod" ? "#2d1f1a" : "#e8d8ce"}`,
                    backgroundColor: payment === "cod" ? "#fdf9f7" : "#fff",
                    cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${payment === "cod" ? "#2d1f1a" : "#e8d8ce"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {payment === "cod" && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2d1f1a" }} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Truck style={{ width: "16px", height: "16px", color: "#b8704a" }} />
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d1f1a" }}>Cash on Delivery</span>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#4a7a4a", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "2px 8px" }}>
                          POPULAR
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#7a6a62", marginTop: "3px" }}>
                        Pay when your order arrives at your door
                      </div>
                    </div>
                  </button>

                  {/* Bank Transfer */}
                  <button type="button" onClick={() => setPayment("bank")} style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px",
                    borderRadius: "14px", border: `2px solid ${payment === "bank" ? "#2d1f1a" : "#e8d8ce"}`,
                    backgroundColor: payment === "bank" ? "#fdf9f7" : "#fff",
                    cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${payment === "bank" ? "#2d1f1a" : "#e8d8ce"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {payment === "bank" && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2d1f1a" }} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Landmark style={{ width: "16px", height: "16px", color: "#b8704a" }} />
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d1f1a" }}>Bank Transfer</span>
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#166534", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "2px 8px" }}>
                          FREE SHIPPING
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#7a6a62", marginTop: "3px" }}>
                        Direct bank transfer — shipping is on us!
                      </div>
                    </div>
                  </button>

                  {/* Bank details panel */}
                  {payment === "bank" && (
                    <div style={{
                      marginTop: "4px", padding: "18px 20px", borderRadius: "14px",
                      backgroundColor: "#fffbeb", border: "1px solid #fde68a",
                    }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#92400e", margin: "0 0 14px" }}>
                        Bank Account Details
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {[
                          { label: "Bank",           value: BANK_DETAILS.bankName,       key: "bank"    },
                          { label: "Account Title",  value: BANK_DETAILS.accountTitle,   key: "title"   },
                          { label: "Account No.",    value: BANK_DETAILS.accountNumber,  key: "accno"   },
                          { label: "IBAN",           value: BANK_DETAILS.iban,           key: "iban"    },
                        ].map(({ label, value, key }) => (
                          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, color: "#92400e", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#78350f" }}>{value}</div>
                            </div>
                            <button type="button" onClick={() => copyToClipboard(value, key)} style={{
                              width: "30px", height: "30px", borderRadius: "8px",
                              border: "1px solid #fde68a", backgroundColor: "#fff",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              {copied === key
                                ? <Check style={{ width: "13px", height: "13px", color: "#22c55e" }} />
                                : <Copy style={{ width: "13px", height: "13px", color: "#92400e" }} />
                              }
                            </button>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#92400e", margin: "14px 0 12px", lineHeight: 1.65 }}>
                        Transfer <strong>Rs. {total.toLocaleString()}</strong> and send your payment screenshot on WhatsApp — your order will be confirmed instantly.
                      </p>

                      {/* WhatsApp screenshot button */}
                      <a
                        href={`https://wa.me/923390912145?text=${encodeURIComponent(`Hi Step Wears! I've made a bank transfer of Rs. ${total.toLocaleString()} for my order. Sending my payment screenshot now.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: "8px", padding: "10px 16px", borderRadius: "10px",
                          backgroundColor: "#25d366", color: "#fff",
                          fontWeight: 700, fontSize: "0.82rem", textDecoration: "none",
                          transition: "opacity 0.2s",
                        }}
                        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                      >
                        <MessageCircle style={{ width: "15px", height: "15px" }} />
                        Send Payment Screenshot on WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ──────────────────────── */}
            <div style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Items */}
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "20px" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "16px" }}>
                  Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.color}-${item.size}`} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ position: "relative", width: "52px", height: "52px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#f2e8e1" }}>
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="52px" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2d1f1a", lineHeight: 1.3, marginBottom: "3px" }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#c0a090" }}>
                          {item.color} · Size {item.size} · Qty {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d1f1a", flexShrink: 0 }}>
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: "1px", backgroundColor: "#ede8e3", marginBottom: "14px" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.82rem", color: "#7a6a62" }}>Subtotal</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2d1f1a" }}>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.82rem", color: "#7a6a62" }}>Shipping</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: shipping === 0 ? "#4a7a4a" : "#2d1f1a" }}>
                      {shipping === 0 ? "Free 🎉" : `Rs. ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #ede8e3" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a" }}>Total</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#2d1f1a", letterSpacing: "-0.02em" }}>
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#c0a090", textAlign: "right" }}>
                    Payment: <strong style={{ color: "#4a2a18" }}>{payment === "cod" ? "Cash on Delivery" : "Bank Transfer"}</strong>
                  </div>
                </div>
              </div>

              {/* Place order button */}
              <button type="submit" id="co-place-order" disabled={submitting} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", padding: "15px", borderRadius: "14px", border: "none",
                backgroundColor: submitting ? "#7a6a62" : "#2d1f1a", color: "#f2e8e1",
                fontWeight: 700, fontSize: "0.95rem",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "opacity 0.2s", fontFamily: "inherit",
              }}
                onMouseOver={(e) => { if (!submitting) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                {submitting ? "Placing Order..." : "Place Order"}
                {!submitting && <ArrowRight style={{ width: "15px", height: "15px" }} />}
              </button>

              <p style={{ fontSize: "0.7rem", color: "#c0a090", textAlign: "center", margin: 0, lineHeight: 1.65 }}>
                By placing your order you agree to our terms. We&apos;ll confirm via {form.phone || "your phone"}.
              </p>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .co-split    { grid-template-columns: 1fr !important; }
          .co-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
