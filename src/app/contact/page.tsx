"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, MessageCircle, Send, Clock,
  Camera, Share2, AtSign, Play, ArrowRight, CheckCircle,
} from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+92 339 0912145",
    sub: "Mon – Sat, 10am – 7pm",
    href: "tel:+923390912145",
    color: "#b8704a",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "support@stepwears.online",
    sub: "We reply within 24 hours",
    href: "mailto:support@stepwears.online",
    color: "#b8704a",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+92 339 0912145",
    sub: "Chat with us anytime",
    href: "https://wa.me/923390912145",
    color: "#25d366",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Lahore, Punjab",
    sub: "Pakistan",
    href: "https://maps.google.com",
    color: "#b8704a",
  },
];

const SOCIAL = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Share2, label: "Facebook", href: "#" },
  { icon: AtSign, label: "Twitter / X", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
];

const FAQ = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days. Custom orders take 7–14 business days depending on complexity.",
  },
  {
    q: "Can I return or exchange my order?",
    a: "Yes! We offer hassle-free returns within 7 days of delivery. Custom orders are remade free if the fit is wrong.",
  },
  {
    q: "Do you deliver outside Pakistan?",
    a: "Currently we ship within Pakistan only. International shipping is coming soon — follow us for updates!",
  },
  {
    q: "How do I place a custom shoe order?",
    a: "Head to our Hire Me page, fill in your preferences, and our cobblers will be in touch within 24 hours.",
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #e8d8ce",
  backgroundColor: "#fdf9f7",
  fontSize: "0.875rem",
  color: "#2d1f1a",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#c0a090",
  marginBottom: "6px",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const whatsappMsg = encodeURIComponent(`Hi Step Wears! I'd like to get in touch.`);
  const whatsappUrl = `https://wa.me/923390912145?text=${whatsappMsg}`;

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh" }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        background: "#ffffff",
        borderBottom: "1px solid #ede8e3",
        padding: "104px 24px 72px",
        textAlign: "center",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", marginBottom: "18px",
          display: "block",
        }}>
          Get in Touch
        </span>
        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 900,
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "#2d1f1a", marginBottom: "18px", marginTop: 0,
        }}>
          We&apos;d Love to Hear<br />
          <span style={{ color: "#b8704a" }}>From You.</span>
        </h1>
        <p style={{
          fontSize: "1.05rem", color: "#7a6a62", lineHeight: 1.85,
          maxWidth: "460px", margin: "0 auto",
        }}>
          Whether you have a question about an order, want to try a custom pair,
          or just want to say hello — our team is always happy to help.
        </p>
      </section>

      {/* ══ CONTACT CARDS ════════════════════════════════════ */}
      <section style={{ padding: "0 24px", background: "#fdf9f7" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          transform: "translateY(-40px)",
        }} className="ct-cards">
          {CONTACT_CARDS.map(({ icon: Icon, label, value, sub, href, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                display: "flex", flexDirection: "column", gap: "12px",
                padding: "24px 22px", borderRadius: "20px",
                backgroundColor: "#ffffff", border: "1px solid #ede8e3",
                textDecoration: "none",
                transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 8px 32px rgba(45,31,26,0.1)";
                el.style.borderColor = "#e8d8ce";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.borderColor = "#ede8e3";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "13px",
                border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon style={{ width: "20px", height: "20px", color }} />
              </div>
              <div>
                <div style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "#c0a090", marginBottom: "4px",
                }}>{label}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2d1f1a" }}>{value}</div>
                <div style={{ fontSize: "0.75rem", color: "#a09088", marginTop: "3px" }}>{sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══ FORM + INFO SPLIT ════════════════════════════════ */}
      <section style={{
        background: "#ffffff", borderTop: "1px solid #ede8e3",
        borderBottom: "1px solid #ede8e3",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
        }} className="ct-split">

          {/* LEFT — Form */}
          <div style={{ padding: "72px 56px 72px 32px", borderRight: "1px solid #ede8e3" }} className="ct-pad">
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#b8704a",
              marginBottom: "10px", marginTop: 0,
            }}>Send a Message</p>
            <h2 style={{
              fontSize: "1.9rem", fontWeight: 800, color: "#2d1f1a",
              letterSpacing: "-0.02em", marginBottom: "8px", marginTop: 0,
            }}>
              Drop Us a Line
            </h2>
            <p style={{
              fontSize: "0.9rem", color: "#7a6a62", lineHeight: 1.7,
              marginBottom: "36px", marginTop: 0,
            }}>
              Fill in the form and we&apos;ll get back to you within 24 hours.
            </p>

            <div style={{ height: "1px", backgroundColor: "#ede8e3", marginBottom: "32px" }} />

            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <CheckCircle style={{ width: "26px", height: "26px", color: "#b8704a" }} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2d1f1a", marginBottom: "10px", marginTop: 0 }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#7a6a62", lineHeight: 1.7, maxWidth: "340px", margin: "0 auto" }}>
                  Thanks, <span style={{ color: "#2d1f1a", fontWeight: 600 }}>{form.name}</span>! 
                  We&apos;ll reply to <span style={{ color: "#2d1f1a", fontWeight: 600 }}>{form.email}</span> very soon.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  style={{
                    marginTop: "24px", padding: "10px 24px", borderRadius: "999px",
                    border: "1px solid #e8d8ce", backgroundColor: "transparent",
                    color: "#4a2a18", fontSize: "0.85rem", fontWeight: 600,
                    cursor: "pointer", transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="ct-form-row">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="e.g. Ayesha Khan"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email" name="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={labelStyle}>Subject *</label>
                  <select
                    name="subject" required value={form.subject} onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                  >
                    <option value="">Select a topic</option>
                    {[
                      "Order Query",
                      "Return or Exchange",
                      "Custom Shoe Order",
                      "Size & Fit Help",
                      "Wholesale / Bulk Order",
                      "Partnership",
                      "Other",
                    ].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message" required rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                  />
                </div>

                <div style={{ height: "1px", backgroundColor: "#ede8e3" }} />

                {/* Submit */}
                <button type="submit" id="contact-submit" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", padding: "14px 28px", borderRadius: "14px",
                  border: "none", backgroundColor: "#2d1f1a", color: "#f2e8e1",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  transition: "opacity 0.2s", fontFamily: "inherit",
                }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  <Send style={{ width: "15px", height: "15px" }} />
                  Send Message
                </button>

                {/* Or WhatsApp */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
                  <span style={{ fontSize: "0.72rem", color: "#c0a090", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
                </div>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  id="contact-whatsapp"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "10px", padding: "13px", borderRadius: "14px",
                    border: "1.5px solid #25d366", backgroundColor: "#f0fdf4",
                    color: "#166534", fontWeight: 700, fontSize: "0.9rem",
                    textDecoration: "none", transition: "all 0.2s", boxSizing: "border-box",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "#25d366";
                    el.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "#f0fdf4";
                    el.style.color = "#166534";
                  }}
                >
                  <MessageCircle style={{ width: "18px", height: "18px" }} />
                  Message on WhatsApp
                </a>
              </form>
            )}
          </div>

          {/* RIGHT — Info panel */}
          <div style={{ padding: "72px 32px 72px 48px", display: "flex", flexDirection: "column", gap: "40px" }} className="ct-pad">

            {/* Hours */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Clock style={{ width: "16px", height: "16px", color: "#b8704a" }} />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2d1f1a", margin: 0 }}>Business Hours</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["Monday – Friday", "10:00 AM – 7:00 PM"],
                  ["Saturday", "11:00 AM – 5:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <div key={day} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: "10px",
                    backgroundColor: "#fdf9f7", border: "1px solid #ede8e3",
                  }}>
                    <span style={{ fontSize: "0.82rem", color: "#4a2a18", fontWeight: 500 }}>{day}</span>
                    <span style={{ fontSize: "0.82rem", color: hours === "Closed" ? "#c0a090" : "#b8704a", fontWeight: 600 }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div style={{
              padding: "20px", borderRadius: "16px",
              border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  border: "1px solid #ede8e3", backgroundColor: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <MapPin style={{ width: "16px", height: "16px", color: "#b8704a" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2d1f1a", marginBottom: "4px" }}>Our Showroom</div>
                  <div style={{ fontSize: "0.82rem", color: "#7a6a62", lineHeight: 1.65 }}>
                    Shop No. 12, Liberty Market<br />
                    Gulberg III, Lahore<br />
                    Punjab, Pakistan
                  </div>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "0.75rem", color: "#b8704a", fontWeight: 600, textDecoration: "none", marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Get Directions <ArrowRight style={{ width: "11px", height: "11px" }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c0a090", marginBottom: "14px", marginTop: 0 }}>
                Follow Us
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {SOCIAL.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label}
                    style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#7a6a62", textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "#2d1f1a";
                      el.style.borderColor = "#2d1f1a";
                      el.style.color = "#f2e8e1";
                    }}
                    onMouseOut={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "#fdf9f7";
                      el.style.borderColor = "#ede8e3";
                      el.style.color = "#7a6a62";
                    }}
                  >
                    <Icon style={{ width: "16px", height: "16px" }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={{
              padding: "20px", borderRadius: "16px",
              border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c0a090", marginBottom: "14px", marginTop: 0 }}>
                Quick Links
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Custom Shoe Order", href: "/hire-me" },
                  { label: "Shop All Products", href: "/shop" },
                  { label: "Size Guide", href: "/size-guide" },
                  { label: "Returns & Exchanges", href: "/returns" },
                ].map(({ label, href }) => (
                  <Link key={label} href={href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: "10px",
                    fontSize: "0.83rem", color: "#4a2a18", fontWeight: 500,
                    textDecoration: "none", transition: "background-color 0.15s",
                  }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1")}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    {label}
                    <ArrowRight style={{ width: "13px", height: "13px", color: "#b8704a", flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ═══════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "#fdf9f7" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8704a", marginBottom: "10px", marginTop: 0 }}>
            FAQs
          </p>
          <h2 style={{ textAlign: "center", fontSize: "1.9rem", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", marginBottom: "48px", marginTop: 0 }}>
            Common Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FAQ.map(({ q, a }, i) => (
              <div key={i} style={{
                borderRadius: "16px", border: "1px solid #ede8e3",
                backgroundColor: "#ffffff", overflow: "hidden",
                transition: "box-shadow 0.2s ease",
                boxShadow: openFaq === i ? "0 4px 20px rgba(45,31,26,0.08)" : "none",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "18px 20px",
                    border: "none", backgroundColor: "transparent",
                    cursor: "pointer", textAlign: "left", gap: "12px",
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2d1f1a" }}>{q}</span>
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    border: "1px solid #e8d8ce", backgroundColor: "#fdf9f7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: "14px", color: "#b8704a", fontWeight: 700,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px" }}>
                    <div style={{ height: "1px", backgroundColor: "#ede8e3", marginBottom: "14px" }} />
                    <p style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.75, margin: 0 }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FLOATING WHATSAPP ════════════════════════════════ */}
      <a
        href={whatsappUrl} target="_blank" rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 100,
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#25d366", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          animation: "waPulse 2.5s ease-in-out infinite",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.6)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.45)";
        }}
      >
        <MessageCircle style={{ width: "26px", height: "26px", color: "#fff", fill: "#fff" }} />
      </a>

      <style>{`
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.45); }
          50%       { box-shadow: 0 4px 32px rgba(37,211,102,0.75); }
        }
        @media (max-width: 860px) {
          .ct-split   { grid-template-columns: 1fr !important; }
          .ct-pad     { padding: 48px 20px !important; border-right: none !important; border-bottom: 1px solid #ede8e3; }
          .ct-form-row { grid-template-columns: 1fr !important; }
          .ct-cards   { transform: none !important; padding-top: 32px; }
        }
      `}</style>
    </main>
  );
}
