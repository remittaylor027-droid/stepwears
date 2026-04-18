"use client";

import Link from "next/link";

const POSTS = [
  {
    slug: "care-tips",
    title: "Care Tips: Make Your Shoes Last Longer",
    excerpt: "Practical cleaning, storage, and polishing routines to keep your favorite shoes in top condition.",
    date: "March 12, 2026",
  },
  {
    slug: "season-styles",
    title: "This Season's Must-Have Styles",
    excerpt: "Discover the latest women’s footwear trends — from moccasins to heels — for every occasion.",
    date: "March 2, 2026",
  },
  {
    slug: "custom-orders",
    title: "How to Place a Custom Order",
    excerpt: "Step-by-step guide for designing your perfect pair with our handcrafted service.",
    date: "February 18, 2026",
  },
];

export default function BlogPage() {
  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh" }}>

      <section style={{ padding: "96px 24px 48px", textAlign: "center", background: "linear-gradient(170deg, #fff, #f6efeb 72%)" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#2d1f1a", margin: 0 }}>
          Step Wears Blog
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#7a6a62", maxWidth: "700px", margin: "12px auto 0" }}>
          News, style stories, and care guides for beautiful handcrafted footwear from our Lahore studio.
        </p>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "38px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
          {POSTS.map((post) => (
            <article key={post.slug} style={{ background: "#fff", border: "1px solid #ede8e3", borderRadius: "14px", padding: "18px", boxShadow: "0 10px 24px rgba(37,31,26,0.08)" }}>
              <small style={{ display: "block", color: "#a09088", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{post.date}</small>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 10px", color: "#2d1f1a" }}>{post.title}</h2>
              <p style={{ margin: "0 0 14px", color: "#6d5e54", lineHeight: 1.6 }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} style={{ color: "#b8704a", fontWeight: 700, textDecoration: "none" }}>
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: "#2d1f1a", color: "#fdf9f7", padding: "40px 24px 64px", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 10px" }}>Stay in the loop</h3>
        <p style={{ margin: "0 0 20px", color: "#d4beb2", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
          Subscribe for updates on new blog posts, product launches and exclusive offers.
        </p>
        <form style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" style={{ minWidth: "220px", padding: "10px 12px", borderRadius: "8px", border: "1px solid #4a2a18", background: "#fff", color: "#2d1f1a" }} />
          <button type="submit" style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#b8704a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
