import Link from "next/link";

export default function BlogPage() {
  return (
    <main style={{ padding: "84px 24px 48px", maxWidth: "980px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 900, color: "#2d1f1a", marginBottom: "20px" }}>
        Step Wears Blog
      </h1>
      <p style={{ fontSize: "1.05rem", color: "#7c6b63", marginBottom: "32px" }}>
        Trends, tips, and stories about elegant ladies&apos; footwear, care guides, and custom design updates.
      </p>

      <article style={{ marginBottom: "24px", padding: "18px", border: "1px solid #ede8e3", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "6px" }}>Care Tips: Make Your Shoes Last Longer</h2>
        <p style={{ fontSize: "0.95rem", color: "#6d5e54", marginBottom: "10px" }}>
          Practical cleaning, storage, and polishing routine to keep your favorite shoes in top condition.
        </p>
        <Link href="/blog/care-tips" style={{ color: "#b8704a", textDecoration: "none", fontWeight: 700 }}>
          Read more →
        </Link>
      </article>

      <article style={{ marginBottom: "24px", padding: "18px", border: "1px solid #ede8e3", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "6px" }}>This Season&apos;s Must-Have Styles</h2>
        <p style={{ fontSize: "0.95rem", color: "#6d5e54", marginBottom: "10px" }}>
          Explore footwear picks for every occasion from classic moccasins to bold statement heels.
        </p>
        <Link href="/blog/season-styles" style={{ color: "#b8704a", textDecoration: "none", fontWeight: 700 }}>
          Read more →
        </Link>
      </article>

      <p style={{ fontSize: "0.9rem", color: "#a09088" }}>
        Want more? Stay tuned for updates and follow us on social media!
      </p>
    </main>
  );
}
