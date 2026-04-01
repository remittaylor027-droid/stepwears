"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, Star, Shield, ArrowRight } from "lucide-react";

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

const STATS = [
  { value: "2010", label: "Founded" },
  { value: "12K+", label: "Happy Customers" },
  { value: "7+", label: "Shoe Categories" },
  { value: "4.8★", label: "Average Rating" },
  { value: "100%", label: "Handcrafted" },
];

export default function AboutPage() {
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
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
              <div style={{
                fontSize: "2rem", fontWeight: 900,
                color: "#b8704a", lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>{value}</div>
              <div style={{
                fontSize: "0.68rem", fontWeight: 700,
                color: "#c0a090", letterSpacing: "0.12em",
                textTransform: "uppercase", marginTop: "6px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ OUR STORY — text left | founder image right ════════ */}
      <section id="story" style={{ background: "#ffffff", borderBottom: "1px solid #ede8e3" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
        }} className="ab-split">

          {/* Text */}
          <div style={{ padding: "80px 56px 80px 32px" }} className="ab-pad">
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#b8704a", marginBottom: "16px",
              display: "block",
            }}>
              The Beginning
            </span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800,
              color: "#2d1f1a", letterSpacing: "-0.025em",
              marginBottom: "24px", marginTop: 0, lineHeight: 1.15,
            }}>
              A Passion for the Perfect Pair
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "Step Wears was born in 2010 from a simple frustration — finding beautiful shoes that actually fit Pakistani women perfectly. Our founder, Sana Mirza, spent years watching women settle for ill-fitting styles imported from abroad.",
                "She partnered with master cobblers in Lahore's old city and set out to create something different: a label that celebrated local craftsmanship, combined it with international design sensibility, and put women's comfort first.",
                "Today, Step Wears has grown into Lahore's most-loved ladies' footwear brand — trusted by over 12,000 customers across Pakistan who refuse to compromise on style or fit.",
              ].map((para, i) => (
                <p key={i} style={{
                  fontSize: "0.95rem", color: "#7a6a62", lineHeight: 1.85, margin: 0,
                }}>
                  {para}
                </p>
              ))}
            </div>

            <Link href="/shop" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              marginTop: "36px", backgroundColor: "#2d1f1a", color: "#f2e8e1",
              fontWeight: 700, fontSize: "0.875rem", padding: "12px 26px",
              borderRadius: "999px", textDecoration: "none", transition: "opacity 0.2s",
            }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Shop Our Collection <ArrowRight style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>

          {/* Founder image */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "560px" }} className="ab-img">
            <Image
              src="/img/about-founder.png"
              alt="Sana Mirza — Founder of Step Wears"
              fill className="object-cover" sizes="50vw"
            />
            {/* Floating quote card */}
            <div style={{
              position: "absolute", bottom: "32px", left: "32px", right: "32px",
              backgroundColor: "rgba(253,249,247,0.93)",
              backdropFilter: "blur(10px)",
              borderRadius: "18px", padding: "20px 24px",
              border: "1px solid rgba(232,216,206,0.7)",
            }}>
              <p style={{
                fontSize: "0.9rem", color: "#4a2a18", fontStyle: "italic",
                lineHeight: 1.65, margin: "0 0 10px",
              }}>
                &ldquo;I wanted every woman in Pakistan to own a pair of shoes that
                felt made just for her — because she deserves nothing less.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "#b8704a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, color: "#fdf9f7", flexShrink: 0,
                }}>SM</div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d1f1a" }}>Sana Mirza</div>
                  <div style={{ fontSize: "0.68rem", color: "#c0a090", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Founder & Creative Director
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            fontStyle: "italic", margin: "0 0 32px",
          }}>
            &ldquo;Shoes are not just an accessory — they are the first thing you
            put on and the last thing people remember. At Step Wears, we make
            sure that memory is beautiful.&rdquo;
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              backgroundColor: "#b8704a", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 800, color: "#fdf9f7",
            }}>SM</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d1f1a" }}>Sana Mirza</div>
              <div style={{ fontSize: "0.68rem", color: "#c0a090", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Founder, Step Wears
              </div>
            </div>
          </div>
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
