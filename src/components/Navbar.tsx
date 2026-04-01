"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Shop",       href: "/shop" },
  { label: "Hire Me",   href: "/hire-me" },
  { label: "About",     href: "/about" },
  { label: "FAQs",      href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: "rgba(253,249,247,0.94)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid #ede8e3",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "0 24px",
        height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "#2d1f1a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#f2e8e1", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em" }}>SW</span>
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#2d1f1a" }}>
            Step Wears
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: "8px 16px", fontSize: "0.875rem", fontWeight: 500,
              color: "#7c6b63", textDecoration: "none", borderRadius: "999px",
              transition: "background-color 0.15s, color 0.15s",
            }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1";
                (e.currentTarget as HTMLElement).style.color = "#2d1f1a";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#7c6b63";
              }}
            >{link.label}</Link>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[{ href: "/account", icon: User, label: "Account" }].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} aria-label={label} style={{
              padding: "8px", borderRadius: "50%", color: "#7c6b63",
              display: "flex", alignItems: "center", justifyContent: "center",
              textDecoration: "none", transition: "background-color 0.15s",
            }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <Icon style={{ width: "18px", height: "18px" }} />
            </Link>
          ))}

          <Link href="/cart" aria-label={`Cart ${totalItems > 0 ? `(${totalItems} items)` : ""}`} style={{
            padding: "8px", borderRadius: "50%", color: "#7c6b63",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none", position: "relative", transition: "background-color 0.15s",
          }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <ShoppingBag style={{ width: "18px", height: "18px" }} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: "2px", right: "2px",
                minWidth: "16px", height: "16px", borderRadius: "999px",
                backgroundColor: "#b8704a", color: "#fff",
                fontSize: "9px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px", lineHeight: 1,
                animation: "badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              }}>{totalItems > 99 ? "99+" : totalItems}</span>
            )}
          </Link>

          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            style={{ display: "none", padding: "8px", borderRadius: "50%", border: "none", backgroundColor: "transparent", color: "#7c6b63", cursor: "pointer" }}>
            {mobileOpen ? <X style={{ width: "18px", height: "18px" }} /> : <Menu style={{ width: "18px", height: "18px" }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid #ede8e3", padding: "12px 16px 16px", backgroundColor: "#fdf9f7" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
              display: "block", padding: "10px 16px", borderRadius: "12px",
              fontSize: "0.9rem", fontWeight: 500, color: "#7c6b63", textDecoration: "none",
              transition: "background-color 0.15s",
            }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >{link.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes badgePop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
