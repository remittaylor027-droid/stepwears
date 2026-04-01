import Link from "next/link";
import { Truck, Clock, MapPin, Package, AlertCircle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Shipping Policy — Step Wears",
  description: "Learn about Step Wears's shipping rates, delivery times, and coverage across Pakistan.",
};

const sections = [
  {
    icon: Truck,
    title: "Delivery Coverage",
    items: [
      "We deliver across all major cities and towns in Pakistan.",
      "Same-city delivery available in Lahore, Karachi, Islamabad, and Rawalpindi.",
      "Remote areas may require 1–2 additional business days.",
    ],
  },
  {
    icon: Clock,
    title: "Delivery Timeframes",
    items: [
      "Standard delivery: 3–5 business days.",
      "Express delivery (major cities): 1–2 business days.",
      "Custom / handcrafted orders: 7–14 business days after confirmation.",
      "Orders placed after 3 PM are processed the next business day.",
    ],
  },
  {
    icon: Package,
    title: "Shipping Rates",
    items: [
      "Free shipping on all orders over Rs. 5,000.",
      "Standard shipping: Rs. 250 for orders under Rs. 5,000.",
      "Express shipping: Rs. 450 (available in major cities).",
      "Use code STEPFREE to unlock free shipping on eligible orders.",
    ],
  },
  {
    icon: MapPin,
    title: "Order Tracking",
    items: [
      "A tracking number is sent via SMS/email once your order ships.",
      "Visit our Track Order page to get live status updates.",
      "Courier partner: TCS / Leopards / Trax (assigned at dispatch).",
    ],
  },
  {
    icon: AlertCircle,
    title: "Important Notes",
    items: [
      "We are not responsible for delays caused by the courier after dispatch.",
      "Ensure your delivery address and phone number are correct at checkout.",
      "In case of a failed delivery attempt, the courier will try again the next day.",
      "Unclaimed parcels after 3 attempts are returned to us — a re-delivery fee may apply.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>
      {/* Hero */}
      <div
        style={{
          backgroundColor: "#2d1f1a",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#b8704a",
            padding: "5px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(184,112,74,0.3)",
            backgroundColor: "rgba(184,112,74,0.1)",
            marginBottom: "16px",
          }}
        >
          Policies
        </span>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 900,
            color: "#f2e8e1",
            letterSpacing: "-0.025em",
            marginTop: 0,
            marginBottom: "12px",
          }}
        >
          Shipping Policy
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
          Fast, reliable delivery across Pakistan. Here&apos;s everything you need to know.
        </p>
      </div>

      {/* Free shipping banner */}
      <div
        style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "14px",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxWidth: "800px",
          margin: "32px auto 0",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <CheckCircle style={{ width: "18px", height: "18px", color: "#16a34a", flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534", fontWeight: 600 }}>
          🎉 Free shipping on all orders over <strong>Rs. 5,000</strong> — no code needed above threshold!
        </p>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sections.map(({ icon: Icon, title, items }) => (
            <div
              key={title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ede8e3",
                borderRadius: "18px",
                padding: "28px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "11px",
                    backgroundColor: "rgba(184,112,74,0.1)",
                    border: "1px solid rgba(184,112,74,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                </div>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: 0 }}>{title}</h2>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map((item) => (
                  <li key={item} style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "0.9rem", color: "#7a6a62", marginBottom: "16px" }}>
            Have questions about your shipment?
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#2d1f1a",
              color: "#f2e8e1",
              fontWeight: 700,
              fontSize: "0.88rem",
              padding: "12px 28px",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
