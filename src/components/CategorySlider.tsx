"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Moccasin",
    description: "Timeless comfort meets refined style.",
    image: "/img/moccasin.jpg",
    href: "/categories/moccasin",
  },
  {
    name: "Women Shoes",
    description: "Everyday elegance for every occasion.",
    image: "/img/shoes.png",
    href: "/categories/women-shoes",
  },
  {
    name: "Court Shoes",
    description: "Classic silhouettes, modern sophistication.",
    image: "/img/court shows.webp",
    href: "/categories/court-shoes",
  },
  {
    name: "Heels",
    description: "Elevate your look with every step.",
    image: "/img/heels.jpg",
    href: "/categories/heels",
  },
  {
    name: "Pumps",
    description: "Polished, versatile, effortlessly chic.",
    image: "/img/pumps.png",
    href: "/categories/pumps",
  },
  {
    name: "Flats",
    description: "Comfort and style in perfect harmony.",
    image: "/img/flat.png",
    href: "/categories/flats",
  },
  {
    name: "Sandals",
    description: "Breezy, beautiful and made for summer.",
    image: "/img/sandels.webp",
    href: "/categories/sandals",
  },
];

export default function CategorySlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((index + categories.length) % categories.length);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating]
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = categories[current];

  return (
    <section className="w-full py-16 px-4" style={{ background: '#fafcfa', borderTop: '1px solid #edf2ed', borderBottom: '1px solid #edf2ed' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8fa38a] mb-2">
            Explore Our
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1f241f] tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Collections
          </h2>
          <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-[#dde8dd]" />
        </div>

        {/* Slider */}
        <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid #edf2ed', boxShadow: '0 8px 32px rgba(31,36,31,0.07)' }}>
          {/* Image */}
          <div
            className="relative w-full h-[480px] sm:h-[560px] transition-opacity duration-500"
            style={{ opacity: animating ? 0.6 : 1 }}
          >
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020402]/70 via-[#020402]/20 to-transparent" />
          </div>

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 flex items-end justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#647a67]/80 text-[#c5efcb] text-xs font-semibold uppercase tracking-wider mb-3">
                Category
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {slide.name}
              </h3>
              <p className="mt-2 text-[#c6dec6] text-base sm:text-lg max-w-sm">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="mt-5 inline-block px-6 py-2.5 rounded-full bg-[#c5efcb] text-[#1f241f] text-sm font-bold hover:bg-white transition-colors duration-300"
              >
                Shop {slide.name} →
              </Link>
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-10 h-10 rounded-full bg-white/30 hover:bg-white border border-white/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-[#1f241f] transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-10 h-10 rounded-full bg-white/30 hover:bg-white border border-white/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-[#1f241f] transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-[#c5efcb]"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => goTo(i)}
              className={`relative h-14 sm:h-18 rounded-xl overflow-hidden border transition-all duration-300 ${
                i === current
                  ? "border-[#647a67] opacity-100"
                  : "border-[#edf2ed] opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-center pb-1 bg-gradient-to-t from-[#020402]/60 to-transparent">
                <span className="text-[10px] font-semibold text-white leading-none">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
