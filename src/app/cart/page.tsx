"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Tag, MessageCircle } from "lucide-react";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 250;

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const whatsappLines = items
    .map((i) => `• ${i.product.name} (${i.color}, Size ${i.size}) × ${i.quantity} = Rs. ${(i.product.price * i.quantity).toLocaleString()}`)
    .join("\n");
  const whatsappMsg = encodeURIComponent(
    `Hi Step Wears! I'd like to place an order:\n\n${whatsappLines}\n\nTotal: Rs. ${total.toLocaleString()}\n\nPlease confirm availability.`
  );
  const whatsappUrl = `https://wa.me/923390912145?text=${whatsappMsg}`;

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <main style={{ background: "#fdf9f7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", paddingTop: "100px" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          border: "1px solid #ede8e3", backgroundColor: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "24px",
        }}>
          <ShoppingBag style={{ width: "32px", height: "32px", color: "#c0a090" }} />
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2d1f1a", marginBottom: "12px", marginTop: 0, textAlign: "center" }}>
          Your Cart is Empty
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#7a6a62", lineHeight: 1.7, maxWidth: "360px", textAlign: "center", marginBottom: "32px", marginTop: 0 }}>
          Looks like you haven&apos;t added anything yet. Explore our collection and find your perfect pair.
        </p>
        <Link href="/shop" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: "#2d1f1a", color: "#f2e8e1",
          fontWeight: 700, fontSize: "0.9rem", padding: "13px 28px",
          borderRadius: "999px", textDecoration: "none",
        }}>
          <ShoppingBag style={{ width: "15px", height: "15px" }} />
          Explore All Products
        </Link>
      </main>
    );
  }

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#7a6a62", textDecoration: "none", fontWeight: 500, marginBottom: "8px" }}>
              <ArrowLeft style={{ width: "13px", height: "13px" }} /> Continue Shopping
            </Link>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "#2d1f1a", letterSpacing: "-0.02em", marginTop: "6px", marginBottom: 0 }}>
              Your Cart
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#c0a090", marginLeft: "12px" }}>
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <button onClick={clearCart} style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "0.78rem", color: "#c0a090", fontWeight: 600,
            border: "1px solid #ede8e3", borderRadius: "999px",
            padding: "7px 16px", backgroundColor: "transparent", cursor: "pointer",
            transition: "all 0.15s", fontFamily: "inherit",
          }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e74c3c";
              (e.currentTarget as HTMLElement).style.color = "#e74c3c";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#ede8e3";
              (e.currentTarget as HTMLElement).style.color = "#c0a090";
            }}
          >
            <Trash2 style={{ width: "13px", height: "13px" }} /> Clear Cart
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px", alignItems: "flex-start" }} className="cart-split">

          {/* ── LEFT: Cart items ──────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {items.map((item, idx) => (
              <div key={`${item.product.id}-${item.color}-${item.size}`} style={{
                backgroundColor: "#fff", borderRadius: "20px",
                border: "1px solid #ede8e3", overflow: "hidden",
                display: "flex", gap: "0",
              }} className="cart-item">

                {/* Image */}
                <Link href={`/products/${item.product.slug}`} style={{ width: "140px", height: "140px", flexShrink: 0, backgroundColor: "#f2e8e1", display: "block", textDecoration: "none", overflow: "hidden" }} className="cart-img-w">
                  <Image
                    src={item.product.image} alt={item.product.name}
                    width={140} height={140}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    sizes="(max-width: 480px) 100vw, 140px"
                  />
                </Link>

                {/* Info */}
                <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", margin: "0 0 4px" }}>
                        {item.product.category}
                      </p>
                      <Link href={`/products/${item.product.slug}`} style={{ textDecoration: "none" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#2d1f1a", margin: 0, lineHeight: 1.3 }}>
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.color, item.size)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #ede8e3",
                        backgroundColor: "#fdf9f7", cursor: "pointer", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#fee";
                        (e.currentTarget as HTMLElement).style.borderColor = "#e74c3c";
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#fdf9f7";
                        (e.currentTarget as HTMLElement).style.borderColor = "#ede8e3";
                      }}
                    >
                      <Trash2 style={{ width: "13px", height: "13px", color: "#c0a090" }} />
                    </button>
                  </div>

                  {/* Color + Size badges */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 600, color: "#4a2a18", border: "1px solid #e8d8ce", borderRadius: "8px", padding: "3px 10px", backgroundColor: "#fdf9f7" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.colorHex, boxShadow: "0 0 0 1px rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      {item.color}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4a2a18", border: "1px solid #e8d8ce", borderRadius: "8px", padding: "3px 10px", backgroundColor: "#fdf9f7" }}>
                      Size {item.size}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    {/* Qty stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid #e8d8ce", borderRadius: "10px", overflow: "hidden" }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                        style={{ width: "32px", height: "32px", border: "none", backgroundColor: "#fdf9f7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s" }}
                        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
                        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fdf9f7")}
                      >
                        <Minus style={{ width: "12px", height: "12px", color: "#4a2a18" }} />
                      </button>
                      <span style={{ minWidth: "36px", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "#2d1f1a" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                        style={{ width: "32px", height: "32px", border: "none", backgroundColor: "#fdf9f7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s" }}
                        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
                        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fdf9f7")}
                      >
                        <Plus style={{ width: "12px", height: "12px", color: "#4a2a18" }} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d1f1a" }}>
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: "0.7rem", color: "#c0a090" }}>
                          Rs. {item.product.price.toLocaleString()} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Order Summary ──────────────────────── */}
          <div style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Summary card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", letterSpacing: "-0.01em" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Subtotal */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#7a6a62" }}>Subtotal ({totalItems} items)</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2d1f1a" }}>Rs. {subtotal.toLocaleString()}</span>
                </div>

                {/* Shipping */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#7a6a62" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4a7a4a" }}>Free 🎉</span>
                  ) : (
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2d1f1a" }}>Rs. {shipping.toLocaleString()}</span>
                  )}
                </div>

                {/* Free shipping progress */}
                {shipping > 0 && (
                  <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "#fdf9f7", border: "1px solid #ede8e3" }}>
                    <div style={{ fontSize: "0.72rem", color: "#7a6a62", marginBottom: "8px" }}>
                      Add <span style={{ fontWeight: 700, color: "#b8704a" }}>Rs. {(SHIPPING_THRESHOLD - subtotal).toLocaleString()}</span> more for free shipping
                    </div>
                    <div style={{ height: "5px", borderRadius: "3px", backgroundColor: "#e8d8ce", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "3px", backgroundColor: "#b8704a", width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                )}

                <div style={{ height: "1px", backgroundColor: "#ede8e3" }} />

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a" }}>Total</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2d1f1a", letterSpacing: "-0.02em" }}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ height: "1px", backgroundColor: "#ede8e3", margin: "20px 0" }} />

              {/* Primary checkout button */}
              <Link
                href="/checkout"
                id="cart-checkout-btn"
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", padding: "14px", borderRadius: "14px",
                  backgroundColor: "#2d1f1a", color: "#f2e8e1",
                  fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                  transition: "opacity 0.2s", boxSizing: "border-box",
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Continue to Checkout
                <ArrowRight style={{ width: "15px", height: "15px" }} />
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
                <span style={{ fontSize: "0.68rem", color: "#c0a090", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
              </div>

              {/* WhatsApp as secondary */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", padding: "12px", borderRadius: "14px",
                border: "1.5px solid #25d366", backgroundColor: "#f0fdf4",
                color: "#166534", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
                transition: "all 0.2s", boxSizing: "border-box",
              }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "#25d366";
                  el.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "#f0fdf4";
                  el.style.color = "#166534";
                }}
              >
                <MessageCircle style={{ width: "16px", height: "16px" }} />
                Order via WhatsApp
              </a>

              <p style={{ fontSize: "0.7rem", color: "#c0a090", textAlign: "center", marginTop: "12px", marginBottom: 0, lineHeight: 1.6 }}>
                Your order details will be pre-filled. Our team will confirm & arrange delivery.
              </p>
            </div>

            {/* Promo code */}
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginTop: 0, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Tag style={{ width: "12px", height: "12px" }} /> Promo Code
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text" placeholder="Enter code"
                  style={{
                    flex: 1, padding: "9px 14px", borderRadius: "10px",
                    border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7",
                    fontSize: "0.82rem", color: "#2d1f1a", outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <button style={{
                  padding: "9px 16px", borderRadius: "10px",
                  backgroundColor: "#2d1f1a", color: "#f2e8e1",
                  border: "none", fontSize: "0.82rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Apply
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { emoji: "🔒", label: "Secure Checkout" },
                { emoji: "🚚", label: "Fast Delivery"  },
                { emoji: "↩️", label: "Easy Returns"   },
                { emoji: "⭐", label: "4.8 Rated Brand" },
              ].map(({ emoji, label }) => (
                <div key={label} style={{
                  padding: "10px", borderRadius: "12px",
                  border: "1px solid #ede8e3", backgroundColor: "#fff",
                  textAlign: "center", fontSize: "0.7rem", color: "#7a6a62", fontWeight: 500,
                }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{emoji}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-split { grid-template-columns: 1fr !important; }
          .cart-img-w { width: 110px !important; height: 110px !important; }
          .cart-img-w img { width: 100% !important; height: 100% !important; object-fit: cover !important; }
        }
        @media (max-width: 480px) {
          .cart-item { flex-direction: column !important; }
          .cart-img-w { width: 100% !important; height: 240px !important; }
          .cart-img-w img { width: 100% !important; height: 100% !important; object-fit: cover !important; }
        }
      `}</style>
    </main>
  );
}
