"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShoppingBag } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", backgroundColor: "#1a1008",
      backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(184,112,74,0.15) 0%, transparent 60%)",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px", padding: "40px 36px",
        backdropFilter: "blur(20px)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            backgroundColor: "#b8704a", display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <ShoppingBag style={{ width: "24px", height: "24px", color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#f2e8e1", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Step Wears Admin
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#7a6a62", margin: 0 }}>
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a6a62", marginBottom: "8px" }}>
              Admin Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#7a6a62" }} />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: "100%", padding: "12px 44px", borderRadius: "12px",
                  border: `1px solid ${error ? "#f87171" : "rgba(255,255,255,0.1)"}`,
                  backgroundColor: "rgba(255,255,255,0.06)", color: "#f2e8e1",
                  fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = error ? "#f87171" : "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7a6a62", cursor: "pointer", padding: 0 }}
              >
                {showPw ? <EyeOff style={{ width: "15px", height: "15px" }} /> : <Eye style={{ width: "15px", height: "15px" }} />}
              </button>
            </div>
            {error && <p style={{ fontSize: "0.78rem", color: "#f87171", margin: "8px 0 0" }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: "12px", border: "none",
              backgroundColor: loading ? "#7a6a62" : "#b8704a", color: "#fff",
              fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s", fontFamily: "inherit",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
