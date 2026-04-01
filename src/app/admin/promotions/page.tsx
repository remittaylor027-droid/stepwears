"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Megaphone, Pencil, X, ToggleLeft, ToggleRight,
  ArrowUp, ArrowDown, Check,
} from "lucide-react";

// ── Types ─────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  promo_price: number | null;
  image: string;
  is_promoted: boolean;
  promo_text: string | null;
  promo_tag: string | null;
  promo_tag_color: string | null;
  promo_order: number;
  is_available: boolean;
}

const PRESET_TAGS = [
  { label: "Trending",    color: "#4a2a18" },
  { label: "Best Seller", color: "#b8704a" },
  { label: "New Arrival", color: "#7a4426" },
  { label: "Sale",        color: "#9d5c38" },
  { label: "Limited",     color: "#c0392b" },
  { label: "Popular",     color: "#6b4226" },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)",
  color: "#f2e8e1", fontSize: "0.85rem", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
  textTransform: "uppercase", color: "#7a6a62", marginBottom: "6px",
};

export default function AdminPromotionsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    promo_text: "", promo_tag: "Trending", promo_tag_color: "#4a2a18",
    promo_order: 0, promo_price: "",
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"promoted" | "all">("promoted");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setProducts(
      (data.products ?? []).sort((a: Product, b: Product) => a.promo_order - b.promo_order)
    );
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const promoted = products.filter((p) => p.is_promoted);
  const all      = products.filter((p) => !p.is_promoted && p.is_available);

  const patch = async (id: string, updates: Record<string, unknown>) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchProducts();
  };

  const togglePromoted = (p: Product) => {
    if (!p.is_promoted) {
      // Enable promotion — open edit form prefilled
      setEditForm({
        promo_text: p.promo_text ?? "",
        promo_tag: p.promo_tag ?? "Trending",
        promo_tag_color: p.promo_tag_color ?? "#4a2a18",
        promo_order: promoted.length,
        promo_price: "",
      });
      setEditingId(p.id);
    } else {
      patch(p.id, { is_promoted: false });
    }
  };

  const startEdit = (p: Product) => {
    setEditForm({
      promo_text: p.promo_text ?? "",
      promo_tag: p.promo_tag ?? "Trending",
      promo_tag_color: p.promo_tag_color ?? "#4a2a18",
      promo_order: p.promo_order,
      promo_price: p.promo_price ? String(p.promo_price) : "",
    });
    setEditingId(p.id);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        is_promoted: true,
        featured: true,           // auto-feature when promoted
        promo_text: editForm.promo_text,
        promo_tag: editForm.promo_tag,
        promo_tag_color: editForm.promo_tag_color,
        promo_order: editForm.promo_order,
        promo_price: editForm.promo_price ? Number(editForm.promo_price) : null,
      }),
    });
    setSaving(false);
    setEditingId(null);
    fetchProducts();
  };

  const moveOrder = async (p: Product, dir: "up" | "down") => {
    const newOrder = dir === "up" ? p.promo_order - 1 : p.promo_order + 1;
    await patch(p.id, { promo_order: newOrder });
  };

  const shown = tab === "promoted" ? promoted : all;

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
            <Megaphone style={{ width: "16px", height: "16px", color: "#b8704a" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f2e8e1" }}>Promotions</span>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#4a3a32" }}>
          <span style={{ color: "#b8704a", fontWeight: 700 }}>{promoted.length}</span> / 4 slots used on hero slider
        </div>
      </div>

      <div style={{ padding: "28px" }}>

        {/* Info banner */}
        <div style={{ backgroundColor: "rgba(184,112,74,0.08)", border: "1px solid rgba(184,112,74,0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Megaphone style={{ width: "18px", height: "18px", color: "#b8704a", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1", marginBottom: "4px" }}>Home Page Hero Slider</div>
            <div style={{ fontSize: "0.78rem", color: "#7a6a62", lineHeight: 1.6 }}>
              Products marked as promoted appear in the hero slider on the home page. Set a tag (e.g. "Trending"), a promo message, and drag to reorder. Best with 2–4 items.
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {([["promoted", `On Slider (${promoted.length})`], ["all", `Add More`]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer",
              backgroundColor: tab === t ? "#b8704a" : "rgba(255,255,255,0.05)",
              color: tab === t ? "#fff" : "#7a6a62", fontWeight: 700,
              fontSize: "0.82rem", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: "#4a3a32", padding: "40px", textAlign: "center" }}>Loading...</p>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#4a3a32" }}>
            <Megaphone style={{ width: "32px", height: "32px", margin: "0 auto 12px" }} />
            <p>{tab === "promoted" ? "No promoted products yet. Switch to 'Add More' to add some." : "All products are already on the slider!"}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {tab === "promoted"
                    ? ["Order", "Product", "Tag", "Promo Text", "Controls"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a32" }}>{h}</th>
                      ))
                    : ["Product", "Price", "Add to Slider"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a32" }}>{h}</th>
                      ))
                  }
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < shown.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

                    {tab === "promoted" && (
                      <td style={{ padding: "14px 16px", width: "80px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <button onClick={() => moveOrder(p, "up")} disabled={p.promo_order === 0} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#7a6a62", cursor: p.promo_order === 0 ? "not-allowed" : "pointer", padding: "3px 6px", opacity: p.promo_order === 0 ? 0.3 : 1 }}>
                            <ArrowUp style={{ width: "11px", height: "11px" }} />
                          </button>
                          <span style={{ fontSize: "11px", color: "#4a3a32", textAlign: "center", fontWeight: 700 }}>{p.promo_order + 1}</span>
                          <button onClick={() => moveOrder(p, "down")} disabled={p.promo_order === promoted.length - 1} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#7a6a62", cursor: p.promo_order === promoted.length - 1 ? "not-allowed" : "pointer", padding: "3px 6px", opacity: p.promo_order === promoted.length - 1 ? 0.3 : 1 }}>
                            <ArrowDown style={{ width: "11px", height: "11px" }} />
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Product info */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {p.image && (
                          <div style={{ width: "42px", height: "42px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "#2a1a0e" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1" }}>{p.name}</div>
                          <div style={{ fontSize: "10px", color: "#4a3a32", textTransform: "capitalize" }}>{p.category}</div>
                        </div>
                      </div>
                    </td>

                    {tab === "promoted" && (
                      <>
                        {/* Tag */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 10px", borderRadius: "999px", backgroundColor: p.promo_tag_color ?? "#b8704a", color: "#fff" }}>
                            {p.promo_tag ?? "New"}
                          </span>
                        </td>
                        {/* Promo text */}
                        <td style={{ padding: "14px 16px", fontSize: "0.82rem", color: "#7a6a62", maxWidth: "200px" }}>
                          {p.promo_text ?? <span style={{ color: "#4a3a32", fontStyle: "italic" }}>No promo text</span>}
                        </td>
                        {/* Controls */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => startEdit(p)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", color: "#7a6a62", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                              <Pencil style={{ width: "11px", height: "11px" }} /> Edit
                            </button>
                            <button onClick={() => togglePromoted(p)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(248,113,113,0.2)", backgroundColor: "transparent", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                              <X style={{ width: "11px", height: "11px" }} /> Remove
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {tab === "all" && (
                      <>
                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1" }}>
                          Rs. {p.price.toLocaleString()}
                          {p.original_price && <span style={{ fontSize: "11px", color: "#7a6a62", fontWeight: 400, marginLeft: "6px", textDecoration: "line-through" }}>Rs. {p.original_price.toLocaleString()}</span>}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button onClick={() => togglePromoted(p)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", border: "none", backgroundColor: "rgba(184,112,74,0.15)", color: "#b8704a", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                            + Add to Slider
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editingId && (
        <div onClick={() => setEditingId(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1008", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, color: "#f2e8e1", margin: 0 }}>Set Promotion Details</h2>
              <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", color: "#7a6a62", cursor: "pointer" }}><X style={{ width: "18px", height: "18px" }} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Promo text */}
              <div>
                <label style={lbl}>Promo Message</label>
                <input value={editForm.promo_text} onChange={(e) => setEditForm((f) => ({ ...f, promo_text: e.target.value }))}
                  placeholder="e.g. Save Rs. 1,200 today" style={inp}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>

              {/* Promo Price */}
              <div>
                <label style={lbl}>Promotion Price (Rs.) <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#4a3a32" }}>— leave blank to keep original price</span></label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#7a6a62", fontSize: "0.82rem", pointerEvents: "none" }}>Rs.</span>
                  <input
                    type="number" min="0"
                    value={editForm.promo_price}
                    onChange={(e) => setEditForm((f) => ({ ...f, promo_price: e.target.value }))}
                    placeholder="e.g. 3500"
                    style={{ ...inp, paddingLeft: "42px" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Tag presets */}
              <div>
                <label style={lbl}>Tag</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {PRESET_TAGS.map((tag) => (
                    <button key={tag.label} type="button" onClick={() => setEditForm((f) => ({ ...f, promo_tag: tag.label, promo_tag_color: tag.color }))}
                      style={{ padding: "5px 14px", borderRadius: "999px", border: `2px solid ${editForm.promo_tag === tag.label ? "#f2e8e1" : "transparent"}`, backgroundColor: tag.color, color: "#fff", fontSize: "11px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                      {tag.label}
                      {editForm.promo_tag === tag.label && <Check style={{ width: "10px", height: "10px", marginLeft: "5px", display: "inline" }} />}
                    </button>
                  ))}
                </div>
                {/* Custom tag */}
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
                  <input type="color" value={editForm.promo_tag_color} onChange={(e) => setEditForm((f) => ({ ...f, promo_tag_color: e.target.value }))}
                    style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "transparent", cursor: "pointer", padding: "2px" }} />
                  <input value={editForm.promo_tag} onChange={(e) => setEditForm((f) => ({ ...f, promo_tag: e.target.value }))}
                    placeholder="Custom tag name" style={{ ...inp, flex: 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
              </div>

              {/* Order */}
              <div>
                <label style={lbl}>Slider Position (0 = first)</label>
                <input type="number" min="0" max="10" value={editForm.promo_order}
                  onChange={(e) => setEditForm((f) => ({ ...f, promo_order: Number(e.target.value) }))}
                  style={{ ...inp, width: "100px" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>

              {/* Preview */}
              <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "10px", color: "#4a3a32", marginBottom: "8px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Preview</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 10px", borderRadius: "999px", backgroundColor: editForm.promo_tag_color, color: "#fff" }}>
                    {editForm.promo_tag || "Tag"}
                  </span>
                  {editForm.promo_price && (
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#f2e8e1" }}>Rs. {Number(editForm.promo_price).toLocaleString()}</span>
                  )}
                </div>
                {editForm.promo_text && (
                  <div style={{ fontSize: "12px", color: "#b8704a", marginTop: "8px" }}>🏷 {editForm.promo_text}</div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button onClick={() => setEditingId(null)} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent", color: "#7a6a62", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
                <button onClick={saveEdit} disabled={saving} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", backgroundColor: saving ? "#7a6a62" : "#b8704a", color: "#fff", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  {saving ? "Saving..." : "Save & Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
