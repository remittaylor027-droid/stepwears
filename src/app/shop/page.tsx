"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/products";


const sortOptions = [
  { label: "Latest",             value: "latest"     },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function ShopPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActive]   = useState("All");
  const [sortBy, setSortBy]           = useState("latest");
  const [wishlist, setWishlist]       = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Unique categories from DB products
  const dbCategories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const toggleWish = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fdf9f7" }}>

      {/* ══ HERO ══ */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #ede8e3", padding: "80px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8704a", marginBottom: "16px", display: "block" }}>
            Curated Women&apos;s Footwear
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.07, letterSpacing: "-0.03em", color: "#2d1f1a", marginBottom: "16px", marginTop: 0 }}>
            All Products
          </h1>
          <p style={{ fontSize: "1rem", color: "#7a6a62", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 32px" }}>
            Every pair tells a story — explore{" "}
            <span style={{ color: "#2d1f1a", fontWeight: 700 }}>{loading ? "..." : `${filtered.length} handpicked styles`}</span>{" "}
            crafted for elegance &amp; comfort.
          </p>

          {/* Quick chips */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {dbCategories.slice(0, 6).map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: "7px 18px", borderRadius: "999px", border: "1px solid",
                borderColor: activeCategory === cat ? "#2d1f1a" : "#e8d8ce",
                backgroundColor: activeCategory === cat ? "#2d1f1a" : "transparent",
                color: activeCategory === cat ? "#f2e8e1" : "#7c6b63",
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                transition: "all 0.15s ease", fontFamily: "inherit",
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", flexShrink: 1 }}>
            {dbCategories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                flexShrink: 0, padding: "8px 18px", borderRadius: "999px", border: "1px solid",
                borderColor: activeCategory === cat ? "#2d1f1a" : "#e8d8ce",
                backgroundColor: activeCategory === cat ? "#2d1f1a" : "#fff",
                color: activeCategory === cat ? "#f2e8e1" : "#7c6b63",
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <span style={{ fontSize: "0.8rem", color: "#c0a090", whiteSpace: "nowrap" }}>{filtered.length} items</span>
            <div style={{ position: "relative" }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                padding: "8px 36px 8px 14px", borderRadius: "999px", border: "1px solid #e8d8ce",
                backgroundColor: "#fff", color: "#4a2a18", fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer", outline: "none", appearance: "none", fontFamily: "inherit",
              }}>
                {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "#b8704a", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#c0a090", fontSize: "1.1rem" }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#c0a090" }}>
            <p style={{ fontSize: "3rem", marginBottom: "16px" }}>👠</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#7a6a62" }}>No products found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }} className="shop-grid">
            {filtered.map((product) => {
              const displayPrice = product.is_promoted && product.promo_price ? product.promo_price : product.price;
              const basePrice   = product.is_promoted && product.promo_price ? product.price : product.original_price;
              const badge       = product.is_promoted && product.promo_tag ? { label: product.promo_tag, color: product.promo_tag_color ?? "#b8704a" } : null;
              const inStock     = product.sizes.some((s) => s.stock > 0);
              const availSizes  = product.sizes.filter((s) => s.stock > 0);
              return (
                <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div className="shop-card" style={{
                    backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden",
                    border: "1px solid #ede8e3", display: "flex", flexDirection: "column",
                    transition: "box-shadow 0.25s ease, border-color 0.25s ease", height: "100%",
                  }}>
                    {/* Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden", backgroundColor: "#f2e8e1" }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s ease" }} className="shop-img" />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0a090", fontSize: "3rem" }}>👠</div>
                      }
                      {/* Promo / sold out badge */}
                      {badge && inStock && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: badge.color, color: "#fff" }}>{badge.label}</span>
                      )}
                      {!badge && !inStock && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#7a6a62", color: "#fff" }}>Sold Out</span>
                      )}
                      {!badge && inStock && basePrice && (
                        <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#9d5c38", color: "#fff" }}>
                          -{Math.round(((basePrice - displayPrice) / basePrice) * 100)}%
                        </span>
                      )}
                      <button aria-label="Wishlist" className="shop-wish" onClick={(e) => toggleWish(product.id, e)} style={{
                        position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px",
                        borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", opacity: 0, transition: "opacity 0.2s",
                      }}>
                        <Heart style={{ width: "14px", height: "14px", fill: wishlist.includes(product.id) ? "#b8704a" : "transparent", color: wishlist.includes(product.id) ? "#b8704a" : "#7a6a62" }} />
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c0a090", margin: 0 }}>{product.category}</p>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2d1f1a", margin: 0, lineHeight: 1.3 }}>{product.name}</h3>

                      {/* Color dots */}
                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {product.colors.slice(0, 4).map((c) => (
                          <span key={c.name} title={c.name} style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: c.hex, flexShrink: 0, boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }} />
                        ))}
                        {product.colors.length > 4 && <span style={{ fontSize: "10px", color: "#c0a090", fontWeight: 600 }}>+{product.colors.length - 4}</span>}
                      </div>

                      {/* Sizes */}
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {availSizes.slice(0, 5).map((s) => (
                          <span key={s.size} style={{ fontSize: "9px", fontWeight: 600, color: "#7a6a62", border: "1px solid #e8d8ce", borderRadius: "5px", padding: "2px 6px", backgroundColor: "#fdf9f7" }}>
                            {s.size}
                          </span>
                        ))}
                        {availSizes.length === 0 && <span style={{ fontSize: "9px", color: "#f87171", fontWeight: 600 }}>Out of stock</span>}
                        {availSizes.length > 5 && <span style={{ fontSize: "9px", color: "#c0a090", fontWeight: 600 }}>+{availSizes.length - 5}</span>}
                      </div>

                      {/* Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: product.is_promoted && product.promo_price ? "#b8704a" : "#2d1f1a" }}>Rs. {displayPrice.toLocaleString()}</span>
                        {basePrice && <span style={{ fontSize: "0.78rem", color: "#c0a090", textDecoration: "line-through" }}>Rs. {basePrice.toLocaleString()}</span>}
                        {product.promo_text && <span style={{ fontSize: "9px", color: "#b8704a", fontWeight: 600 }}>🏷 {product.promo_text}</span>}
                      </div>

                      <div style={{ marginTop: "8px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", borderRadius: "12px", backgroundColor: "#2d1f1a", color: "#f2e8e1", fontSize: "0.82rem", fontWeight: 700 }} className="shop-btn">
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
      </div>

      <style>{`
        .shop-card:hover { box-shadow: 0 8px 32px rgba(45,31,26,0.1); border-color: #d4beb2 !important; }
        .shop-card:hover .shop-img { transform: scale(1.04); }
        .shop-card:hover .shop-wish { opacity: 1 !important; }
        .shop-card:hover .shop-btn { background-color: #4a2a18 !important; }
        @media (max-width: 480px) { .shop-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; } }
      `}</style>
    </main>
  );
}
