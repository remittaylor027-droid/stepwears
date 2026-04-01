"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Star } from "lucide-react";
import type { Product } from "@/lib/products";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((d) => { setProducts((d.products ?? []).slice(0, 8)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section style={{ width: "100%", padding: "64px 16px", backgroundColor: "#fdf9f7", borderBottom: "1px solid #ede8e3" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c0a090", marginBottom: "8px", marginTop: 0 }}>
              Handpicked for You
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", margin: 0 }}>
              Featured Products
            </h2>
          </div>
          <Link href="/shop" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#b8704a", textDecoration: "none" }}>
            View All →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", overflow: "hidden" }}>
                <div style={{ aspectRatio: "1", backgroundColor: "#f2e8e1", animation: "pulse 1.5s ease infinite alternate" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "12px", backgroundColor: "#f2e8e1", borderRadius: "6px", marginBottom: "8px", width: "60%" }} />
                  <div style={{ height: "16px", backgroundColor: "#f2e8e1", borderRadius: "6px", marginBottom: "12px" }} />
                  <div style={{ height: "20px", backgroundColor: "#f2e8e1", borderRadius: "6px", width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#c0a090" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👠</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#7a6a62", marginBottom: "8px" }}>No featured products yet</p>
            <p style={{ fontSize: "0.85rem", color: "#c0a090" }}>Go to the admin panel → Products → click ⭐ to feature a product here.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="pg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {products.map((product) => {
              const availSizes = product.sizes.filter((s) => s.stock > 0);
              const inStock = availSizes.length > 0;
              const displayPrice = product.is_promoted && product.promo_price ? product.promo_price : product.price;
              const basePrice = product.is_promoted && product.promo_price ? product.price : product.original_price;
              const badge = product.is_promoted && product.promo_tag ? { label: product.promo_tag, color: product.promo_tag_color ?? "#b8704a" } : null;
              return (
                <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div className="pg-card" style={{
                    backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden",
                    border: "1px solid #ede8e3", display: "flex", flexDirection: "column",
                    transition: "box-shadow 0.25s ease, border-color 0.25s ease", height: "100%",
                  }}>
                    {/* Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden", backgroundColor: "#f2e8e1" }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} className="pg-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s ease" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>👠</div>
                      }
                      {badge && inStock && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: badge.color, color: "#fff" }}>{badge.label}</span>
                      )}
                      {!badge && !inStock && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#7a6a62", color: "#fff" }}>Sold Out</span>
                      )}
                      {!badge && inStock && basePrice && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#b8704a", color: "#fff" }}>
                          -{Math.round(((basePrice - displayPrice) / basePrice) * 100)}%
                        </span>
                      )}
                      <button aria-label="Wishlist" className="pg-wish" onClick={(e) => e.preventDefault()} style={{
                        position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px",
                        borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.85)", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", opacity: 0, transition: "opacity 0.2s",
                      }}>
                        <Heart style={{ width: "14px", height: "14px", color: "#b8704a" }} />
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c0a090", margin: 0 }}>{product.category}</p>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2d1f1a", margin: 0, lineHeight: 1.3 }}>{product.name}</h3>

                      {/* Color dots */}
                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {product.colors.slice(0, 4).map((c) => (
                          <span key={c.name} title={c.name} style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: c.hex, boxShadow: "0 0 0 1px rgba(0,0,0,0.12)", flexShrink: 0 }} />
                        ))}
                        {product.colors.length > 4 && <span style={{ fontSize: "10px", color: "#c0a090", fontWeight: 600 }}>+{product.colors.length - 4}</span>}
                      </div>

                      {/* Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: badge ? "#b8704a" : "#2d1f1a" }}>Rs. {displayPrice.toLocaleString()}</span>
                        {basePrice && <span style={{ fontSize: "0.78rem", color: "#c0a090", textDecoration: "line-through" }}>Rs. {basePrice.toLocaleString()}</span>}
                      </div>

                      <div style={{ marginTop: "8px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "12px", backgroundColor: "#2d1f1a", color: "#f2e8e1", fontSize: "0.82rem", fontWeight: 700 }} className="pg-btn">
                        <ShoppingBag style={{ width: "14px", height: "14px" }} />
                        View &amp; Add to Cart
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All */}
        {!loading && products.length > 0 && (
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <Link href="/shop" style={{ display: "inline-block", padding: "12px 32px", borderRadius: "999px", border: "1px solid #e8d8ce", fontSize: "0.875rem", fontWeight: 600, color: "#4a2a18", textDecoration: "none", backgroundColor: "transparent" }}>
              View All Products
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .pg-card:hover { box-shadow: 0 8px 32px rgba(45,31,26,0.1); border-color: #d4beb2 !important; }
        .pg-card:hover .pg-img { transform: scale(1.04); }
        .pg-card:hover .pg-wish { opacity: 1 !important; }
        .pg-card:hover .pg-btn { background-color: #4a2a18 !important; }
        @keyframes pulse { from { opacity: 1; } to { opacity: 0.5; } }
        @media (max-width: 480px) { .pg-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; } }
      `}</style>
    </section>
  );
}
