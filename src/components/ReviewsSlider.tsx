"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, PenLine, X, Check, BadgeCheck } from "lucide-react";

interface Review {
  id: string;
  customer_name: string;
  customer_location: string | null;
  rating: number;
  message: string;
  product_name: string | null;
  is_verified: boolean;
  created_at: string;
}

// Colour palette for avatars
const AVATAR_COLORS = ["#6b4226", "#7a4426", "#9d5c38", "#b8704a", "#4a2a18", "#8b5e3c"];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// Fallback static reviews shown if DB is empty
const FALLBACK: Review[] = [
  { id: "f1", customer_name: "Ayesha Khan",  customer_location: "Lahore",    rating: 5, message: "Absolutely love my heels from Step Wears! The quality is incredible and they fit perfectly. I get compliments every time I wear them.", product_name: "Stiletto Heels",  is_verified: true,  created_at: "" },
  { id: "f2", customer_name: "Sana Malik",   customer_location: "Karachi",   rating: 5, message: "The moccasins are so comfortable I wore them all day at work. Great craftsmanship and fast delivery. Will definitely order again!", product_name: "Classic Moccasin", is_verified: true,  created_at: "" },
  { id: "f3", customer_name: "Fatima Noor",  customer_location: "Islamabad", rating: 5, message: "I ordered the court shoes and I'm beyond impressed. They look even better in person. Step Wears is my go-to for ladies footwear!", product_name: "Court Classic",   is_verified: false, created_at: "" },
  { id: "f4", customer_name: "Zara Ahmed",   customer_location: "Multan",    rating: 4, message: "The sandals are gorgeous and very comfortable for summer. Packaging was beautiful too. Only wish there were more colour options!", product_name: "Summer Sandals",  is_verified: true,  created_at: "" },
  { id: "f5", customer_name: "Hira Baig",    customer_location: "Faisalabad",rating: 5, message: "The pumps are stunning — elegant yet comfortable. I wore them to a wedding and received so many compliments. Never disappoints!", product_name: "Block Pumps",     is_verified: false, created_at: "" },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1px solid #ede8e3", backgroundColor: "#fff",
  color: "#2d1f1a", fontSize: "0.88rem", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};

