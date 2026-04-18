"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Leaf, Star, Shield, ArrowRight } from "lucide-react";
import CountUp from "@/components/CountUp";
import type { Product } from "@/lib/products";

const VALUES = [
  {
    icon: Heart,
    title: "Made with Love",
    desc: "Every pair is stitched by hand, shaped with care, and finished to perfection by artisans who treat each shoe as a work of art.",
  },
  {
    icon: Leaf,
    title: "Sustainably Crafted",
    desc: "We choose ethically sourced leathers and eco-conscious materials — because luxury and responsibility go hand in hand.",
  },
  {
    icon: Star,
    title: "Uncompromising Quality",
    desc: "From sole to lace, we use only premium materials that age beautifully and hold their shape season after season.",
  },
  {
    icon: Shield,
    title: "Perfect Fit Promise",
    desc: "We stand behind every pair. If your shoes don't fit right, we'll remake them — no questions asked.",
  },
];

type StaticStat = { label: string; from: number; to: number; duration: number; suffix: string };
type StatRow = StaticStat | { label: string; from: number; duration: number; suffix: string; dynamicCategories: true };

const STATS: StatRow[] = [
  { label: "Founded", from: 1995, to: 2010, duration: 2.4, suffix: "" },
  { label: "Happy Customers", from: 0, to: 12, duration: 2, suffix: "K+" },
  { label: "Shoe Categories", from: 0, duration: 1.8, suffix: "+", dynamicCategories: true },
  { label: "Average Rating", from: 0, to: 4.8, duration: 2.2, suffix: "★" },
  { label: "Handcrafted", from: 0, to: 100, duration: 2, suffix: "%" },
];

function countUniqueCategories(products: Product[]): number {
  return new Set(products.map((p) => p.category).filter((c) => Boolean(c && String(c).trim()))).size;
}

