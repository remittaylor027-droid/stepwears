"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, MessageCircle, Package, Ruler, RefreshCw,
  Scissors, CreditCard, Truck, Shield, HelpCircle,
} from "lucide-react";

// ── FAQ Data ─────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    id: "ordering",
    label: "Ordering",
    icon: Package,
    faqs: [
      {
        q: "How do I place an order?",
        a: "Browse our shop, select your preferred style, choose your colour, size, and quantity, then add to cart. Head to checkout, fill in your delivery details, and choose your payment method (Cash on Delivery or Bank Transfer). You'll receive a confirmation once your order is placed.",
      },
      {
        q: "Can I order by WhatsApp?",
        a: "Absolutely! You can reach us directly on WhatsApp to place a custom or standard order. Just share the product name, colour, size, and your delivery address — our team will guide you through the rest.",
      },
      {
        q: "Do you accept bulk or wholesale orders?",
        a: "Yes, we do! For bulk orders (10+ pairs), please contact us via WhatsApp or email to discuss special pricing, lead times, and customisation options.",
      },
      {
        q: "Can I order a product that appears out of stock?",
        a: "In many cases, yes. If a size or colour is out of stock, reach out to us — we can often fulfil the order with a production lead time of 7–14 business days.",
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes, you'll receive an order confirmation via email (if provided) and/or WhatsApp shortly after placing your order. If you don't receive one within 24 hours, please contact us.",
      },
    ],
  },
  {
    id: "sizing",
    label: "Sizing & Fit",
    icon: Ruler,
    faqs: [
      {
        q: "How do Step Wears shoes fit — true to size?",
        a: "Our shoes are crafted in standard Pakistani sizing (35–41). Most styles run true to size. We recommend checking the size guide on each product page, or reaching out if you're between sizes — we'll help you pick the best fit.",
      },
      {
        q: "Do you offer half sizes?",
        a: "For custom orders we can accommodate any measurement. For our ready-to-wear collection we offer full sizes 35–41. If you're between sizes we recommend sizing up for a more comfortable fit.",
      },
      {
        q: "What if my shoes don't fit?",
        a: "We offer free exchanges for sizing issues (domestic orders) within 7 days of delivery, provided the shoes are unworn and in original condition. For custom orders we offer a free remake if the fit is incorrect.",
      },
      {
        q: "Do you make wide-fit shoes?",
        a: "Yes! We cater to wide-fit customers through our custom order service. Please include your foot measurements when placing an order via the Hire Me page and our artisans will craft accordingly.",
      },
      {
        q: "Is there a size guide available?",
        a: "Yes — each product page has a size guide, and you can also visit our Size Guide page for a full measurement chart. When in doubt, reach out on WhatsApp and we'll personally help you choose.",
      },
    ],
  },
  {
    id: "custom",
    label: "Custom Orders",
    icon: Scissors,
    faqs: [
      {
        q: "How does the custom shoe order process work?",
        a: "Simply visit our Hire Me page and fill in the form — describe your dream shoe, choose your colour, heel type, material, and upload any reference images. Our artisans will review your request and get back to you within 24 hours to confirm details and pricing.",
      },
      {
        q: "How long does a custom pair take?",
        a: "Most custom orders are ready in 7–14 business days depending on complexity and material availability. Rush orders may be possible — please enquire when placing your request.",
      },
      {
        q: "Can I customise an existing design?",
        a: "Yes! You can use any of our existing styles as a base and customise the colour, material, heel height, embellishments, embroidery, or straps. Just mention this in your custom order form.",
      },
      {
        q: "How much do custom shoes cost?",
        a: "Custom pricing depends on the material, design complexity, and embellishments. Generally, custom pairs start from Rs. 4,000 upwards. We'll provide a full quote before you confirm your order — no surprises.",
      },
      {
        q: "Can I see a preview before my custom shoes are made?",
        a: "For complex designs, we can share a sketch or initial concept before production begins. This is especially useful for wedding or event shoes where precision is key.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      {
        q: "Where do you deliver?",
        a: "We deliver across all of Pakistan — major cities like Karachi, Lahore, Islamabad, and beyond. International shipping is also available; please contact us for rates and estimated delivery times for your country.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery within major Pakistani cities takes 2–4 business days. Remote areas may take 4–7 business days. Custom orders have their own production lead time (7–14 days) before dispatch.",
      },
      {
        q: "Is there a shipping charge?",
        a: "Shipping is free on orders over Rs. 5,000. For orders below this threshold, a flat shipping fee of Rs. 200–350 applies depending on your city.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is dispatched, we'll share a tracking link via WhatsApp or email using our courier partner's system.",
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is available within Karachi for selected products. Please contact us via WhatsApp before placing your order to confirm availability.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Exchanges",
    icon: RefreshCw,
    faqs: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for items that are unworn, in original condition, and in original packaging. Sale items and custom orders are non-returnable unless there is a manufacturing defect.",
      },
      {
        q: "How do I request an exchange or return?",
        a: "Contact us via WhatsApp or email with your order number and reason for return/exchange. Our team will guide you through the process and arrange a convenient pickup or dropoff.",
      },
      {
        q: "What if I receive a defective or wrong item?",
        a: "We sincerely apologise if that happens! Please contact us within 48 hours of receiving your order with photos of the issue. We'll arrange a replacement or full refund immediately — no questions asked.",
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect the returned item, refunds are processed within 3–5 business days. For bank transfers, please allow an additional 1–2 banking days for funds to appear in your account.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We currently accept Cash on Delivery (COD) and Bank Transfer / Direct Bank Deposit. We're working on adding online card payments — stay tuned!",
      },
      {
        q: "Is Cash on Delivery available everywhere?",
        a: "COD is available across all major cities in Pakistan. For remote locations, bank transfer may be the only option. Our team will confirm when you place your order.",
      },
      {
        q: "How does bank transfer payment work?",
        a: "After placing your order, we'll share our bank account details via WhatsApp or email. Once you've transferred the amount, please send us your payment proof and we'll dispatch your order within 24 hours.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We do not store any bank or card information. All transfers are direct bank-to-bank, and our website uses industry-standard security protocols.",
      },
    ],
  },
  {
    id: "product",
    label: "Product Care",
    icon: Shield,
    faqs: [
      {
        q: "How should I care for my leather shoes?",
        a: "Wipe with a soft, dry cloth after each wear. Use a good quality leather conditioner every few weeks to keep the leather supple. Avoid prolonged exposure to water or direct sunlight. Store in the dust bag when not in use.",
      },
      {
        q: "Can I wear Step Wears shoes in the rain?",
        a: "Our leather and suede shoes are not waterproof. If caught in rain, dry them slowly at room temperature — never with direct heat. Apply a water-repellent spray to suede styles as a preventive measure.",
      },
      {
        q: "How do I clean suede shoes?",
        a: "Use a suede brush to gently remove surface dirt. For stains, use a suede eraser or a slightly damp cloth, then brush once dry. Avoid soaking suede in water.",
      },
      {
        q: "Do you offer repair or resoling services?",
        a: "Yes! As master cobblers, we offer repair, resoling, and restoration services. Contact us with photos of your shoes and we'll advise on what's possible and a quote.",
      },
    ],
  },
];

