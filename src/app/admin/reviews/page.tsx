"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, Check, X, Trash2, MessageSquare, Clock, BadgeCheck } from "lucide-react";

interface Review {
  id: string;
  created_at: string;
  customer_name: string;
  customer_location: string | null;
  rating: number;
  message: string;
  product_name: string | null;
  status: "pending" | "approved" | "rejected";
  is_verified: boolean;
}

const STATUS_COLORS = {
  pending:  { bg: "rgba(234,179,8,0.12)",  border: "rgba(234,179,8,0.3)",  text: "#ca8a04"  },
  approved: { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)", text: "#16a34a"  },
  rejected: { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)", text: "#dc2626"  },
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"pending" | "approved" | "rejected">("pending");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const patch = async (id: string, updates: Record<string, unknown>) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchReviews();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchReviews();
  };

  const filtered = reviews.filter((r) => r.status === tab);
  const counts = {
    pending:  reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const Stars = ({ n, size = 14 }: { n: number; size?: number }) => (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} style={{ width: size, height: size, fill: i < n ? "#f59e0b" : "#3a2a22", color: i < n ? "#f59e0b" : "#3a2a22" }} />
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0a06", fontFamily: "system-ui, sans-serif" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: "#1a1008", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7a6a62", textDecoration: "none", fontSize: "0.82rem" }}>
            <ChevronLeft style={{ width: "14px", height: "14px" }} /> Dashboard
          </Link>
          <span style={{ color: "#4a3a32" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare style={{ width: "16px", height: "16px", color: "#b8704a" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f2e8e1" }}>Reviews</span>
          </div>
        </div>
        {counts.pending > 0 && (
          <div style={{ fontSize: "11px", color: "#ca8a04", fontWeight: 700, background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", padding: "4px 12px", borderRadius: "999px" }}>
            {counts.pending} awaiting approval
          </div>
        )}
      </div>

      <div style={{ padding: "28px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {(["pending", "approved", "rejected"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px", borderRadius: "999px", cursor: "pointer",
              backgroundColor: tab === t ? STATUS_COLORS[t].bg : "rgba(255,255,255,0.04)",
              color: tab === t ? STATUS_COLORS[t].text : "#7a6a62",
              fontWeight: 700, fontSize: "0.82rem", fontFamily: "inherit",
              border: `1px solid ${tab === t ? STATUS_COLORS[t].border : "transparent"}`,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              {t === "pending" && <Clock style={{ width: "12px", height: "12px" }} />}
              {t === "approved" && <Check style={{ width: "12px", height: "12px" }} />}
              {t === "rejected" && <X style={{ width: "12px", height: "12px" }} />}
              {t.charAt(0).toUpperCase() + t.slice(1)} ({counts[t]})
            </button>
          ))}
        </div>

        {/* Reviews list */}
        {loading ? (
          <p style={{ color: "#4a3a32", padding: "60px", textAlign: "center" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#4a3a32" }}>
            <MessageSquare style={{ width: "36px", height: "36px", margin: "0 auto 12px" }} />
            <p>No {tab} reviews yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((r) => (
              <div key={r.id} style={{
                backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "20px 24px",
                display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start",
              }}>
                <div>
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                    {/* Avatar */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#2a1a0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#b8704a", flexShrink: 0 }}>
                      {r.customer_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#f2e8e1" }}>{r.customer_name}</span>
                        {r.is_verified && <BadgeCheck style={{ width: "14px", height: "14px", color: "#22c55e" }} />}
                      </div>
                      {r.customer_location && <span style={{ fontSize: "11px", color: "#4a3a32" }}>{r.customer_location}</span>}
                    </div>
                    <Stars n={r.rating} />
                    {r.product_name && (
                      <span style={{ fontSize: "10px", color: "#7a6a62", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {r.product_name}
                      </span>
                    )}
                    <span style={{ fontSize: "10px", color: "#4a3a32", marginLeft: "auto" }}>
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Message */}
                  <p style={{ fontSize: "0.88rem", color: "#a08878", lineHeight: 1.65, margin: 0 }}>
                    &ldquo;{r.message}&rdquo;
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                  {r.status !== "approved" && (
                    <button onClick={() => patch(r.id, { status: "approved" })}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)", backgroundColor: "rgba(34,197,94,0.08)", color: "#22c55e", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      <Check style={{ width: "11px", height: "11px" }} /> Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button onClick={() => patch(r.id, { status: "rejected" })}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      <X style={{ width: "11px", height: "11px" }} /> Reject
                    </button>
                  )}
                  <button onClick={() => patch(r.id, { is_verified: !r.is_verified })}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", color: r.is_verified ? "#22c55e" : "#7a6a62", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    <BadgeCheck style={{ width: "11px", height: "11px" }} />
                    {r.is_verified ? "Verified ✓" : "Mark Verified"}
                  </button>
                  <button onClick={() => remove(r.id)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", borderRadius: "8px", border: "none", backgroundColor: "transparent", color: "#4a3a32", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                    <Trash2 style={{ width: "11px", height: "11px" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
