"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Share2, MessageCircle, Send, Video } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact Us", href: "/contact" },
  ],
  categories: [
    { label: "Moccasin", href: "/categories/moccasin" },
    { label: "Women Shoes", href: "/categories/women-shoes" },
    { label: "Court Shoes", href: "/categories/court-shoes" },
    { label: "Heels", href: "/categories/heels" },
    { label: "Pumps", href: "/categories/pumps" },
    { label: "Flats", href: "/categories/flats" },
    { label: "Sandals", href: "/categories/sandals" },
  ],
  support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Your Order", href: "/track" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Share2, label: "Instagram", href: "#" },
  { icon: MessageCircle, label: "Facebook", href: "#" },
  { icon: Send, label: "Twitter / X", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ width: "100%", backgroundColor: "#2d1f1a", color: "#d4beb2" }}>

      {/* Promo Banner */}
      <div style={{
        borderBottom: "1px solid #4a2a18", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "24px", flexWrap: "wrap", backgroundColor: "#4a2a18",
      }}>
        <p style={{ fontSize: "0.85rem", color: "#f2e8e1", fontWeight: 500, margin: 0 }}>
          🚚 Free shipping on orders over{" "}
          <span style={{ fontWeight: 700 }}>Rs. 5,000</span> — Use code{" "}
          <span style={{ fontWeight: 700, letterSpacing: "0.06em", color: "#e8d8ce" }}>STEPFREE</span>
        </p>
        <Link href="/categories" style={{
          fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#2d1f1a", textDecoration: "none", border: "1px solid #f2e8e1",
          borderRadius: "999px", padding: "6px 18px", backgroundColor: "#f2e8e1",
          transition: "background-color 0.15s",
        }}>Shop Now →</Link>
      </div>

      {/* Main Grid */}
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "64px 24px",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "48px",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#b8704a",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ color: "#fdf9f7", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em" }}>SW</span>
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#f2e8e1" }}>Step Wears</span>
          </Link>

          <p style={{ fontSize: "0.85rem", color: "#a09088", lineHeight: 1.75, maxWidth: "220px", margin: 0 }}>
            Premium ladies&apos; footwear crafted for elegance and comfort. Walk with confidence, every single day.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: Mail, label: "support@stepwears.online", href: "mailto:support@stepwears.online" },
              { icon: Phone, label: "+92 339 0912145", href: "tel:+923390912145" },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#a09088", textDecoration: "none" }}>
                <Icon style={{ width: "14px", height: "14px", color: "#c0a090", flexShrink: 0 }} />{label}
              </a>
            ))}
            <span style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.85rem", color: "#a09088" }}>
              <MapPin style={{ width: "14px", height: "14px", color: "#c0a090", flexShrink: 0, marginTop: "2px" }} />
              Lahore, Punjab, Pakistan
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} style={{
                width: "34px", height: "34px", borderRadius: "50%", border: "1px solid #4a2a18",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#a09088", transition: "border-color 0.15s, color 0.15s", textDecoration: "none",
              }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#b8704a"; (e.currentTarget as HTMLElement).style.color = "#b8704a"; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#4a2a18"; (e.currentTarget as HTMLElement).style.color = "#a09088"; }}
              ><Icon style={{ width: "14px", height: "14px" }} /></a>
            ))}
          </div>
        </div>

        {/* Links columns */}
        {[
          { title: "Company", links: footerLinks.company },
          { title: "Categories", links: footerLinks.categories },
        ].map(({ title, links }) => (
          <div key={title}>
            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e8d8ce", marginBottom: "20px", marginTop: 0 }}>
              {title}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} style={{ fontSize: "0.85rem", color: "#a09088", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#f2e8e1")}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#a09088")}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support + Newsletter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e8d8ce", marginBottom: "20px", marginTop: 0 }}>
              Support
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} style={{ fontSize: "0.85rem", color: "#a09088", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#f2e8e1")}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#a09088")}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e8d8ce", marginBottom: "12px", marginTop: 0 }}>
              Newsletter
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#a09088", marginBottom: "12px", lineHeight: 1.6, marginTop: 0 }}>
              Exclusive offers & new arrivals straight to your inbox.
            </p>
            <form style={{ display: "flex", gap: "8px" }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" style={{
                flex: 1, minWidth: 0, padding: "9px 14px", borderRadius: "10px",
                border: "1px solid #4a2a18", backgroundColor: "#3a2218", fontSize: "0.82rem",
                color: "#f2e8e1", outline: "none",
              }} />
              <button type="submit" style={{
                padding: "9px 16px", borderRadius: "10px", border: "none",
                backgroundColor: "#b8704a", color: "#fdf9f7", fontSize: "0.82rem",
                fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "opacity 0.15s",
              }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >Join</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid #4a2a18" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontSize: "0.78rem", color: "#7a4426", margin: 0 }}>
            © {new Date().getFullYear()} Step Wears. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Sitemap", href: "/sitemap" }].map(({ label, href }) => (
              <Link key={label} href={href} style={{ fontSize: "0.78rem", color: "#7a4426", textDecoration: "none", transition: "color 0.15s" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#b8704a")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#7a4426")}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
