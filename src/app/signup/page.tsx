"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Create the Profile in our API
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id,
            email,
            name,
          }),
        });
      } catch (err) {
        console.error("Failed to create profile", err);
      }

      router.push("/account");
      router.refresh();
    }
  };

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 40px" }}>
      <div style={{ maxWidth: "400px", width: "100%", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #ede8e3", padding: "40px 32px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#2d1f1a", marginBottom: "8px", textAlign: "center" }}>Create Account</h1>
        <p style={{ color: "#7a6a62", marginBottom: "32px", textAlign: "center", fontSize: "0.9rem" }}>Join Step Wears today</p>

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#b91c1c", padding: "12px", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "20px", border: "1px solid #fca5a5" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c0a090", marginBottom: "6px" }}>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c0a090", marginBottom: "6px" }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c0a090", marginBottom: "6px" }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none", backgroundColor: loading ? "#7a6a62" : "#2d1f1a", color: "#f2e8e1", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: "10px"
          }}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.875rem", color: "#7a6a62" }}>
          Already have an account? <Link href="/login" style={{ color: "#b8704a", fontWeight: 700, textDecoration: "none" }}>Log in</Link>
        </div>
      </div>
    </main>
  );
}
