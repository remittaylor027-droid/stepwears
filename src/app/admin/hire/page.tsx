"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Scissors, Mail, Phone, Ruler,
  Palette, FileText, Trash2, Image as ImageIcon, ExternalLink,
} from "lucide-react";

type OrderStatus = "new" | "contacted" | "in_progress" | "completed" | "cancelled";

interface CustomOrder {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  shoe_size: string | null;
  color: string | null;
  details: string;
  reference_image: string | null;
  reference_images: string[] | null;
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; border: string; text: string }> = {
  new:         { label: "New",         bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  text: "#3b82f6" },
  contacted:   { label: "Contacted",   bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.3)",   text: "#ca8a04" },
  in_progress: { label: "In Progress", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.3)",  text: "#a855f7" },
  completed:   { label: "Completed",   bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)",  text: "#22c55e" },
  cancelled:   { label: "Cancelled",   bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  text: "#ef4444" },
};

export default function AdminHirePage() {
  const router = useRouter();
  const [orders, setOrders]       = useState<CustomOrder[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/hire");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch("/api/admin/hire", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this custom order permanently?")) return;
    setDeleting(id);
    await fetch("/api/admin/hire", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    fetchOrders();
  };

  const allStatuses: (OrderStatus | "all")[] = ["all", "new", "contacted", "in_progress", "completed", "cancelled"];
  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    contacted: orders.filter((o) => o.status === "contacted").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

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
            <Scissors style={{ width: "16px", height: "16px", color: "#b8704a" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f2e8e1" }}>Custom Orders</span>
          </div>
        </div>
        {counts.new > 0 && (
          <div style={{ fontSize: "11px", color: "#3b82f6", fontWeight: 700, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", padding: "4px 12px", borderRadius: "999px" }}>
            {counts.new} new {counts.new === 1 ? "inquiry" : "inquiries"}
          </div>
        )}
      </div>

      <div style={{ padding: "28px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
          {allStatuses.map((s) => {
            const cfg = s === "all"
              ? { label: "All", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "#f2e8e1" }
              : STATUS_CONFIG[s as OrderStatus];
            const active = tab === s;
            return (
              <button key={s} onClick={() => setTab(s)} style={{
                padding: "7px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit",
                backgroundColor: active ? cfg.bg : "rgba(255,255,255,0.03)",
                color: active ? cfg.text : "#7a6a62",
                border: `1px solid ${active ? cfg.border : "transparent"}`,
                fontWeight: 700, fontSize: "0.78rem",
              }}>
                {cfg.label} ({counts[s]})
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <p style={{ color: "#4a3a32", textAlign: "center", padding: "60px" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#4a3a32" }}>
            <Scissors style={{ width: "36px", height: "36px", margin: "0 auto 12px" }} />
            <p>No {tab === "all" ? "" : tab.replace("_", " ")} custom orders yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>

                  {/* Header row — always visible */}
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", flexWrap: "wrap" }}
                    onClick={() => setExpanded(isOpen ? null : order.id)}>

                    {/* Avatar */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#2a1a0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, color: "#b8704a", flexShrink: 0 }}>
                      {order.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, color: "#f2e8e1", fontSize: "0.9rem" }}>{order.name}</span>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                        {order.reference_image && (
                          <span style={{ fontSize: "10px", color: "#b8704a", display: "flex", alignItems: "center", gap: "3px" }}>
                            <ImageIcon style={{ width: "10px", height: "10px" }} /> has image
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "#4a3a32", marginTop: "2px" }}>
                        {new Date(order.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    {/* Quick info pills */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {order.shoe_size && <span style={{ fontSize: "10px", color: "#7a6a62", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: "6px" }}>Sz {order.shoe_size}</span>}
                      {order.color && <span style={{ fontSize: "10px", color: "#7a6a62", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: "6px" }}>{order.color}</span>}
                    </div>

                    <span style={{ fontSize: "18px", color: "#4a3a32", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                        {/* Contact info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6a62", margin: 0 }}>Contact</h4>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Mail style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0 }} />
                            <a href={`mailto:${order.email}`} style={{ fontSize: "0.85rem", color: "#d4c4b8", textDecoration: "none" }}>{order.email}</a>
                          </div>
                          {order.phone && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Phone style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0 }} />
                              <a href={`tel:${order.phone}`} style={{ fontSize: "0.85rem", color: "#d4c4b8", textDecoration: "none" }}>{order.phone}</a>
                            </div>
                          )}
                          {order.shoe_size && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Ruler style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0 }} />
                              <span style={{ fontSize: "0.85rem", color: "#d4c4b8" }}>Size {order.shoe_size}</span>
                            </div>
                          )}
                          {order.color && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Palette style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0 }} />
                              <span style={{ fontSize: "0.85rem", color: "#d4c4b8" }}>{order.color}</span>
                            </div>
                          )}
                        </div>

                        {/* Reference images */}
                        {(() => {
                          const imgs = [
                            ...(Array.isArray(order.reference_images) ? order.reference_images : []),
                            ...(order.reference_image && !(order.reference_images ?? []).includes(order.reference_image) ? [order.reference_image] : []),
                          ].filter(Boolean);
                          return imgs.length > 0 ? (
                            <div style={{ gridColumn: imgs.length > 1 ? "1 / -1" : "auto" }}>
                              <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6a62", margin: "0 0 10px" }}>Reference Images ({imgs.length})</h4>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                                {imgs.map((img, i) => (
                                  <div key={i} style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", position: "relative", aspectRatio: "1" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Reference ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    <a href={img} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: "5px", right: "5px", backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", borderRadius: "5px", padding: "2px 6px", fontSize: "9px", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
                                      <ExternalLink style={{ width: "8px", height: "8px" }} />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Details - full width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <FileText style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6a62", marginBottom: "6px" }}>Order Details</div>
                              <p style={{ fontSize: "0.85rem", color: "#a08878", lineHeight: 1.7, margin: 0 }}>{order.details}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status + Actions */}
                        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6a62" }}>Change Status:</span>
                          {(["new", "contacted", "in_progress", "completed", "cancelled"] as OrderStatus[]).map((s) => (
                            <button key={s} onClick={() => updateStatus(order.id, s)}
                              style={{
                                padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                                border: `1px solid ${order.status === s ? STATUS_CONFIG[s].border : "rgba(255,255,255,0.07)"}`,
                                backgroundColor: order.status === s ? STATUS_CONFIG[s].bg : "transparent",
                                color: order.status === s ? STATUS_CONFIG[s].text : "#4a3a32",
                                fontSize: "11px", fontWeight: 700,
                              }}>
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                          <button onClick={() => deleteOrder(order.id)} disabled={deleting === order.id}
                            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "none", backgroundColor: "transparent", color: "#4a3a32", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                            <Trash2 style={{ width: "11px", height: "11px" }} />
                            {deleting === order.id ? "Deleting..." : "Delete"}
                          </button>

                          {/* Quick contact */}
                          <a href={`mailto:${order.email}?subject=Your Custom Shoe Order — Step Wears&body=Hi ${order.name},%0D%0A%0D%0AThank you for your custom shoe order request. We'd love to help you bring your dream pair to life!%0D%0A%0D%0APls let us know any further details or questions.%0D%0A%0D%0AWarm regards,%0D%0AStep Wears Team`}
                            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.08)", color: "#b8704a", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>
                            <Mail style={{ width: "11px", height: "11px" }} /> Reply via Email
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
