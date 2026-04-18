"use client";

import Link from "next/link";
import { Sparkles, Shield, Ruler, Heart, Scissors, Star } from "lucide-react";

const SPECIALITIES = [
  {
    icon: Scissors,
    title: "100% Handcrafted",
    desc: "Each pair is shaped and stitched by skilled artisans — no shortcuts, no assembly lines.",
    stat: "12K+",
    statLabel: "Pairs crafted",
  },
  {
    icon: Ruler,
    title: "Perfect Fit Guarantee",
    desc: "We offer custom sizing across all our styles. If it doesn't fit, we remake it — free.",
    stat: "100%",
    statLabel: "Fit guaranteed",
  },
  {
    icon: Star,
    title: "Premium Materials",
    desc: "Genuine leather, imported suede, and carefully selected fabrics — quality you can see and feel.",
    stat: "15+",
    statLabel: "Material options",
  },
  {
    icon: Heart,
    title: "Made in Pakistan",
    desc: "Proudly supporting local artisans and preserving traditional Pakistani craftsmanship.",
    stat: "Since",
    statLabel: "2010",
  },
  {
    icon: Sparkles,
    title: "Custom Orders",
    desc: "Design your dream shoe from scratch — colour, material, heel height, embellishments and more.",
    stat: "7–14",
    statLabel: "Days to craft",
  },
  {
    icon: Shield,
    title: "Trusted by Thousands",
    desc: "Join a community of women across Pakistan who walk confidently in Step Wears every day.",
    stat: "4.9★",
    statLabel: "Average rating",
  },
];

export default function PromiseSection() {
  return (
    <section
      style={{
        backgroundColor: "#fdf9f7",
        borderTop: "1px solid #ede8e3",
        padding: "64px 20px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background blob */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 10% 60%, rgba(184,112,74,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(184,112,74,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8704a",
              padding: "5px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(184,112,74,0.25)",
              backgroundColor: "rgba(184,112,74,0.06)",
              marginBottom: "14px",
            }}
          >
            Why Choose Step Wears?
          </span>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
              fontWeight: 900,
              color: "#2d1f1a",
              letterSpacing: "-0.025em",
              marginTop: 0,
              marginBottom: "12px",
            }}
          >
            Our Promise to You
          </h2>
          <p
            style={{
              fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
              color: "#7a6a62",
              lineHeight: 1.75,
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            Six reasons thousands of women across Pakistan trust Step Wears with every step they take.
          </p>
        </div>

        {/* Cards grid */}
        <div className="promise-grid" style={{ display: "grid", gap: "14px" }}>
          {SPECIALITIES.map(({ icon: Icon, title, desc, stat, statLabel }) => (
            <div
              key={title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ede8e3",
                borderRadius: "18px",
                padding: "22px 20px",
                transition: "border-color 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,112,74,0.35)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(184,112,74,0.1)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#ede8e3";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Accent top line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "22px",
                  right: "22px",
                  height: "2px",
                  backgroundColor: "rgba(184,112,74,0.3)",
                  borderRadius: "999px",
                }}
              />

              {/* Icon + stat row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(184,112,74,0.14)",
                    border: "1px solid rgba(184,112,74,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "19px", height: "19px", color: "#b8704a" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: "1.35rem", fontWeight: 900, color: "#b8704a", lineHeight: 1 }}
                  >
                    {stat}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#b8a090",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginTop: "2px",
                    }}
                  >
                    {statLabel}
                  </div>
                </div>
              </div>

              <h3
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  color: "#2d1f1a",
                  marginBottom: "8px",
                  marginTop: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#7a6a62",
                  lineHeight: 1.72,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "44px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#b8704a",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              padding: "13px 28px",
              borderRadius: "999px",
              textDecoration: "none",
              transition: "opacity 0.2s",
              width: "max-content",
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Shop Collection
          </Link>
          <Link
            href="/hire-me"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "transparent",
              color: "#2d1f1a",
              fontWeight: 700,
              fontSize: "0.88rem",
              padding: "13px 28px",
              borderRadius: "999px",
              textDecoration: "none",
              border: "1px solid #d4c4b8",
              transition: "all 0.2s",
              width: "max-content",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,112,74,0.5)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.08)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#d4c4b8";
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            Custom Order a Pair
          </Link>
        </div>
      </div>

      <style>{`
        /* 2-col on mobile, 3-col on desktop */
        .promise-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 359px) {
          .promise-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 900px) {
          .promise-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
