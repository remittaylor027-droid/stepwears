import Link from "next/link";
import { RefreshCw, CheckCircle, XCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges — Step Wears",
  description: "Understand Step Wears's hassle-free return and exchange policy.",
};

const eligible = [
  "Item received within the last 7 days",
  "Unworn, with original tags and packaging",
  "Manufacturing defect or wrong item sent",
  "Incorrect size (if size guide was followed correctly)",
];

const notEligible = [
  "Worn, washed, or altered items",
  "Custom / bespoke orders (unless defective)",
  "Items purchased on final sale",
  "Missing original packaging or tags",
  "Orders older than 7 days",
];

const steps = [
  { num: "01", title: "Contact Us", desc: "Email hello@stepwear.pk or WhatsApp us within 7 days of delivery with your order number and photos of the item." },
  { num: "02", title: "Approval", desc: "Our team reviews your request within 24 hours and sends you a return authorisation." },
  { num: "03", title: "Ship It Back", desc: "Pack the item securely and send it to our Lahore warehouse. Share the tracking number with us." },
  { num: "04", title: "Resolution", desc: "Once received and inspected, we process your exchange or refund within 3–5 business days." },
];

export default function ReturnsPage() {
  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div style={{ backgroundColor: "#2d1f1a", padding: "60px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", padding: "5px 16px", borderRadius: "999px",
          border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", marginBottom: "16px",
        }}>Policies</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#f2e8e1", letterSpacing: "-0.025em", marginTop: 0, marginBottom: "12px" }}>
          Returns &amp; Exchanges
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
          Your satisfaction is our priority. We&apos;ve made returns as simple as possible.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Process steps */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2d1f1a", marginBottom: "24px", marginTop: 0 }}>
          <RefreshCw style={{ width: "18px", height: "18px", color: "#b8704a", verticalAlign: "middle", marginRight: "8px" }} />
          How It Works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "24px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "rgba(184,112,74,0.2)", lineHeight: 1, marginBottom: "10px" }}>{num}</div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "0.83rem", color: "#7a6a62", lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Eligible / Not eligible */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>

          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "18px", padding: "24px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#15803d", marginBottom: "16px", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle style={{ width: "16px", height: "16px" }} /> Eligible for Return
            </h3>
            <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {eligible.map((e) => <li key={e} style={{ fontSize: "0.82rem", color: "#166534", lineHeight: 1.6 }}>{e}</li>)}
            </ul>
          </div>

          <div style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca", borderRadius: "18px", padding: "24px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#dc2626", marginBottom: "16px", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <XCircle style={{ width: "16px", height: "16px" }} /> Not Eligible
            </h3>
            <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {notEligible.map((e) => <li key={e} style={{ fontSize: "0.82rem", color: "#991b1b", lineHeight: 1.6 }}>{e}</li>)}
            </ul>
          </div>
        </div>

        {/* Refund note */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "24px", marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 10px" }}>Refund Method</h3>
          <p style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.75, margin: 0 }}>
            Refunds are issued to the original payment method (bank transfer / Easypaisa / JazzCash) within 3–5 business days after we receive and inspect the returned item. Return shipping costs are borne by the customer unless the item was defective or incorrect.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "#2d1f1a", color: "#f2e8e1", fontWeight: 700,
            fontSize: "0.88rem", padding: "12px 28px", borderRadius: "999px", textDecoration: "none",
          }}>
            Start a Return <ArrowRight style={{ width: "15px", height: "15px" }} />
          </Link>
        </div>
      </div>
    </main>
  );
}
