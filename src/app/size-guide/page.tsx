import { Ruler } from "lucide-react";

export const metadata = {
  title: "Size Guide — Step Wears",
  description: "Find your perfect fit with Step Wears's Pakistani shoe size guide and international conversion chart.",
};

const sizeChart = [
  { pk: "35", eu: "35", uk: "2.5", us: "5",   cm: "22.5" },
  { pk: "36", eu: "36", uk: "3.5", us: "6",   cm: "23.0" },
  { pk: "37", eu: "37", uk: "4",   us: "6.5", cm: "23.5" },
  { pk: "38", eu: "38", uk: "5",   us: "7.5", cm: "24.0" },
  { pk: "39", eu: "39", uk: "5.5", us: "8",   cm: "24.5" },
  { pk: "40", eu: "40", uk: "6.5", us: "9",   cm: "25.5" },
  { pk: "41", eu: "41", uk: "7",   us: "9.5", cm: "26.0" },
];

const tips = [
  "Measure your foot in the afternoon — feet naturally swell slightly throughout the day.",
  "Stand on a piece of paper and trace the outline of your foot. Measure the longest point (heel to toe).",
  "If you're between two sizes, we always recommend going a half-size up.",
  "For wide feet, consider going up one full size or choosing styles with a wider fit.",
  "All Step Wears shoes are crafted to standard Pakistani sizing.",
];

export default function SizeGuidePage() {
  return (
    <main style={{ backgroundColor: "#fdf9f7", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div style={{ backgroundColor: "#2d1f1a", padding: "60px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#b8704a", padding: "5px 16px", borderRadius: "999px",
          border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", marginBottom: "16px",
        }}>Fit Guide</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#f2e8e1", letterSpacing: "-0.025em", marginTop: 0, marginBottom: "12px" }}>
          Find Your Perfect Size
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(242,232,225,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
          Use our size chart and measuring guide to ensure the best possible fit.
        </p>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Size chart */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", overflow: "hidden", marginBottom: "32px" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #ede8e3", display: "flex", alignItems: "center", gap: "10px" }}>
            <Ruler style={{ width: "18px", height: "18px", color: "#b8704a" }} />
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: 0 }}>Size Conversion Chart</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fdf9f7" }}>
                  {["PK / EU", "EU", "UK", "US (Women)", "Foot Length (cm)"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b8704a", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, i) => (
                  <tr key={row.pk} style={{ borderTop: "1px solid #ede8e3", backgroundColor: i % 2 === 0 ? "#fff" : "#fdf9f7" }}>
                    <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 800, color: "#2d1f1a", fontSize: "0.95rem" }}>{row.pk}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", color: "#7a6a62", fontSize: "0.875rem" }}>{row.eu}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", color: "#7a6a62", fontSize: "0.875rem" }}>{row.uk}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", color: "#7a6a62", fontSize: "0.875rem" }}>{row.us}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", color: "#7a6a62", fontSize: "0.875rem" }}>{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to measure */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: "18px", padding: "28px 24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 18px" }}>How to Measure Your Foot</h2>
          <ol style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <li style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>Place a blank sheet of paper on the floor against a wall.</li>
            <li style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>Stand with your heel touching the wall and trace around your foot.</li>
            <li style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>Draw a straight line from the back of the heel to the tip of the longest toe.</li>
            <li style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>Measure this line in centimetres and match it to the chart above.</li>
          </ol>
        </div>

        {/* Tips */}
        <div style={{ backgroundColor: "rgba(184,112,74,0.06)", border: "1px solid rgba(184,112,74,0.2)", borderRadius: "18px", padding: "28px 24px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#2d1f1a", margin: "0 0 16px" }}>Sizing Tips</h2>
          <ul style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {tips.map((t) => (
              <li key={t} style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7 }}>{t}</li>
            ))}
          </ul>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#7a6a62", marginTop: "36px" }}>
          Still unsure about your size?{" "}
          <a href="/contact" style={{ color: "#b8704a", fontWeight: 700, textDecoration: "none" }}>Chat with us</a> — we&apos;re happy to help.
        </p>
      </div>
    </main>
  );
}