export default function AboutPage() {
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d: { products?: Product[] }) => {
        if (cancelled) return;
        const products = d.products ?? [];
        setCategoryCount(countUniqueCategories(products));
      })
      .catch(() => {
        if (!cancelled) setCategoryCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh" }}>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "#2d1f1a", minHeight: "480px",
        display: "flex", alignItems: "center",
      }}>
        {/* Background workshop image with overlay */}
        <Image
          src="/img/about-workshop.png"
          alt="Step Wears artisan workshop"
          fill className="object-cover"
          priority sizes="100vw"
          style={{ opacity: 0.35 }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(45,31,26,0.92) 0%, rgba(45,31,26,0.6) 60%, transparent 100%)",
        }} />

        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1280px", margin: "0 auto",
          padding: "120px 32px 80px",
          width: "100%",
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#b8704a", marginBottom: "20px",
            display: "block",
          }}>
            Our Story
          </span>
          <h1 style={{
            fontSize: "clamp(2.6rem, 5vw, 4.2rem)", fontWeight: 900,
            lineHeight: 1.08, letterSpacing: "-0.03em",
            color: "#f2e8e1", marginBottom: "20px", marginTop: 0,
            maxWidth: "640px",
          }}>
            Crafted in Lahore,<br />
            <span style={{ color: "#b8704a" }}>Worn with Pride.</span>
          </h1>
          <p style={{
            fontSize: "1.05rem", color: "#d4beb2", lineHeight: 1.85,
            maxWidth: "480px", marginTop: 0,
          }}>
            Step Wears is a Lahore-born ladies&apos; footwear label that believes every
            woman deserves shoes as extraordinary as she is — handcrafted,
            perfectly fitted, and beautifully made.
          </p>
        </div>
      </section>

      {/* ══ STATS BAR ══════════════════════════════════════════ */}
      <section style={{
        background: "#ffffff", borderBottom: "1px solid #ede8e3",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "40px 24px",
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: "32px",
        }} className="ab-stats">
          {STATS.map((stat, index) => {
            const delay = 0.05 * index;
            const isDynamic = "dynamicCategories" in stat && stat.dynamicCategories;
            const label = stat.label;
            return (
              <div key={label} style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
                <div style={{
                  fontSize: "2rem", fontWeight: 900,
                  color: "#b8704a", lineHeight: 1,
                  letterSpacing: "-0.02em",
                  display: "flex", alignItems: "baseline", justifyContent: "center",
                  gap: "1px", flexWrap: "nowrap",
                  minHeight: "2rem",
                }}>
                  {isDynamic ? (
                    categoryCount === null ? (
                      <span style={{ color: "#d4beb2", fontWeight: 700 }}>…</span>
                    ) : (
                      <>
                        <CountUp
                          key={categoryCount}
                          from={stat.from}
                          to={categoryCount}
                          duration={stat.duration}
                          delay={delay}
                        />
                        {stat.suffix ? (
                          <span style={{ fontWeight: 900, whiteSpace: "nowrap" }}>{stat.suffix}</span>
                        ) : null}
                      </>
                    )
                  ) : (
                    <>
                      <CountUp
                        from={stat.from}
                        to={(stat as StaticStat).to}
                        duration={stat.duration}
                        delay={delay}
                      />
                      {stat.suffix ? (
                        <span style={{ fontWeight: 900, whiteSpace: "nowrap" }}>{stat.suffix}</span>
                      ) : null}
                    </>
                  )}
                </div>
                <div style={{
                  fontSize: "0.68rem", fontWeight: 700,
                  color: "#c0a090", letterSpacing: "0.12em",
                  textTransform: "uppercase", marginTop: "6px",
                }}>{label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ VALUES — image left | 2×2 values grid right ════════ */}
      <section style={{ background: "#fdf9f7", borderBottom: "1px solid #ede8e3" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          alignItems: "stretch",
        }} className="ab-split">

          {/* Values flat lay image */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "520px" }} className="ab-img">
            <Image
              src="/img/about-values.png"
              alt="Step Wears brand values — craftsmanship and quality"
              fill className="object-cover" sizes="50vw"
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 50%, rgba(45,31,26,0.35) 100%)",
            }} />
          </div>

          {/* Values grid */}
          <div style={{ padding: "72px 32px 72px 56px" }} className="ab-pad-r">
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#b8704a", marginBottom: "14px",
              display: "block",
            }}>
              What We Stand For
            </span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800,
              color: "#2d1f1a", letterSpacing: "-0.025em",
              marginBottom: "40px", marginTop: 0,
            }}>
              Our Values
            </h2>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px",
            }}>
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  padding: "22px 20px", borderRadius: "18px",
                  border: "1px solid #ede8e3", backgroundColor: "#ffffff",
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "14px",
                  }}>
                    <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                  </div>
                  <h3 style={{
                    fontSize: "0.9rem", fontWeight: 700, color: "#2d1f1a",
                    marginBottom: "8px", marginTop: 0,
                  }}>{title}</h3>
                  <p style={{
                    fontSize: "0.8rem", color: "#7a6a62", lineHeight: 1.7, margin: 0,
                  }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WORKSHOP — full-width image banner ═════════════════ */}
      <section style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <Image
          src="/img/about-workshop.png"
          alt="Step Wears artisan workshop"
          fill className="object-cover" sizes="100vw"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(45,31,26,0.82) 0%, rgba(45,31,26,0.4) 55%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", justifyContent: "center",
          padding: "0 64px", maxWidth: "680px",
        }} className="ab-banner-text">
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#b8704a",
            marginBottom: "14px", display: "block",
          }}>
            Our Atelier
          </span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800,
            color: "#f2e8e1", lineHeight: 1.15, letterSpacing: "-0.02em",
            marginBottom: "20px", marginTop: 0,
          }}>
            Where Every Dream Shoe<br />Comes to Life.
          </h2>
          <p style={{
            fontSize: "0.95rem", color: "#d4beb2", lineHeight: 1.8,
            maxWidth: "400px", marginTop: 0, marginBottom: "28px",
          }}>
            Our workshop in Lahore&apos;s heart is where skilled cobblers turn raw
            leather into wearable art — one pair at a time, with no shortcuts.
          </p>
          <Link href="/hire-me" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "#b8704a", color: "#fdf9f7",
            fontWeight: 700, fontSize: "0.875rem", padding: "12px 26px",
            borderRadius: "999px", textDecoration: "none",
            width: "fit-content", transition: "opacity 0.2s",
          }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Commission a Custom Pair <ArrowRight style={{ width: "14px", height: "14px" }} />
          </Link>
        </div>
      </section>

      {/* ══ BIG QUOTE ══════════════════════════════════════════ */}
      <section style={{
        background: "#ffffff", borderTop: "1px solid #ede8e3",
        padding: "88px 24px",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: "48px", height: "3px", borderRadius: "2px",
            backgroundColor: "#b8704a", margin: "0 auto 32px",
          }} />
          <blockquote style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700,
            color: "#2d1f1a", lineHeight: 1.55, letterSpacing: "-0.01em",
            fontStyle: "italic", margin: 0,
          }}>
            &ldquo;Shoes are not just an accessory — they are the first thing you
            put on and the last thing people remember. At Step Wears, we make
            sure that memory is beautiful.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ══ CTA STRIP ══════════════════════════════════════════ */}
      <section style={{
        background: "#2d1f1a", padding: "64px 24px",
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "28px",
        }}>
          <div>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800,
              color: "#f2e8e1", letterSpacing: "-0.02em",
              marginBottom: "10px", marginTop: 0,
            }}>
              Ready to Find Your Perfect Pair?
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#a09088", margin: 0, lineHeight: 1.7 }}>
              Browse our collections or commission a completely custom pair.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/shop" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#b8704a", color: "#fdf9f7",
              fontWeight: 700, fontSize: "0.875rem",
              padding: "13px 26px", borderRadius: "999px",
              textDecoration: "none", transition: "opacity 0.2s",
            }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Shop Now <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
            <Link href="/hire-me" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "transparent", color: "#f2e8e1",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "13px 26px", borderRadius: "999px",
              textDecoration: "none", border: "1px solid rgba(242,232,225,0.3)",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#b8704a";
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.12)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(242,232,225,0.3)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              Custom Order
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ab-split { grid-template-columns: 1fr !important; }
          .ab-pad   { padding: 48px 20px !important; }
          .ab-pad-r { padding: 48px 20px !important; }
          .ab-img   { min-height: 300px !important; order: -1; }
          .ab-banner-text { padding: 0 24px !important; }
          .ab-stats { justify-content: center !important; }
        }
      `}</style>
    </main>
  );
}
