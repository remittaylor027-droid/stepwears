"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, Heart, ArrowLeft, Truck, RotateCcw,
  Shield, ChevronRight, MessageCircle,
} from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

type Props = { product: Product; related: Product[] };

export default function ProductDetail({ product, related }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Only sizes with stock > 0 are selectable
  const availSizes = product.sizes.filter((s) => s.stock > 0);

  // Active image — default to first color's image, else product.image
  const getDefaultImage = () =>
    product.colors[0]?.image || product.image || "";

  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? { name: "", hex: "#b8704a" });
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [sizeError,     setSizeError]     = useState(false);
  const [activeImage,   setActiveImage]   = useState(getDefaultImage);

  // All gallery images (deduplicated)
  const galleryImages = Array.from(new Set([
    ...(Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image]),
    ...product.colors.filter((c) => c.image).map((c) => c.image!),
  ].filter(Boolean)));

  const handleColorSelect = (color: typeof selectedColor) => {
    setSelectedColor(color);
    if (color.image) setActiveImage(color.image);
  };

  const discountPct = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const inStock = availSizes.length > 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 600);
      return;
    }
    addToCart({
      product,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      quantity: 1,
    });
    router.push("/cart");
  };

  const whatsappMsg = encodeURIComponent(
    `Hi Step Wears! I'm interested in *${product.name}* (${selectedColor.name}, ${selectedSize ?? "size TBD"}) — Rs. ${product.price.toLocaleString()}`
  );

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh", paddingTop: "64px" }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Link href="/" style={{ fontSize: "0.78rem", color: "#c0a090", textDecoration: "none" }}>Home</Link>
        <ChevronRight style={{ width: "12px", height: "12px", color: "#c0a090" }} />
        <Link href="/shop" style={{ fontSize: "0.78rem", color: "#c0a090", textDecoration: "none" }}>Shop</Link>
        <ChevronRight style={{ width: "12px", height: "12px", color: "#c0a090" }} />
        <span style={{ fontSize: "0.78rem", color: "#2d1f1a", fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Back */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 16px" }}>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#7a6a62", textDecoration: "none", fontWeight: 500 }}>
          <ArrowLeft style={{ width: "14px", height: "14px" }} /> Back to Shop
        </Link>
      </div>

      {/* ══ PRODUCT SPLIT ══ */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "flex-start" }} className="pd-split">

          {/* LEFT — Image + Thumbnails */}
          <div className="pd-image-col">
            {/* Main image */}
            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", border: "1px solid #ede8e3", backgroundColor: "#f2e8e1", aspectRatio: "1", transition: "all 0.3s" }}>
              {activeImage
                ? <img src={activeImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>👠</div>
              }

              {discountPct && inStock && (
                <div style={{ position: "absolute", top: "18px", left: "18px", backgroundColor: "#9d5c38", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "5px 12px", borderRadius: "8px" }}>
                  {discountPct}% OFF
                </div>
              )}
              {!inStock && (
                <div style={{ position: "absolute", top: "18px", left: "18px", backgroundColor: "#7a6a62", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "5px 12px", borderRadius: "8px" }}>
                  Sold Out
                </div>
              )}

              <button onClick={() => setWishlisted(!wishlisted)} style={{ position: "absolute", bottom: "18px", right: "18px", width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #ede8e3", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <Heart style={{ width: "16px", height: "16px", fill: wishlisted ? "#b8704a" : "transparent", color: wishlisted ? "#b8704a" : "#7a6a62" }} />
              </button>
            </div>

            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                {galleryImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)} style={{ width: "60px", height: "60px", borderRadius: "12px", overflow: "hidden", border: img === activeImage ? "2px solid #b8704a" : "1px solid #ede8e3", cursor: "pointer", padding: 0, transition: "border-color 0.2s", flexShrink: 0, backgroundColor: "#f2e8e1" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`View ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Category + Name */}
            <div>
              <div style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#f4dbcf", borderRadius: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9d5c38" }}>{product.category}</span>
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#1a1008", margin: 0 }}>
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "2.4rem", fontWeight: 900, color: "#b8704a", letterSpacing: "-0.04em" }}>
                Rs. {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.2rem", color: "#a89a92", textDecoration: "line-through", fontWeight: 600 }}>
                    Rs. {product.original_price.toLocaleString()}
                  </span>
                  {discountPct && (
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", backgroundColor: "#e74c3c", padding: "6px 10px", borderRadius: "8px", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center" }}>
                      -{discountPct}%
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

            {/* Color */}
            {product.colors.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6a62", margin: 0 }}>
                    Color 
                    <span style={{ color: "#1a1008", marginLeft: "8px", fontWeight: 800 }}>{selectedColor.name}</span>
                  </p>
                </div>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <button key={color.name} title={color.name} onClick={() => handleColorSelect(color)} style={{
                      width: "48px", height: "48px", borderRadius: "50%", backgroundColor: color.hex,
                      border: "none", cursor: "pointer", position: "relative",
                      outline: selectedColor.name === color.name ? "2px solid #1a1008" : "2px solid transparent",
                      outlineOffset: "4px", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)"
                    }}
                    onMouseOver={(e) => { if(selectedColor.name !== color.name) e.currentTarget.style.transform = "scale(1.1)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {color.image && (
                        <span style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#fff", border: "2px solid #1a1008", display: "block" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: sizeError ? "#e74c3c" : "#7a6a62", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                  {sizeError ? "⚠ Select a size" : "Select Size"}
                </p>
                <Link href="/size-guide" style={{ fontSize: "0.85rem", color: "#b8704a", fontWeight: 700, textDecoration: "none", borderBottom: "1.5px dashed rgba(184, 112, 74, 0.4)", paddingBottom: "2px", transition: "border-color 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#b8704a" }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(184, 112, 74, 0.4)" }}
                >
                  Size Guide
                </Link>
              </div>

              {!inStock ? (
                <div style={{ padding: "18px", backgroundColor: "#fff5f5", borderRadius: "16px", color: "#e74c3c", fontWeight: 600, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #fed7d7" }}>
                   <span style={{fontSize: '1.4rem'}}>😔</span> This item is currently out of stock.
                </div>
              ) : (
                <div style={{
                  display: "flex", gap: "12px", flexWrap: "wrap",
                  animation: sizeError ? "shake 0.5s ease" : "none",
                }}>
                  {product.sizes.map((s) => {
                    const oos = s.stock === 0;
                    const isSelected = selectedSize === s.size;
                    return (
                      <button key={s.size} onClick={() => { if (!oos) { setSelectedSize(s.size); setSizeError(false); } }} style={{
                        minWidth: "60px", height: "48px", borderRadius: "12px",
                        border: isSelected ? "2px solid #1a1008" : oos ? "2px solid transparent" : "2px solid #ede8e3",
                        backgroundColor: isSelected ? "#1a1008" : oos ? "#f5f0ed" : "#fff",
                        color: isSelected ? "#fff" : oos ? "#c8b8b0" : "#1a1008",
                        fontSize: "0.95rem", fontWeight: 700,
                        cursor: oos ? "not-allowed" : "pointer",
                        opacity: oos ? 0.6 : 1,
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isSelected ? "0 6px 16px rgba(26, 16, 8, 0.25)" : (oos ? "none" : "0 2px 6px rgba(0,0,0,0.02)"),
                      }}
                      onMouseOver={(e) => { if (!oos && !isSelected) { e.currentTarget.style.borderColor = "#c0a090"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                      onMouseOut={(e) => { if (!oos && !isSelected) { e.currentTarget.style.borderColor = "#ede8e3"; e.currentTarget.style.transform = "translateY(0)"; } }}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add to Cart + WhatsApp */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              <button id="pd-add-to-cart" onClick={handleAddToCart} disabled={!inStock} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", padding: "20px", borderRadius: "18px", border: "none",
                backgroundColor: inStock ? "#1a1008" : "#d4beb2",
                color: "#fff", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.02em",
                cursor: inStock ? "pointer" : "not-allowed",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: inStock ? "0 10px 30px rgba(26, 16, 8, 0.25)" : "none",
                transform: "translateY(0)"
              }}
              onMouseOver={(e) => { if(inStock) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 34px rgba(26, 16, 8, 0.35)"; } }}
              onMouseOut={(e) => { if(inStock) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(26, 16, 8, 0.25)"; } }}
              >
                <ShoppingBag style={{ width: "22px", height: "22px" }} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <a href={`https://wa.me/923001234567?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                style={{ 
                  width: "66px", height: "66px", borderRadius: "18px", backgroundColor: "#25d366", 
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", 
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0,
                  boxShadow: "0 10px 30px rgba(37, 211, 102, 0.3)",
                  transform: "translateY(0)"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 34px rgba(37, 211, 102, 0.4)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(37, 211, 102, 0.3)"; }}
              >
                <MessageCircle style={{ width: "28px", height: "28px", color: "#fff" }} />
              </a>
            </div>

            {/* Stock info */}
            {product.sizes.filter((s) => s.stock > 0 && s.stock <= 5).length > 0 && (
              <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "#fff8f1", border: "1px solid #ffd8a8", display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "4px" }}>
                <span style={{ fontSize: "14px" }}>🔥</span>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#d97706" }}>Hurry, running low on stock!</div>
                  <div style={{ fontSize: "0.75rem", color: "#b45309", marginTop: "2px", fontWeight: 500 }}>
                    {product.sizes.filter(s => s.stock > 0 && s.stock <= 5).map(s => `Sz ${s.size} (${s.stock} left)`).join(', ')}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div style={{ marginTop: "16px" }}>
                 <p style={{ fontSize: "1rem", color: "#6b5a52", lineHeight: 1.8, margin: 0 }}>
                    {product.description}
                 </p>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "20px" }}>
              {[
                { icon: Truck,     label: "Free Shipping", sub: "Over Rs. 5,000" },
                { icon: RotateCcw, label: "Easy Returns",  sub: "Within 7 days"  },
                { icon: Shield,    label: "Safe Checkout", sub: "100% secure"      },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 12px", borderRadius: "20px", backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#fdf8f5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                     <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1a1008", textAlign: "center", letterSpacing: "-0.01em" }}>{label}</div>
                  <div style={{ fontSize: "0.7rem", color: "#a89a92", marginTop: "4px", textAlign: "center", fontWeight: 500 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ RELATED ══ */}
      {related.length > 0 && (
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 88px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8704a", marginBottom: "6px", marginTop: 0 }}>You May Also Like</p>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", margin: 0 }}>Related Products</h2>
            </div>
            <Link href="/shop" style={{ fontSize: "0.85rem", color: "#b8704a", fontWeight: 600, textDecoration: "none" }}>View All →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }} className="pd-related">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: "18px", overflow: "hidden", border: "1px solid #ede8e3", transition: "all 0.25s ease" }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(45,31,26,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "#e8d8ce"; }}
                  onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#ede8e3"; }}
                >
                  <div style={{ position: "relative", aspectRatio: "1", backgroundColor: "#f2e8e1" }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>👠</div>
                    }
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#c0a090", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>{p.category}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2d1f1a", marginBottom: "8px" }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontWeight: 800, color: "#2d1f1a" }}>Rs. {p.price.toLocaleString()}</span>
                      {p.original_price && <span style={{ fontSize: "0.78rem", color: "#c0a090", textDecoration: "line-through" }}>Rs. {p.original_price.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .pd-image-col { position: sticky; top: 88px; z-index: 10; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        @media (max-width: 860px) {
          .pd-image-col { position: relative !important; top: 0 !important; z-index: 1; margin-bottom: 8px; }
          .pd-split   { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pd-related { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pd-related { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
