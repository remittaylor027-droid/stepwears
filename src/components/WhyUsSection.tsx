"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Slider data ──────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/img/speciality-craftsmanship.png",
    label: "Handcrafted with Love",
    caption: "Every stitch tells a story — shaped by artisan hands, not machines.",
  },
  {
    src: "/img/speciality-collection.png",
    label: "Curated Collections",
    caption: "From classic moccasins to statement heels — a style for every woman.",
  },
  {
    src: "/img/speciality-lifestyle.png",
    label: "Made for You",
    caption: "Shoes that move with you — designed for the modern Pakistani woman.",
  },
  {
    src: "/img/speciality-materials.png",
    label: "Premium Materials",
    caption: "Genuine leather, suede & fine fabrics — luxury you can feel.",
  },
];

export default function WhyUsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = SLIDES.length;

  const go = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent((idx + total) % total);
        setAnimating(false);
      }, 280);
    },
    [animating, total]
  );

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = () => go(current - 1);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    setTouchStart(null);
  };

  const slide = SLIDES[current];

  return (
    <section style={{ backgroundColor: "#fdf9f7", borderTop: "1px solid #ede8e3", overflow: "hidden" }}>

      {/* ════ IMAGE SLIDER ════ */}
      <div
        style={{ position: "relative", maxWidth: "1280px", margin: "0 auto 64px", padding: "24px 16px 0" }}
      >
        {/* Main slide */}
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#2d1f1a",
            aspectRatio: "var(--why-slide-ratio, 16/7)",
            boxShadow: "0 24px 64px rgba(45,31,26,0.18)",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={current}
            src={slide.src}
            alt={slide.label}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, 1280px"
            style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s ease" }}
          />

          {/* Bottom-up gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(45,31,26,0.88) 0%, rgba(45,31,26,0.35) 45%, transparent 75%)",
            }}
          />

          {/* Text — pinned to bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(18px, 4vw, 44px)" }}>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#c0a090",
                marginBottom: "8px",
              }}
            >
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
            <h3
              style={{
                fontSize: "clamp(1.15rem, 4vw, 2.2rem)",
                fontWeight: 900,
                color: "#f2e8e1",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "8px",
                marginTop: 0,
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {slide.label}
            </h3>
            <p
              style={{
                fontSize: "clamp(0.8rem, 2vw, 0.92rem)",
                color: "rgba(242,232,225,0.78)",
                lineHeight: 1.6,
                marginBottom: "16px",
                marginTop: 0,
                maxWidth: "380px",
                opacity: animating ? 0 : 1,
                transition: "opacity 0.3s ease 0.05s",
              }}
            >
              {slide.caption}
            </p>

            {/* CTA + dots */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <Link
                href="/shop"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#b8704a",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "9px 20px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.2s",
                  flexShrink: 0,
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Explore Collection
              </Link>

              <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    style={{
                      width: i === current ? "24px" : "7px",
                      height: "7px",
                      borderRadius: "999px",
                      border: "none",
                      backgroundColor: i === current ? "#b8704a" : "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Prev / Next arrows — desktop only */}
          {[
            { fn: prev, dir: "left", icon: ChevronLeft },
            { fn: next, dir: "right", icon: ChevronRight },
          ].map(({ fn, dir, icon: Icon }) => (
            <button
              key={dir}
              onClick={fn}
              className="why-slide-arrow"
              style={{
                position: "absolute",
                top: "40%",
                [dir]: "14px",
                transform: "translateY(-50%)",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(253,249,247,0.90)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(45,31,26,0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2d1f1a",
                transition: "all 0.2s",
                zIndex: 10,
              }}
              aria-label={dir === "left" ? "Previous slide" : "Next slide"}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#b8704a";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(253,249,247,0.90)";
                (e.currentTarget as HTMLElement).style.color = "#2d1f1a";
              }}
            >
              <Icon style={{ width: "18px", height: "18px" }} />
            </button>
          ))}
        </div>

        {/* Thumbnail strip */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            justifyContent: "center",
            overflowX: "auto",
            paddingBottom: "4px",
            scrollbarWidth: "none",
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: "60px",
                height: "40px",
                borderRadius: "8px",
                overflow: "hidden",
                border: i === current ? "2px solid #b8704a" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                transition: "border-color 0.2s",
                position: "relative",
                opacity: i === current ? 1 : 0.5,
                flexShrink: 0,
              }}
              aria-label={s.label}
            >
              <Image src={s.src} alt={s.label} fill className="object-cover" sizes="60px" />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          :root { --why-slide-ratio: 4/5; }
          .why-slide-arrow { display: none !important; }
          .why-br { display: block; }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          :root { --why-slide-ratio: 4/3; }
          .why-slide-arrow { display: none !important; }
        }
        @media (min-width: 769px) {
          :root { --why-slide-ratio: 16/7; }
        }
      `}</style>
    </section>
  );
}