// ── Single accordion item ─────────────────────────────────────────
function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderRadius: "14px",
        border: `1px solid ${open ? "rgba(184,112,74,0.3)" : "#ede8e3"}`,
        backgroundColor: open ? "rgba(184,112,74,0.04)" : "#fff",
        overflow: "hidden",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "18px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span
            style={{
              flexShrink: 0,
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              backgroundColor: open ? "#b8704a" : "rgba(184,112,74,0.1)",
              color: open ? "#fff" : "#b8704a",
              fontSize: "10px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              marginTop: "1px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: open ? "#2d1f1a" : "#4a3028",
              lineHeight: 1.4,
              transition: "color 0.2s",
            }}
          >
            {q}
          </span>
        </div>
        <ChevronDown
          style={{
            width: "18px",
            height: "18px",
            color: "#b8704a",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            padding: "0 20px 20px 54px",
            fontSize: "0.875rem",
            color: "#7a6a62",
            lineHeight: 1.8,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("ordering");

  const current = FAQ_CATEGORIES.find((c) => c.id === activeCategory)!;

  const WHATSAPP = "923001234567";
  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Step Wears! I have a question that isn't covered in your FAQs.")}`;

  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "64px" }}>

      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "#2d1f1a",
          padding: "72px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(184,112,74,0.15) 0%, transparent 60%), radial-gradient(ellipse at 75% 30%, rgba(184,112,74,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#b8704a",
              marginBottom: "20px",
              padding: "6px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(184,112,74,0.3)",
              backgroundColor: "rgba(184,112,74,0.08)",
            }}
          >
            <HelpCircle style={{ width: "12px", height: "12px" }} />
            Help Centre
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#f2e8e1",
              letterSpacing: "-0.028em",
              lineHeight: 1.1,
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(242,232,225,0.6)",
              lineHeight: 1.75,
              marginBottom: "32px",
              marginTop: 0,
            }}
          >
            Everything you need to know about ordering, sizing, custom shoes,
            delivery and more. Can&apos;t find your answer? We&apos;re always here to help.
          </p>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              ["7 Topics", "Covered"],
              ["30+ FAQs", "Answered"],
              ["24h", "Response time"],
            ].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#f2e8e1", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "0.65rem", color: "#c0a090", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "5px" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "56px 24px 96px",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "40px",
          alignItems: "flex-start",
        }}
        className="faq-layout"
      >
        {/* Sidebar — category tabs */}
        <nav
          style={{
            position: "sticky",
            top: "88px",
            backgroundColor: "#fff",
            border: "1px solid #ede8e3",
            borderRadius: "18px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c0a090",
              padding: "6px 10px 8px",
              margin: 0,
            }}
          >
            Topics
          </p>
          {FAQ_CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: active ? "rgba(184,112,74,0.1)" : "transparent",
                  color: active ? "#b8704a" : "#7a6a62",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  width: "100%",
                }}
                onMouseOver={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#fdf9f7";
                }}
                onMouseOut={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <Icon style={{ width: "15px", height: "15px", flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* FAQ accordion */}
        <div>
          {/* Category heading */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            {(() => {
              const Icon = current.icon;
              return (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(184,112,74,0.1)",
                    border: "1px solid rgba(184,112,74,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                </div>
              );
            })()}
            <div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: "#2d1f1a",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {current.label}
              </h2>
              <p style={{ fontSize: "0.78rem", color: "#c0a090", margin: 0 }}>
                {current.faqs.length} questions
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {current.faqs.map((faq, i) => (
              <AccordionItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Still need help? ── */}
      <section
        style={{
          backgroundColor: "#fff",
          borderTop: "1px solid #ede8e3",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "rgba(184,112,74,0.1)",
              border: "1px solid rgba(184,112,74,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <MessageCircle style={{ width: "24px", height: "24px", color: "#b8704a" }} />
          </div>

          <h2
            style={{
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#2d1f1a",
              letterSpacing: "-0.025em",
              marginBottom: "12px",
              marginTop: 0,
            }}
          >
            Still Have a Question?
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#7a6a62",
              lineHeight: 1.75,
              marginBottom: "32px",
              marginTop: 0,
            }}
          >
            Our team typically replies within 24 hours. You can also reach us instantly on WhatsApp — we&apos;re always happy to help.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#25d366",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "13px 28px",
                borderRadius: "999px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <MessageCircle style={{ width: "17px", height: "17px" }} /> Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "transparent",
                color: "#2d1f1a",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "13px 28px",
                borderRadius: "999px",
                textDecoration: "none",
                border: "1px solid #ede8e3",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#b8704a";
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#ede8e3";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .faq-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
