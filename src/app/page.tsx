import WhyUsSection    from "@/components/WhyUsSection";
import ProductGrid     from "@/components/ProductGrid";
import PromiseSection  from "@/components/PromiseSection";
import ReviewsSlider   from "@/components/ReviewsSlider";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 min-h-[calc(100vh-4rem)]">

      {/* ── Welcome + Image Slider ────────────────────── */}
      <WhyUsSection />

      {/* ── Featured Products ────────────────────────── */}
      <ProductGrid />

      {/* ── Our Promise to You ───────────────────────── */}
      <PromiseSection />

      {/* ── Customer Reviews ─────────────────────────── */}
      <ReviewsSlider />

    </main>
  );
}