export default function ReviewsSlider() {
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [loading, setLoading]     = useState(true);
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const [form, setForm] = useState({ name: "", location: "", rating: 0, message: "", product_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadReviews = async () => {
    try {
      const res  = await fetch("/api/reviews");
      const data = await res.json();
      const list = data.reviews ?? [];
      setReviews(list.length > 0 ? list : FALLBACK);
    } catch {
      setReviews(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const total = reviews.length;

  const goTo = useCallback((index: number) => {
    if (animating || total === 0) return;
    setAnimating(true);
    setCurrent((index + total) % total);
    setTimeout(() => setAnimating(false), 400);
  }, [animating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next, total]);

  const visible = total > 0
    ? [-1, 0, 1].map((offset) => (current + offset + total) % total)
    : [];

  const submitReview = async () => {
    if (!form.name.trim() || !form.rating || !form.message.trim()) {
      setSubmitError("Please fill in your name, rating and review.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          rating: form.rating,
          message: form.message,
          product_name: form.product_name,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setForm({ name: "", location: "", rating: 0, message: "", product_name: "" });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const Stars = ({ n, size = 14, center = false }: { n: number; size?: number; center?: boolean }) => (
    <div style={{ display: "flex", gap: "2px", justifyContent: center ? "center" : "flex-start" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} style={{ width: size, height: size, fill: i < n ? "#b8704a" : "#e8d8ce", color: i < n ? "#b8704a" : "#e8d8ce" }} />
      ))}
    </div>
  );

  return (
    <section style={{ width: "100%", padding: "72px 24px", background: "#fdf9f7", borderTop: "1px solid #ede8e3", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c0a090", marginBottom: "8px", margin: "0 0 8px" }}>
              Testimonials
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 900, color: "#2d1f1a", letterSpacing: "-0.02em", margin: 0 }}>
              Happy Customers
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => { setShowForm(true); setSubmitted(false); }} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", borderRadius: "999px", border: "1px solid #b8704a", backgroundColor: "transparent", color: "#b8704a", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#b8704a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
            >
              <PenLine style={{ width: "13px", height: "13px" }} /> Leave a Review
            </button>
            <button onClick={prev} aria-label="Previous" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #e8d8ce", backgroundColor: "#fff", color: "#4a2a18", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
              onMouseOver={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#b8704a"}
              onMouseOut={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#e8d8ce"}
            ><ChevronLeft style={{ width: "18px", height: "18px" }} /></button>
            <button onClick={next} aria-label="Next" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "none", backgroundColor: "#b8704a", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ backgroundColor: "#f0e8e3", borderRadius: "20px", height: "220px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
            {visible.map((idx, pos) => {
              const r = reviews[idx];
              const isCenter = pos === 1;
              return (
                <div key={r.id} onClick={() => goTo(idx)} style={{
                  borderRadius: "20px", padding: "28px",
                  backgroundColor: isCenter ? "#2d1f1a" : "#fff",
                  border: `1px solid ${isCenter ? "transparent" : "#ede8e3"}`,
                  opacity: animating ? 0.5 : (isCenter ? 1 : 0.75),
                  transform: isCenter ? "scale(1.02)" : "scale(0.98)",
                  transition: "all 0.4s ease",
                  cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px",
                  boxShadow: isCenter ? "0 8px 40px rgba(45,31,26,0.18)" : "none",
                }}>
                  {/* Stars */}
                  <Stars n={r.rating} />
                  {/* Message */}
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: isCenter ? "#c0a090" : "#4a2a18", flex: 1, margin: 0 }}>
                    &ldquo;{r.message}&rdquo;
                  </p>
                  <div style={{ height: "1px", backgroundColor: isCenter ? "#4a2a18" : "#ede8e3" }} />
                  {/* Customer */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: avatarColor(r.customer_name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                      {r.customer_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: isCenter ? "#f2e8e1" : "#2d1f1a" }}>{r.customer_name}</span>
                        {r.is_verified && <BadgeCheck style={{ width: "13px", height: "13px", color: isCenter ? "#22c55e" : "#22c55e" }} />}
                      </div>
                      {r.customer_location && <p style={{ fontSize: "11px", color: isCenter ? "#7a6a62" : "#a09088", margin: 0 }}>{r.customer_location}</p>}
                      {r.product_name && <p style={{ fontSize: "10px", fontStyle: "italic", color: isCenter ? "#6a5a52" : "#b8704a", margin: 0 }}>{r.product_name}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "28px" }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Review ${i + 1}`} style={{ height: "6px", width: i === current ? "28px" : "6px", borderRadius: "3px", backgroundColor: i === current ? "#b8704a" : "#e8d8ce", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>

        {/* Stats */}
        <div style={{ marginTop: "56px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", borderTop: "1px solid #ede8e3", paddingTop: "40px" }}>
          {[{ value: "4.8 ★", label: "Average Rating" }, { value: "12K+", label: "Happy Customers" }, { value: "98%", label: "Would Recommend" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#b8704a", margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: "0.82rem", color: "#a09088", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Review Form Modal ── */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#f0fdf4", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check style={{ width: "28px", height: "28px", color: "#22c55e" }} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#2d1f1a", margin: "0 0 8px" }}>Thank you!</h3>
                <p style={{ color: "#7a6a62", fontSize: "0.88rem", margin: "0 0 24px" }}>Your review has been submitted and is awaiting approval. It will appear on the site once approved.</p>
                <button onClick={() => setShowForm(false)} style={{ padding: "10px 28px", borderRadius: "999px", border: "none", backgroundColor: "#b8704a", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#2d1f1a", margin: 0 }}>Share Your Experience</h3>
                  <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#a09088", cursor: "pointer" }}><X style={{ width: "20px", height: "20px" }} /></button>
                </div>

                {/* Star rating picker */}
                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a09088", marginBottom: "10px" }}>Your Rating</p>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setForm((f) => ({ ...f, rating: i + 1 }))}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                        <Star style={{ width: "32px", height: "32px", fill: i < (hoverRating || form.rating) ? "#b8704a" : "#e8d8ce", color: i < (hoverRating || form.rating) ? "#b8704a" : "#e8d8ce", transition: "fill 0.15s, color 0.15s" }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a09088", display: "block", marginBottom: "6px" }}>Name *</label>
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inp}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#ede8e3")} />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a09088", display: "block", marginBottom: "6px" }}>City</label>
                      <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Lahore" style={inp}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#ede8e3")} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a09088", display: "block", marginBottom: "6px" }}>Product (optional)</label>
                    <input value={form.product_name} onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))} placeholder="Which product did you buy?" style={inp}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#ede8e3")} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a09088", display: "block", marginBottom: "6px" }}>Your Review *</label>
                    <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell others about your experience..." rows={4} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#ede8e3")} />
                  </div>

                  {submitError && <p style={{ fontSize: "0.82rem", color: "#dc2626", margin: 0 }}>{submitError}</p>}

                  <button onClick={submitReview} disabled={submitting} style={{ padding: "13px 28px", borderRadius: "999px", border: "none", backgroundColor: submitting ? "#c0a090" : "#b8704a", color: "#fff", fontWeight: 800, fontSize: "0.9rem", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: "4px" }}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </section>
  );
}
