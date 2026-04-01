"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Palette, Ruler, Sparkles, CheckCircle, ArrowRight, Upload, X, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Palette,
    step: "01",
    title: "Choose Your Style",
    description: "Select a base design or describe your dream shoe — color, material, heel type, and more.",
    image: "/img/cobbler-tools.png",
  },
  {
    icon: Ruler,
    step: "02",
    title: "Share Your Size",
    description: "Give us your exact measurements. We craft every pair to fit you perfectly.",
    image: "/img/cobbler-cutting.png",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "We Handcraft It",
    description: "Our artisans get to work. Allow 7–14 business days for your bespoke pair.",
    image: "/img/cobbler-stitching.png",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Delivered to You",
    description: "Your shoes arrive beautifully packaged, ready to wear from day one.",
    image: "/img/cobbler-finishing.png",
  },
];

const features = [
  "100% handcrafted by skilled artisans",
  "Premium leather, suede & fabric options",
  "Any heel height — flats to stilettos",
  "Custom embroidery & embellishments",
  "Perfect fit guaranteed or remade free",
  "All sizes including wide fit",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  borderRadius: "12px",
  border: "1px solid #e8d8ce",
  backgroundColor: "#fdf9f7",
  fontSize: "0.875rem",
  color: "#2d1f1a",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
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

export default function HireMePage() {
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    size: "", color: "", details: "",
  });
  // Multi-image: store { file, preview } pairs
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const addFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImages((prev) => [...prev, { file, preview: reader.result as string }]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const WHATSAPP_NUMBER = "923390912145"; // ← update with real number
  const whatsappMsg = encodeURIComponent(
    `Hi Step Wears! I'd like to place a custom shoe order.\nName: ${form.name}\nSize: ${form.size}\nColor: ${form.color}\nDetails: ${form.details}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      // Upload all reference images in parallel
      const uploadedUrls: string[] = [];
      await Promise.all(
        images.map(async ({ file }) => {
          const fd = new FormData();
          fd.append("file", file);
          const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok && data.url) uploadedUrls.push(data.url);
        })
      );

      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:              form.name,
          email:             form.email,
          phone:             form.phone,
          shoe_size:         form.size,
          color:             form.color,
          details:           form.details,
          reference_image:   uploadedUrls[0] ?? null,   // backward compat
          reference_images:  uploadedUrls,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: "#fdf9f7", minHeight: "100vh" }}>

      {/* ══ HERO — text left | cobbler image right ══════════ */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #ede8e3" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }} className="hm-split">

          {/* Text */}
          <div style={{
            padding: "104px 56px 88px 32px",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }} className="hm-pad">

            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#b8704a", marginBottom: "20px",
            }}>
              Bespoke Footwear
            </span>

            <h1 style={{
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", fontWeight: 900,
              lineHeight: 1.08, letterSpacing: "-0.03em", color: "#2d1f1a",
              marginBottom: "20px", marginTop: 0,
            }}>
              Your Dream Shoes,<br />
              <span style={{ color: "#b8704a" }}>Handcrafted for You.</span>
            </h1>

            <p style={{
              fontSize: "1rem", color: "#7a6a62", lineHeight: 1.85,
              maxWidth: "420px", marginBottom: "36px", marginTop: 0,
            }}>
              Can&apos;t find the perfect pair? Describe your vision to our master
              cobblers — your style, your size, your story, crafted by expert hands.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="#order-form" id="hire-hero-cta" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                backgroundColor: "#2d1f1a", color: "#f2e8e1",
                fontWeight: 700, fontSize: "0.9rem",
                padding: "13px 28px", borderRadius: "999px",
                textDecoration: "none", transition: "opacity 0.2s",
              }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Start Custom Order <ArrowRight style={{ width: "15px", height: "15px" }} />
              </a>

              <a href="#how-it-works" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                color: "#7a6a62", fontSize: "0.9rem", fontWeight: 600,
                padding: "13px 28px", borderRadius: "999px",
                textDecoration: "none", border: "1px solid #e8d8ce",
                transition: "all 0.2s",
              }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#b8704a";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#f2e8e1";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e8d8ce";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: "32px", marginTop: "48px",
              paddingTop: "32px", borderTop: "1px solid #ede8e3",
            }}>
              {[["7–14", "Days Crafting"], ["100%", "Fit Guaranteed"], ["12K+", "Happy Customers"]].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d1f1a", lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: "0.62rem", color: "#c0a090", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "5px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image — cobbler at workbench */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "560px" }} className="hm-img-block">
            <Image
              src="/img/cobbler-hero.png"
              alt="Master cobbler handcrafting a pair of women's shoes"
              fill className="object-cover" priority sizes="50vw"
            />
            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(45,31,26,0.45) 0%, transparent 50%)",
            }} />
            {/* Floating badge */}
            <div style={{
              position: "absolute", bottom: "32px", left: "32px",
              backgroundColor: "rgba(253,249,247,0.92)",
              backdropFilter: "blur(8px)", borderRadius: "16px",
              padding: "16px 22px", border: "1px solid rgba(232,216,206,0.7)",
            }}>
              <div style={{ fontSize: "0.7rem", color: "#b8704a", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Master Artisans
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2d1f1a", marginTop: "3px" }}>
                Crafting Since 2010 ✦
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES — cobbler-stitching left | bullets right ═ */}
      <section style={{ background: "#ffffff", borderTop: "1px solid #ede8e3" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }} className="hm-split">

          {/* Image */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "500px" }} className="hm-img-block">
            <Image
              src="/img/cobbler-stitching.png"
              alt="Cobbler stitching leather shoe by hand"
              fill className="object-cover" sizes="50vw"
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(45,31,26,0.2) 0%, transparent 55%)",
            }} />
          </div>

          {/* Features */}
          <div style={{ padding: "64px 32px 64px 56px" }} className="hm-pad-r">
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8704a", marginBottom: "10px", marginTop: 0 }}>
              Why Go Custom?
            </p>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", marginBottom: "8px", marginTop: 0 }}>
              What Makes It Special
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#7a6a62", lineHeight: 1.7, marginBottom: "32px", marginTop: 0 }}>
              Every pair is shaped by the hands of a skilled cobbler — no assembly lines, no shortcuts.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {features.map((feat) => (
                <div key={feat} style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  padding: "16px 18px", borderRadius: "14px",
                  border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                }}>
                  <span style={{
                    flexShrink: 0, marginTop: "5px",
                    width: "7px", height: "7px", borderRadius: "50%",
                    backgroundColor: "#b8704a",
                  }} />
                  <p style={{ fontSize: "0.875rem", color: "#4a2a18", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS — 4 steps with image cards ════════ */}
      <section id="how-it-works" style={{ padding: "88px 24px", borderTop: "1px solid #ede8e3", background: "#fdf9f7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8704a", marginBottom: "10px", marginTop: 0 }}>
            The Process
          </p>
          <h2 style={{ textAlign: "center", fontSize: "1.9rem", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", marginBottom: "12px", marginTop: 0 }}>
            How It Works
          </h2>
          <p style={{ textAlign: "center", fontSize: "0.95rem", color: "#7a6a62", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 56px" }}>
            From first sketch to final polish — here&apos;s how our cobblers bring your vision to life.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="hm-steps">
            {steps.map(({ icon: Icon, step, title, description, image }) => (
              <div key={step} style={{
                borderRadius: "20px", overflow: "hidden",
                border: "1px solid #ede8e3", backgroundColor: "#ffffff",
                display: "flex", flexDirection: "column",
              }}>
                {/* Step image */}
                <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden" }}>
                  <Image src={image} alt={title} fill className="object-cover hm-step-img" sizes="25vw" />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(45,31,26,0.6) 0%, transparent 55%)",
                  }} />
                  {/* Step number chip */}
                  <div style={{
                    position: "absolute", top: "14px", left: "14px",
                    backgroundColor: "#b8704a", color: "#fdf9f7",
                    fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em",
                    textTransform: "uppercase", padding: "4px 10px", borderRadius: "999px",
                  }}>
                    Step {step}
                  </div>
                </div>

                {/* Text */}
                <div style={{ padding: "22px 20px 24px", flex: 1 }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "11px",
                    border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "14px",
                  }}>
                    <Icon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2d1f1a", marginBottom: "8px", marginTop: 0 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#7a6a62", lineHeight: 1.7, margin: 0 }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOOLS BANNER — full-width flat lay ══════════════ */}
      <section style={{ position: "relative", height: "320px", overflow: "hidden" }}>
        <Image
          src="/img/cobbler-tools.png"
          alt="Artisan cobbler tools flat lay"
          fill className="object-cover" sizes="100vw"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(45,31,26,0.75) 0%, rgba(45,31,26,0.3) 60%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 64px", maxWidth: "620px",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c0a090", marginBottom: "12px", marginTop: 0 }}>
            Premium Materials
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: "#f2e8e1", lineHeight: 1.15, marginBottom: "16px", marginTop: 0 }}>
            Tools of the Trade,<br />Passed Through Generations.
          </h2>
          <a href="#order-form" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "#b8704a", color: "#fdf9f7",
            fontWeight: 700, fontSize: "0.85rem", padding: "11px 24px",
            borderRadius: "999px", textDecoration: "none", width: "fit-content",
            transition: "opacity 0.2s",
          }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Order Your Pair <ArrowRight style={{ width: "14px", height: "14px" }} />
          </a>
        </div>
      </section>

      {/* ══ ORDER FORM — form left | cobbler-cutting right ══ */}
      <section id="order-form" style={{ borderTop: "1px solid #ede8e3", background: "#ffffff" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }} className="hm-split">

          {/* Form */}
          <div style={{ padding: "72px 56px 72px 32px" }} className="hm-pad">
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#b8704a", marginBottom: "10px", marginTop: 0 }}>
              Get Started
            </p>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#2d1f1a", letterSpacing: "-0.02em", marginBottom: "8px", marginTop: 0 }}>
              Place Your Custom Order
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#7a6a62", marginBottom: "36px", lineHeight: 1.7, marginTop: 0 }}>
              Fill in your preferences and our cobblers will get back to you within 24 hours.
            </p>

            <div style={{ height: "1px", backgroundColor: "#ede8e3", marginBottom: "32px" }} />

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  border: "1px solid #ede8e3", backgroundColor: "#fdf9f7",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                }}>
                  <CheckCircle style={{ width: "26px", height: "26px", color: "#b8704a" }} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2d1f1a", marginBottom: "10px", marginTop: 0 }}>
                  Order Request Received!
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#7a6a62", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
                  Thank you, <span style={{ color: "#2d1f1a", fontWeight: 600 }}>{form.name}</span>! We&apos;ll reach out to{" "}
                  <span style={{ color: "#2d1f1a", fontWeight: 600 }}>{form.email}</span> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="hire-form">
                {/* Basic fields — 2 columns */}
                {[
                  { name: "name",  label: "Full Name *",       type: "text",  required: true,  placeholder: "e.g. Ayesha Khan" },
                  { name: "email", label: "Email *",           type: "email", required: true,  placeholder: "your@email.com" },
                  { name: "phone", label: "Phone",             type: "tel",   required: false, placeholder: "+92 300 0000000" },
                  { name: "size",  label: "Shoe Size *",       type: "text",  required: true,  placeholder: "e.g. 36, 37, 38" },
                  { name: "color", label: "Preferred Color",   type: "text",  required: false, placeholder: "e.g. Nude, Black, Rose Gold" },
                ].map(({ name, label, type, required, placeholder }) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type} name={name} required={required}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange} placeholder={placeholder}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                    />
                  </div>
                ))}

                {/* ── Multi-image uploader ── */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Reference Images (optional — add as many as you like)</label>

                  {/* Thumbnail grid */}
                  {images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", marginBottom: "12px" }}>
                      {images.map(({ preview, file }, idx) => (
                        <div key={idx} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #e8d8ce", aspectRatio: "1" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          {/* Remove */}
                          <button type="button" onClick={() => removeImage(idx)} style={{ position: "absolute", top: "5px", right: "5px", width: "22px", height: "22px", borderRadius: "50%", border: "none", backgroundColor: "rgba(45,31,26,0.8)", color: "#f2e8e1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                            <X style={{ width: "11px", height: "11px" }} />
                          </button>
                          {/* File name tooltip */}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(45,31,26,0.65)", backdropFilter: "blur(4px)", padding: "3px 6px", fontSize: "9px", color: "#f2e8e1", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop zone — always visible so they can keep adding */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${dragOver ? "#b8704a" : "#e8d8ce"}`,
                      borderRadius: "14px", padding: "28px 24px", textAlign: "center",
                      cursor: "pointer", backgroundColor: dragOver ? "#f2e8e1" : "#fdf9f7",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", border: "1px solid #e8d8ce", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                      <Upload style={{ width: "17px", height: "17px", color: "#b8704a" }} />
                    </div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4a2a18", margin: "0 0 4px" }}>
                      {images.length === 0 ? "Upload reference images" : `${images.length} image${images.length > 1 ? "s" : ""} added — click or drop to add more`}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#c0a090", margin: 0 }}>
                      Drag & drop or <span style={{ color: "#b8704a", textDecoration: "underline" }}>click to browse</span> — JPG, PNG, WEBP — max 10MB each
                    </p>
                  </div>

                  {/* Hidden multi-file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Describe Your Dream Shoe *</label>
                  <textarea
                    name="details" required value={form.details}
                    onChange={handleChange} rows={4}
                    placeholder="Describe the design, material, heel height, occasion — anything you have in mind!"
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d8ce")}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ height: "1px", backgroundColor: "#ede8e3", marginBottom: "20px" }} />

                  {/* Submit button */}
                  <button type="submit" id="hire-submit-btn" disabled={submitting} style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px", padding: "14px",
                    borderRadius: "14px", border: "none",
                    backgroundColor: submitting ? "#7a6a62" : "#2d1f1a",
                    color: "#f2e8e1", fontWeight: 700, fontSize: "0.9rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em", transition: "opacity 0.2s",
                    marginBottom: "12px",
                  }}
                    onMouseOver={(e) => !submitting && ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    {submitting ? "Submitting..." : "Submit Custom Order Request"}
                    {!submitting && <ArrowRight style={{ width: "15px", height: "15px" }} />}
                  </button>

                  {submitError && (
                    <p style={{ fontSize: "0.82rem", color: "#c0392b", textAlign: "center", margin: "0 0 12px" }}>{submitError}</p>
                  )}

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
                    <span style={{ fontSize: "0.72rem", color: "#c0a090", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#ede8e3" }} />
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="hire-whatsapp-btn"
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "10px", padding: "13px",
                      borderRadius: "14px", border: "1.5px solid #25d366",
                      backgroundColor: "#f0fdf4",
                      color: "#166534", fontWeight: 700, fontSize: "0.9rem",
                      textDecoration: "none", cursor: "pointer",
                      transition: "background-color 0.2s, border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#25d366";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4";
                      (e.currentTarget as HTMLElement).style.color = "#166534";
                    }}
                  >
                    <MessageCircle style={{ width: "18px", height: "18px" }} />
                    Chat on WhatsApp Instead
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right — cobbler-cutting + cobbler-finishing stacked */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", overflow: "hidden" }} className="hm-img-block">
            <div style={{ position: "relative" }}>
              <Image
                src="/img/cobbler-cutting.png"
                alt="Cobbler measuring and cutting leather"
                fill className="object-cover" sizes="50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(45,31,26,0.08)" }} />
            </div>
            <div style={{ position: "relative", borderTop: "4px solid #fdf9f7" }}>
              <Image
                src="/img/cobbler-finishing.png"
                alt="Cobbler polishing finished shoe"
                fill className="object-cover" sizes="50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(45,31,26,0.08)" }} />
              {/* Badge */}
              <div style={{
                position: "absolute", bottom: "28px", right: "28px",
                backgroundColor: "#2d1f1a", borderRadius: "14px",
                padding: "14px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f2e8e1", lineHeight: 1 }}>24h</div>
                <div style={{ fontSize: "0.6rem", color: "#c0a090", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>
                  Response Time
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating WhatsApp button ─────────────────────── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 100,
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#25d366",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          textDecoration: "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          animation: "waPulse 2.5s ease-in-out infinite",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
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
        @media (max-width: 900px) {
          .hm-split { grid-template-columns: 1fr !important; }
          .hm-pad { padding: 48px 20px !important; }
          .hm-pad-r { padding: 48px 20px !important; }
          .hm-img-block { min-height: 300px !important; }
          .hm-steps { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .hm-steps { grid-template-columns: 1fr !important; }
          .hire-form { grid-template-columns: 1fr !important; }
        }
        .hm-step-img { transition: transform 0.5s ease; }
        .hm-step-img:hover { transform: scale(1.05); }
      `}</style>
    </main>
  );
}
