import Link from "next/link";
import { Shield, Eye, Lock, Database, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Step Wears",
  description: "How Step Wears collects, uses, and protects your personal information.",
};

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: `When you place an order, create an account, or contact us, we collect:
• Your name, email address, and phone number
• Delivery address and order details
• Payment method details (processed securely — we never store card numbers)
• Device and browsing data when you visit our website (via cookies)`,
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: `We use your information to:
• Process and fulfil your orders
• Send order confirmations, shipping updates, and delivery notifications
• Respond to your enquiries and provide customer support
• Improve our website, products, and services
• Send marketing emails (only if you have opted in)`,
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content: `Your personal data is protected by:
• SSL encryption on all pages of our website
• Secure payment processing via industry-standard payment gateways
• Restricted access — only authorised staff can access customer data
• We never sell your information to third parties`,
  },
  {
    icon: Mail,
    title: "Marketing Communications",
    content: `We will only send you promotional emails if you have opted in. You can unsubscribe at any time by clicking the "Unsubscribe" link at the bottom of any email, or by contacting us at support@stepwears.online.`,
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: `You have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data (subject to legal obligations)
• Withdraw consent for marketing at any time
To exercise any of these rights, contact us at support@stepwears.online.`,
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>

      <div style={{ backgroundColor: "#2d1f1a", padding: "60px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", padding: "5px 16px", borderRadius: "999px",
          border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", marginBottom: "16px",
        }}>Legal</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#f2e8e1", letterSpacing: "-0.025em", marginTop: 0, marginBottom: "12px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          Last updated: March 2025. We are committed to protecting your privacy.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "11px",
                backgroundColor: "rgba(184,112,74,0.1)", border: "1px solid rgba(184,112,74,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: 0 }}>{title}</h2>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>{content}</p>
          </div>
        ))}

        <div style={{ backgroundColor: "rgba(184,112,74,0.06)", border: "1px solid rgba(184,112,74,0.2)", borderRadius: "18px", padding: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "#7a6a62", margin: "0 0 12px", lineHeight: 1.7 }}>
            Questions about this policy? We&apos;re happy to help.
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
