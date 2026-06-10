import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { User, MapPin, Package, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#2d1f1a", margin: 0, letterSpacing: "-0.02em" }}>My Account</h1>
          
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "10px", border: "1px solid #ede8e3", backgroundColor: "#fff", color: "#b91c1c", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontSize: "0.875rem" }} onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2")} onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#fff")}>
              <LogOut style={{ width: "16px", height: "16px" }} />
              Log Out
            </button>
          </form>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "28px" }} className="acc-split">
          
          {/* Profile Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <User style={{ width: "18px", height: "18px", color: "#b8704a" }} /> Profile
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "4px" }}>Name</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2d1f1a" }}>{profile?.name || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "4px" }}>Email</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2d1f1a" }}>{profile?.email || user.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "4px" }}>Phone</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2d1f1a" }}>{profile?.phone || "Not provided"}</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin style={{ width: "18px", height: "18px", color: "#b8704a" }} /> Address
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "4px" }}>Street</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2d1f1a" }}>{profile?.address || "Not provided"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c0a090", marginBottom: "4px" }}>City</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2d1f1a" }}>{profile?.city || "Not provided"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #ede8e3", padding: "24px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d1f1a", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Package style={{ width: "18px", height: "18px", color: "#b8704a" }} /> Order History
            </h2>

            {(!profile?.orders || profile.orders.length === 0) ? (
              <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#fdf9f7", borderRadius: "16px", border: "1px dashed #e8d8ce" }}>
                <Package style={{ width: "32px", height: "32px", color: "#c0a090", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#2d1f1a", margin: "0 0 6px" }}>No orders yet</h3>
                <p style={{ fontSize: "0.875rem", color: "#7a6a62", margin: "0 0 20px" }}>You haven't placed any orders.</p>
                <Link href="/shop" style={{ display: "inline-block", backgroundColor: "#2d1f1a", color: "#f2e8e1", padding: "10px 24px", borderRadius: "999px", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {profile.orders.map((order) => (
                  <div key={order.id} style={{ padding: "16px", borderRadius: "16px", border: "1px solid #ede8e3", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a" }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", backgroundColor: order.status === "delivered" ? "#f0fdf4" : "#fef3c7", color: order.status === "delivered" ? "#166534" : "#92400e", textTransform: "uppercase" }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#7a6a62" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2d1f1a" }}>
                        Rs. {order.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .acc-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
