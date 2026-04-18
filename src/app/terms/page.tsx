import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — Step Wears",
  description: "Read the terms and conditions governing your use of the Step Wears website and services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Step Wears website (stepwear.pk) and placing orders, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.`,
  },
  {
    title: "2. Products & Pricing",
    content: `All products are subject to availability. Prices are displayed in Pakistani Rupees (PKR) and are inclusive of any applicable taxes. Step Wears reserves the right to modify prices at any time. Orders are charged at the price displayed at the time of purchase.`,
  },
  {
    title: "3. Order Acceptance",
    content: `Placing an order on our website constitutes an offer to purchase. Step Wears reserves the right to accept or decline any order. You will receive an email confirmation once your order is accepted. An order is only complete when it has been dispatched.`,
  },
  {
    title: "4. Payment",
    content: `We accept payment via bank transfer, Easypaisa, JazzCash, and cash on delivery (COD) in select areas. All payments must be completed before dispatch. COD orders must be paid in full upon delivery.`,
  },
  {
    title: "5. Shipping & Delivery",
    content: `Delivery timelines are estimates and are not guaranteed. Step Wears is not liable for delays caused by couriers or external circumstances beyond our control. Please refer to our Shipping Policy for full details.`,
  },
  {
    title: "6. Returns & Refunds",
    content: `Returns are accepted within 7 days of delivery for eligible items in original condition. Custom orders are non-refundable unless defective. Please refer to our Returns & Exchanges policy for full details.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on the Step Wears website — including images, logos, text, and design — is the property of Step Wears and may not be reproduced, distributed, or used without our express written permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Step Wears shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the specific order in question.`,
  },
  {
    title: "9. Privacy",
    content: `Your personal data is handled in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your data as described therein.`,
  },
  {
    title: "10. Changes to Terms",
    content: `Step Wears reserves the right to update these Terms & Conditions at any time. Continued use of our website following any changes constitutes acceptance of the new terms. The date of the most recent revision is shown above.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms & Conditions are governed by the laws of Pakistan. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Lahore, Punjab, Pakistan.`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>

      <div style={{ backgroundColor: "#2d1f1a", padding: "60px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", padding: "5px 16px", borderRadius: "999px",
          border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", marginBottom: "16px",
        }}>Legal</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#f2e8e1", letterSpacing: "-0.025em", marginTop: 0, marginBottom: "12px" }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          Last updated: March 2025. Please read these terms carefully before using our services.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Icon header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <FileText style={{ width: "20px", height: "20px", color: "#b8704a" }} />
          <p style={{ fontSize: "0.875rem", color: "#7a6a62", margin: 0, lineHeight: 1.7 }}>
            These terms constitute a legally binding agreement between you and Step Wears. By using our website or purchasing our products, you agree to the following.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {sections.map(({ title, content }, i) => (
            <div
              key={title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ede8e3",
                borderRadius: i === 0 ? "18px 18px 4px 4px" : i === sections.length - 1 ? "4px 4px 18px 18px" : "4px",
                padding: "22px 24px",
              }}
            >
              <h2 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 10px" }}>{title}</h2>
              <p style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.8, margin: 0 }}>{content}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ fontSize: "0.875rem", color: "#7a6a62", marginBottom: "16px" }}>
            Questions about our terms?
          </p>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "#2d1f1a", color: "#f2e8e1", fontWeight: 700,
            fontSize: "0.88rem", padding: "11px 24px", borderRadius: "999px", textDecoration: "none",
          }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
