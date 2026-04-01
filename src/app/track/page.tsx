"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, ShoppingBag, AlertCircle, RotateCcw
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

interface OrderItem {
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  city: string;
  address: string;
}

// ── Status config ───────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, {
  label: string; color: string; bg: string; border: string; icon: React.ElementType; desc: string;
}> = {
  pending:   { label: "Pending",    color: "#92400e", bg: "#fffbeb", border: "#fde68a", icon: Clock,        desc: "Your order has been received and is awaiting confirmation." },
  confirmed: { label: "Confirmed",  color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe", icon: CheckCircle,  desc: "Your order is confirmed and is being prepared for dispatch." },
  shipped:   { label: "Shipped",    color: "#6b21a8", bg: "#faf5ff", border: "#e9d5ff", icon: Truck,        desc: "Your order is on its way! Expect delivery within 1–3 business days." },
  delivered: { label: "Delivered",  color: "#166534", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle,  desc: "Your order has been delivered. Enjoy your new Step Wears!" },
  cancelled: { label: "Cancelled",  color: "#991b1b", bg: "#fef2f2", border: "#fecaca", icon: XCircle,      desc: "This order has been cancelled. Contact us if you think this is an error." },
  returned:  { label: "Returned",   color: "#9d5c38", bg: "#fdf9f7", border: "#e8d8ce", icon: RotateCcw,    desc: "This order has been processed as returned. We hope to serve you again." },
};

// ── Timeline steps (all statuses except cancelled) ──────────────────
const TIMELINE: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

function getTimelineIndex(status: OrderStatus) {
  if (status === "cancelled" || status === "returned") return -1;
  return TIMELINE.indexOf(status);
}

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "12px",
  border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7",
  fontSize: "0.9rem", color: "#2d1f1a", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder]     = useState<Order | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No order found.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = order ? STATUS_CONFIG[order.status] : null;
  const timelineIdx = order ? getTimelineIndex(order.status) : -1;

  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: "#2d1f1a", padding: "56px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", padding: "5px 16px", borderRadius: "999px",
          border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", marginBottom: "16px",
        }}>
          Live Updates
        </span>
        <h1 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#f2e8e1",
          letterSpacing: "-0.025em", marginTop: 0, marginBottom: "12px",
        }}>
          Track Your Order
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
          Enter your order ID and the email you used at checkout to get live status updates.
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* ── Search card ── */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "20px", padding: "28px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "11px",
              backgroundColor: "rgba(184,112,74,0.1)", border: "1px solid rgba(184,112,74,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Search style={{ width: "17px", height: "17px", color: "#b8704a" }} />
            </div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: 0 }}>Find Your Order</h2>
          </div>

          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b8a090", marginBottom: "7px" }}>
                Order ID
              </label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 3f8a2c1b (from your confirmation email)"
                style={inp}
                required
                onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
              />
              <p style={{ fontSize: "11px", color: "#b8a090", margin: "5px 0 0" }}>
                You can find your Order ID in the confirmation email we sent you.
              </p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b8a090", marginBottom: "7px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inp}
                required
                onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                backgroundColor: loading ? "#c0a090" : "#2d1f1a",
                color: "#f2e8e1", fontWeight: 700, fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background-color 0.2s",
              }}
            >
              {loading
                ? <><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Searching...</>
                : <><Search style={{ width: "16px", height: "16px" }} />Track Order</>
              }
            </button>
          </form>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px",
            padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px",
          }}>
            <AlertCircle style={{ width: "18px", height: "18px", color: "#dc2626", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#991b1b", fontWeight: 600 }}>{error}</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#b91c1c", lineHeight: 1.6 }}>
                Make sure you&apos;re using the exact email from checkout and the full Order ID.{" "}
                <Link href="/contact" style={{ color: "#b8704a", fontWeight: 700, textDecoration: "none" }}>Need help?</Link>
              </p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {order && cfg && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Status header card */}
            <div style={{
              backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: "18px", padding: "22px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: cfg.color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" }}>
                    Current Status
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <cfg.icon style={{ width: "20px", height: "20px", color: cfg.color }} />
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", color: cfg.color, opacity: 0.7, marginBottom: "2px" }}>Order ID</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: cfg.color, fontFamily: "monospace" }}>
                    {order.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: cfg.color, opacity: 0.85, lineHeight: 1.6 }}>{cfg.desc}</p>
            </div>

            {/* Timeline — only for active orders */}
            {(order.status !== "cancelled" && order.status !== "returned") && (
              <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b8a090", margin: "0 0 20px" }}>
                  Order Progress
                </h3>
                {/* Horizontal stepper */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0" }}>
                  {TIMELINE.map((step, i) => {
                    const stepCfg = STATUS_CONFIG[step];
                    const done = i <= timelineIdx;
                    const active = i === timelineIdx;
                    const StepIcon = stepCfg.icon;
                    return (
                      <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {/* Circle + connector */}
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                          {i > 0 && (
                            <div style={{ flex: 1, height: "2px", backgroundColor: i <= timelineIdx ? "#b8704a" : "#e8d8ce", transition: "background-color 0.3s" }} />
                          )}
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                            backgroundColor: done ? (active ? "#b8704a" : "rgba(184,112,74,0.12)") : "#f2e8e1",
                            border: `2px solid ${done ? "#b8704a" : "#e8d8ce"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.3s",
                          }}>
                            <StepIcon style={{ width: "15px", height: "15px", color: done ? "#b8704a" : "#c0a090" }} />
                          </div>
                          {i < TIMELINE.length - 1 && (
                            <div style={{ flex: 1, height: "2px", backgroundColor: i < timelineIdx ? "#b8704a" : "#e8d8ce", transition: "background-color 0.3s" }} />
                          )}
                        </div>
                        {/* Label */}
                        <div style={{ marginTop: "8px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", fontWeight: done ? 700 : 500, color: done ? "#2d1f1a" : "#c0a090", textTransform: "capitalize" }}>
                            {stepCfg.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "24px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b8a090", margin: "0 0 16px" }}>
                <ShoppingBag style={{ width: "13px", height: "13px", verticalAlign: "middle", marginRight: "6px", color: "#b8704a" }} />
                Items Ordered
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0",
                    borderBottom: i < order.items.length - 1 ? "1px solid #f2ede8" : "none",
                  }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2d1f1a" }}>{item.product_name}</div>
                      <div style={{ fontSize: "11px", color: "#b8a090", marginTop: "2px" }}>
                        {item.color} · Size {item.size} · Qty {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d1f1a" }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #ede8e3", marginTop: "12px", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#7a6a62" }}>
                  <span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#7a6a62" }}>
                  <span>Shipping</span>
                  <span style={{ color: order.shipping === 0 ? "#16a34a" : "#7a6a62" }}>
                    {order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", paddingTop: "6px", borderTop: "1px solid #ede8e3" }}>
                  <span>Total</span><span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <MapPin style={{ width: "18px", height: "18px", color: "#b8704a", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b8a090", marginBottom: "4px" }}>
                  Delivery Address
                </div>
                <div style={{ fontSize: "0.875rem", color: "#2d1f1a", fontWeight: 600 }}>{order.customer_name}</div>
                <div style={{ fontSize: "0.82rem", color: "#7a6a62", marginTop: "2px" }}>{order.address}, {order.city}</div>
              </div>
            </div>

            {/* Timestamps */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "160px", backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "14px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b8a090", marginBottom: "4px" }}>Order Placed</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2d1f1a" }}>
                  {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "160px", backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "14px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b8a090", marginBottom: "4px" }}>Last Updated</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2d1f1a" }}>
                  {new Date(order.updated_at ?? order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Help CTA */}
            <div style={{ textAlign: "center", paddingTop: "8px" }}>
              <p style={{ fontSize: "0.82rem", color: "#b8a090", marginBottom: "12px" }}>Have a question about your order?</p>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                backgroundColor: "#2d1f1a", color: "#f2e8e1", fontWeight: 700,
                fontSize: "0.85rem", padding: "11px 24px", borderRadius: "999px", textDecoration: "none",
              }}>
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
