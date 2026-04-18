"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, Package, Clock, CheckCircle, Truck,
  XCircle, LogOut, RefreshCw, Eye, TrendingUp, Users, Megaphone, MessageSquare, Scissors, RotateCcw
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  notes: string | null;
  payment_method: "cod" | "bank";
  items: Array<{ product_name: string; image?: string; color: string; size: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "#92400e", bg: "#fffbeb", icon: Clock },
  confirmed: { label: "Confirmed", color: "#1e40af", bg: "#eff6ff", icon: CheckCircle },
  shipped:   { label: "Shipped",   color: "#6b21a8", bg: "#faf5ff", icon: Truck },
  delivered: { label: "Delivered", color: "#166534", bg: "#f0fdf4", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#991b1b", bg: "#fef2f2", icon: XCircle },
  returned:  { label: "Returned",  color: "#9d5c38", bg: "#fcefe8", icon: RotateCcw },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   "confirmed",
  confirmed: "shipped",
  shipped:   "delivered",
};

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    setUpdating(null);
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Summary stats
  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    revenue:   orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    customers: new Set(orders.map((o) => o.customer_phone)).size,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f0a06", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: "220px", flexShrink: 0, backgroundColor: "#1a1008", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#b8704a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingBag style={{ width: "16px", height: "16px", color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#f2e8e1" }}>Step Wears</div>
              <div style={{ fontSize: "10px", color: "#7a6a62" }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a3a32", padding: "0 8px 8px" }}>Navigation</div>
          {[
            { label: "All Orders",  value: "all",       count: orders.length },
            { label: "Pending",     value: "pending",   count: stats.pending },
            { label: "Confirmed",   value: "confirmed", count: orders.filter(o=>o.status==="confirmed").length },
            { label: "Shipped",     value: "shipped",   count: orders.filter(o=>o.status==="shipped").length },
            { label: "Delivered",   value: "delivered", count: orders.filter(o=>o.status==="delivered").length },
            { label: "Returned",    value: "returned",  count: orders.filter(o=>o.status==="returned").length },
            { label: "Cancelled",   value: "cancelled", count: orders.filter(o=>o.status==="cancelled").length },
          ].map((item) => (
            <button key={item.value} onClick={() => setFilter(item.value as typeof filter)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
              backgroundColor: filter === item.value ? "rgba(184,112,74,0.15)" : "transparent",
              color: filter === item.value ? "#b8704a" : "#7a6a62",
              fontSize: "0.82rem", fontWeight: filter === item.value ? 700 : 500,
              marginBottom: "2px", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
            }}>
              <span>{item.label}</span>
              {item.count > 0 && (
                <span style={{ fontSize: "10px", fontWeight: 800, backgroundColor: filter === item.value ? "#b8704a" : "rgba(255,255,255,0.08)", color: filter === item.value ? "#fff" : "#7a6a62", borderRadius: "999px", padding: "1px 7px" }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}

          {/* Products section */}
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a3a32", padding: "16px 8px 8px" }}>Catalogue</div>
          <Link href="/admin/products" style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 10px", borderRadius: "8px", textDecoration: "none",
            backgroundColor: "transparent", color: "#7a6a62",
            fontSize: "0.82rem", fontWeight: 500, transition: "all 0.15s",
          }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.1)"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
            onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7a6a62"; }}
          >
            <Package style={{ width: "14px", height: "14px" }} /> Products
          </Link>
          <Link href="/admin/reviews" style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 10px", borderRadius: "8px", textDecoration: "none",
            backgroundColor: "transparent", color: "#7a6a62",
            fontSize: "0.82rem", fontWeight: 500, transition: "all 0.15s",
          }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.1)"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
            onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7a6a62"; }}
          >
            <MessageSquare style={{ width: "14px", height: "14px" }} /> Reviews
          </Link>
          <Link href="/admin/hire" style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 10px", borderRadius: "8px", textDecoration: "none",
            backgroundColor: "transparent", color: "#7a6a62",
            fontSize: "0.82rem", fontWeight: 500, transition: "all 0.15s",
          }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,112,74,0.1)"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
            onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7a6a62"; }}
          >
            <Scissors style={{ width: "14px", height: "14px" }} /> Custom Orders
          </Link>
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", border: "none", backgroundColor: "transparent", color: "#7a6a62", cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit" }}>
            <LogOut style={{ width: "14px", height: "14px" }} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#f2e8e1", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              {filter === "all" ? "All Orders" : STATUS_CONFIG[filter as OrderStatus]?.label + " Orders"}
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#7a6a62", margin: 0 }}>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={fetchOrders} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", color: "#7a6a62", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}>
            <RefreshCw style={{ width: "13px", height: "13px" }} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {[
            { label: "Total Orders",  value: stats.total,                           icon: Package,    color: "#b8704a" },
            { label: "Pending",       value: stats.pending,                         icon: Clock,      color: "#f59e0b" },
            { label: "Revenue",       value: `Rs. ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "#22c55e" },
            { label: "Customers",     value: stats.customers,                       icon: Users,      color: "#6366f1" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a32" }}>{label}</span>
                <Icon style={{ width: "15px", height: "15px", color }} />
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#f2e8e1", letterSpacing: "-0.02em" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Orders table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#4a3a32" }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#4a3a32" }}>No orders found.</div>
        ) : (
          <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Order", "Customer", "Items", "Total", "Payment", "Status", "Action", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a32" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const status = STATUS_CONFIG[order.status];
                  const Icon = status.icon;
                  const next = NEXT_STATUS[order.status];
                  return (
                    <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f2e8e1" }}>#{order.id.slice(0,8).toUpperCase()}</div>
                        <div style={{ fontSize: "10px", color: "#4a3a32" }}>{new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#d4c4b8" }}>{order.customer_name}</div>
                        <div style={{ fontSize: "10px", color: "#4a3a32" }}>{order.city}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#7a6a62" }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                      <td style={{ padding: "14px 16px", fontSize: "0.875rem", fontWeight: 700, color: "#f2e8e1" }}>Rs. {order.total.toLocaleString()}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", backgroundColor: order.payment_method === "bank" ? "rgba(99,102,241,0.15)" : "rgba(34,197,94,0.12)", color: order.payment_method === "bank" ? "#818cf8" : "#4ade80" }}>
                          {order.payment_method === "bank" ? "Bank" : "COD"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", backgroundColor: status.bg, color: status.color }}>
                          <Icon style={{ width: "11px", height: "11px" }} /> {status.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {next && (
                          <button onClick={() => updateStatus(order.id, next)} disabled={updating === order.id} style={{
                            padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(184,112,74,0.3)",
                            backgroundColor: "rgba(184,112,74,0.1)", color: "#b8704a",
                            fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                            opacity: updating === order.id ? 0.5 : 1,
                          }}>
                            → {STATUS_CONFIG[next].label}
                          </button>
                        )}
                        {order.status === "confirmed" || order.status === "pending" ? (
                          <button onClick={() => updateStatus(order.id, "cancelled")} style={{
                            marginLeft: "6px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(248,113,113,0.2)",
                            backgroundColor: "transparent", color: "#f87171",
                            fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          }}>✕</button>
                        ) : null}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => setSelected(order)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", color: "#7a6a62", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                          <Eye style={{ width: "11px", height: "11px" }} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Order Detail Modal ── */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1008", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#f2e8e1", margin: "0 0 4px" }}>Order #{selected.id.slice(0, 8).toUpperCase()}</h2>
                <p style={{ fontSize: "0.78rem", color: "#7a6a62", margin: 0 }}>{new Date(selected.created_at).toLocaleString("en-PK")}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#7a6a62", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
            </div>

            {/* Customer */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a3a32", marginBottom: "12px" }}>Customer</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Name",    value: selected.customer_name },
                  { label: "Phone",   value: selected.customer_phone },
                  { label: "Email",   value: selected.customer_email ?? "—" },
                  { label: "City",    value: selected.city },
                  { label: "Address", value: selected.address },
                  { label: "Notes",   value: selected.notes ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ gridColumn: label === "Address" || label === "Notes" ? "1 / -1" : "auto" }}>
                    <div style={{ fontSize: "10px", color: "#4a3a32", marginBottom: "3px" }}>{label}</div>
                    <div style={{ fontSize: "0.82rem", color: "#d4c4b8", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a3a32", marginBottom: "12px" }}>Items</div>
              {selected.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < selected.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {item.image ? (
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>👠</div>
                    )}
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "#d4c4b8", fontWeight: 600 }}>{item.product_name}</div>
                      <div style={{ fontSize: "10px", color: "#4a3a32", marginTop: "2px" }}>{item.color} · Size {item.size} · Qty {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1" }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", marginTop: "4px" }}>
                <div style={{ fontSize: "0.82rem", color: "#7a6a62" }}>Shipping</div>
                <div style={{ fontSize: "0.82rem", color: "#7a6a62" }}>{selected.shipping === 0 ? "Free" : `Rs. ${selected.shipping}`}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "8px" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f2e8e1" }}>Total</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#b8704a" }}>Rs. {selected.total.toLocaleString()}</div>
              </div>
            </div>

            {/* Status control */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["pending", "confirmed", "shipped", "delivered", "returned", "cancelled"] as OrderStatus[]).map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s} style={{
                    padding: "7px 14px", borderRadius: "8px", border: `1px solid ${selected.status === s ? cfg.color : "rgba(255,255,255,0.08)"}`,
                    backgroundColor: selected.status === s ? cfg.bg : "transparent",
                    color: selected.status === s ? cfg.color : "#7a6a62",
                    fontSize: "11px", fontWeight: 700, cursor: selected.status === s ? "default" : "pointer",
                    fontFamily: "inherit", opacity: updating === selected.id ? 0.5 : 1,
                  }}>{cfg.label}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
