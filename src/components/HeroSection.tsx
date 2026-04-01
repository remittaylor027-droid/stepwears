"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, Truck, RotateCcw, ChevronLeft, ChevronRight, Tag, Flame } from "lucide-react";

interface PromoProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  promo_price: number | null;
  image: string;
  promo_text: string | null;
  promo_tag: string | null;
  promo_tag_color: string | null;
  promo_order: number;
}

const MARQUEE_ITEMS = [
  "Free Shipping Over Rs. 5,000",
  "New Arrivals Every Week",
  "4.8★ Rated by 12K+ Customers",
  "Easy Returns & Exchanges",
  "100% Handcrafted Quality",
  "Use Code STEPFREE at Checkout",
];

export default function HeroSection() {
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  useEffect(() => {
    fetch("/api/products?promoted=true")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const goTo = useCallback((index: number) => {
    if (animating || products.length === 0) return;
    setAnimating(true);
    setCurrent((index + products.length) % products.length);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, products.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    if (products.length < 2) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, products.length]);

  const product = products[current] ?? null;

  // Consistent price calculation
  const getPrice = (p: PromoProduct) => {
    const display = p.promo_price ?? p.price;
    const strike  = p.promo_price ? p.price : p.original_price;
    const pct     = strike && strike > display ? Math.round(((strike - display) / strike) * 100) : null;
    return { display, strike, pct };
  };

  return (
    <section id="hero" style={{ width: "100%", overflow: "hidden", background: "#0f0906" }}>

      {/* ── Marquee ── */}
      <div style={{ overflow: "hidden", padding: "8px 0", background: "#b8704a" }}>
        <div className="sw-marquee-track" aria-hidden>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="sw-marquee-item">
              <span style={{ marginRight: "8px", opacity: 0.7 }}>✦</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      {loading ? (
        <div className="sw-hero" style={{ minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", border: "3px solid rgba(184,112,74,0.3)", borderTopColor: "#b8704a", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#7a6a62", fontSize: "0.85rem" }}>Loading promotions...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "4rem" }}>👠</div>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, color: "#f2e8e1", margin: 0 }}>Welcome to Step Wears</h1>
          <p style={{ fontSize: "1rem", color: "#7a6a62", maxWidth: "400px" }}>Premium ladies&apos; footwear, handcrafted with care.</p>
          <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#b8704a", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "14px 32px", borderRadius: "999px", textDecoration: "none" }}>
            <ShoppingBag style={{ width: "15px", height: "15px" }} /> Shop Collection
          </Link>
        </div>
      ) : product && (
        <div className="sw-hero"
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "88vh",
            opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease",
          }}
        >
          {/* ══ LEFT PANEL — dark content ══ */}
          <div style={{
            background: "linear-gradient(135deg, #0f0906 0%, #1e1008 60%, #2a1510 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(32px,5vw,72px) clamp(28px,5vw,64px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(184,112,74,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(184,112,74,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Content with slide animation */}
            <div style={{
              opacity: animating ? 0 : 1, transform: animating ? "translateY(16px)" : "translateY(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease", position: "relative", zIndex: 2,
            }}>

              {/* Tag + Category row */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "10px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", backgroundColor: product.promo_tag_color ?? "#b8704a",
                  padding: "5px 14px", borderRadius: "999px",
                }}>
                  <Flame style={{ width: "10px", height: "10px" }} />
                  {product.promo_tag ?? "Promotion"}
                </span>
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a6a62" }}>
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 style={{
                fontSize: "clamp(2.4rem, 4.5vw, 4rem)", fontWeight: 900,
                lineHeight: 1.05, letterSpacing: "-0.03em", color: "#f2e8e1",
                marginBottom: "20px", margin: "0 0 20px",
              }}>
                {product.name}
              </h1>

              {/* Promo text badge */}
              {product.promo_text && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  backgroundColor: "rgba(184,112,74,0.15)", border: "1px solid rgba(184,112,74,0.3)",
                  borderRadius: "10px", padding: "8px 16px", marginBottom: "28px",
                }}>
                  <Tag style={{ width: "12px", height: "12px", color: "#b8704a" }} />
                  <span style={{ fontSize: "0.82rem", color: "#d4906a", fontWeight: 700 }}>{product.promo_text}</span>
                </div>
              )}

              {/* Price block */}
              {(() => {
                const { display, strike, pct } = getPrice(product);
                return (
                  <div style={{
                    backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "20px 24px", marginBottom: "32px",
                    display: "inline-flex", flexDirection: "column", gap: "6px",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900,
                        color: "#b8704a", letterSpacing: "-0.02em", lineHeight: 1,
                      }}>
                        Rs. {display.toLocaleString()}
                      </span>
                      {strike && (
                        <span style={{ fontSize: "1.1rem", color: "#5a4a42", textDecoration: "line-through", fontWeight: 500, lineHeight: 1 }}>
                          Rs. {strike.toLocaleString()}
                        </span>
                      )}
                      {pct && pct > 0 && (
                        <span style={{
                          fontSize: "0.75rem", fontWeight: 900, color: "#fff",
                          backgroundColor: "#c0392b", padding: "4px 10px",
                          borderRadius: "6px", letterSpacing: "0.05em",
                        }}>
                          {pct}% OFF
                        </span>
                      )}
                    </div>
                    {strike && (
                      <div style={{ fontSize: "0.72rem", color: "#5a4a42", fontWeight: 500 }}>
                        You save Rs. {(strike - display).toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
                <Link href={`/products/${product.slug}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    backgroundColor: "#b8704a", color: "#fff", fontWeight: 800,
                    fontSize: "0.9rem", padding: "14px 32px", borderRadius: "999px",
                    textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 4px 24px rgba(184,112,74,0.35)",
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(184,112,74,0.45)"; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(184,112,74,0.35)"; }}
                >
                  <ShoppingBag style={{ width: "15px", height: "15px" }} /> Shop Now
                </Link>
                <Link href="/shop"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    backgroundColor: "transparent", color: "#c0a090", fontWeight: 600,
                    fontSize: "0.9rem", padding: "14px 28px", borderRadius: "999px",
                    textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#b8704a"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#c0a090"; }}
                >
                  View All
                </Link>
              </div>

              {/* Trust strip */}
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px" }}>
                {[{ Icon: Truck, text: "Free shipping over Rs. 5,000" }, { Icon: RotateCcw, text: "Easy returns & exchanges" }].map(({ Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Icon style={{ width: "14px", height: "14px", color: "#b8704a", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", color: "#5a4a42", fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Slide counter + nav dots */}
              {products.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "28px" }}>
                  <button onClick={prev} aria-label="Previous" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.05)", color: "#c0a090", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, background 0.2s" }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#b8704a"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.15)"; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                  >
                    <ChevronLeft style={{ width: "16px", height: "16px" }} />
                  </button>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {products.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ height: "4px", width: i === current ? "24px" : "6px", borderRadius: "2px", backgroundColor: i === current ? "#b8704a" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "width 0.3s, background-color 0.3s", padding: 0 }} />
                    ))}
                  </div>
                  <button onClick={next} aria-label="Next" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.05)", color: "#c0a090", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, background 0.2s" }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#b8704a"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.15)"; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                  >
                    <ChevronRight style={{ width: "16px", height: "16px" }} />
                  </button>
                  <span style={{ fontSize: "11px", color: "#4a3a32", fontWeight: 600, letterSpacing: "0.1em" }}>
                    {String(current + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT PANEL — image ══ */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "88vh" }}>
            {/* Image */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: animating ? 0.3 : 1, transform: animating ? "scale(1.03)" : "scale(1)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}>
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#2a1a0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8rem" }}>👠</div>
              )}
              {/* Gradient overlays */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0f0906 0%, transparent 15%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,9,6,0.7) 0%, transparent 50%)" }} />
            </div>

            {/* % OFF badge on image */}
            {(() => {
              const { pct } = getPrice(product);
              return pct && pct > 0 ? (
                <div style={{
                  position: "absolute", top: "28px", right: "28px",
                  width: "72px", height: "72px", borderRadius: "50%",
                  backgroundColor: "#c0392b", color: "#fff",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, boxShadow: "0 4px 20px rgba(192,57,43,0.5)",
                  animation: "pulse 2s ease-in-out infinite",
                  zIndex: 3,
                }}>
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{pct}%</span>
                  <span style={{ fontSize: "9px", letterSpacing: "0.1em" }}>OFF</span>
                </div>
              ) : null;
            })()}

            {/* Thumbnail strip at bottom */}
            {products.length > 1 && (
              <div style={{
                position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "10px", zIndex: 5,
                background: "rgba(15,9,6,0.6)", backdropFilter: "blur(8px)",
                padding: "10px 14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                {products.map((p, i) => (
                  <button key={p.id} onClick={() => goTo(i)} aria-label={p.name}
                    style={{
                      width: "52px", height: "52px", borderRadius: "12px", overflow: "hidden",
                      border: `2px solid ${i === current ? "#b8704a" : "rgba(255,255,255,0.15)"}`,
                      cursor: "pointer", padding: 0, opacity: i === current ? 1 : 0.55,
                      transition: "all 0.25s", flexShrink: 0,
                    }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", backgroundColor: "#2a1a0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>👠</div>
                    }
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes swMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
        .sw-marquee-track { display: flex; width: max-content; animation: swMarquee 32s linear infinite; }
        .sw-marquee-item { white-space: nowrap; padding: 0 32px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.85); }
        .sw-hero { min-height: 88vh; }
        @media (max-width: 860px) {
          .sw-hero { grid-template-columns: 1fr !important; min-height: unset !important; }
          .sw-hero > div:first-child { min-height: unset; padding: 40px 24px !important; }
          .sw-hero > div:last-child { min-height: 55vw; }
        }
      `}</style>
    </section>
  );
}
