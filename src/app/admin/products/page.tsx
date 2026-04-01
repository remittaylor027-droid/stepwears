"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Check, Package,
  ToggleLeft, ToggleRight, ChevronLeft, Upload, ImageIcon, Images,
} from "lucide-react";
import Link from "next/link";

// ── Types ────────────────────────────────────────
interface ColorEntry  { name: string; hex: string; image?: string }
interface SizeEntry   { size: string; stock: number }

interface Product {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image: string;
  images: string[];
  colors: ColorEntry[];
  sizes: SizeEntry[];
  is_available: boolean;
  featured: boolean;
}


const PK_SIZES   = ["35", "36", "37", "38", "39", "40", "41"];

const PRESET_COLORS: ColorEntry[] = [
  { name: "Black",       hex: "#1a1a1a" },
  { name: "White",       hex: "#f5f5f0" },
  { name: "Nude Beige",  hex: "#d4b896" },
  { name: "Blush Pink",  hex: "#f2b8b8" },
  { name: "Terracotta",  hex: "#b8704a" },
  { name: "Navy",        hex: "#1e3a5f" },
  { name: "Brown",       hex: "#6b4226" },
  { name: "Tan",         hex: "#c8a882" },
  { name: "Red",         hex: "#c0392b" },
  { name: "Sage Green",  hex: "#7a9e7e" },
  { name: "Ivory",       hex: "#fffff0" },
  { name: "Gold",        hex: "#d4af37" },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "", original_price: "",
  category: "", image: "", images: [] as string[],
  colors: [] as ColorEntry[],
  sizes: PK_SIZES.map((s) => ({ size: s, stock: 0 })) as SizeEntry[],
  is_available: true,
};

const inp: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)",
  color: "#f2e8e1", fontSize: "0.85rem", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
  textTransform: "uppercase", color: "#7a6a62", marginBottom: "6px",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState<number | null>(null);
  const [dragOver, setDragOver]   = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [modal, setModal]         = useState<"add" | "edit" | null>(null);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [newColor, setNewColor]   = useState<ColorEntry>({ name: "", hex: "#b8704a" });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  // which color index is being given an image picker
  const [colorImagePicker, setColorImagePicker] = useState<number | null>(null);

  // ── Upload helpers ───────────────────────────
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return null; }
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) { alert("Upload failed: " + (data.error ?? "Unknown error")); return null; }
    return data.url as string;
  };

  // Upload main/gallery image
  const handleGalleryUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setForm((f) => ({
        ...f,
        images: [...f.images, url],
        image:  f.image || url,   // set primary if none
      }));
    }
    setUploading(false);
  };

  // Upload image directly for a specific color
  const handleColorImageUpload = async (file: File, colorIdx: number) => {
    setUploadingColorIdx(colorIdx);
    const url = await uploadFile(file);
    if (url) {
      setForm((f) => {
        const updated = [...f.colors];
        updated[colorIdx] = { ...updated[colorIdx], image: url };
        // Also add to gallery if not already there
        const imgs = f.images.includes(url) ? f.images : [...f.images, url];
        return { ...f, colors: updated, images: imgs, image: f.image || url };
      });
      setColorImagePicker(null);
    }
    setUploadingColorIdx(colorIdx);
    setUploadingColorIdx(null);
  };

  // Assign gallery image to a color
  const assignGalleryImageToColor = (colorIdx: number, imgUrl: string) => {
    setForm((f) => {
      const updated = [...f.colors];
      updated[colorIdx] = { ...updated[colorIdx], image: imgUrl };
      return { ...f, colors: updated };
    });
    setColorImagePicker(null);
  };

  // Set primary image
  const setPrimary = (url: string) => setForm((f) => ({ ...f, image: url }));

  // Remove gallery image
  const removeGalleryImage = (url: string) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((i) => i !== url),
      image:  f.image === url ? (f.images.find((i) => i !== url) ?? "") : f.image,
      // remove from colors too
      colors: f.colors.map((c) => c.image === url ? { ...c, image: undefined } : c),
    }));
  };

  // ── Data ────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setField = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, sizes: PK_SIZES.map((s) => ({ size: s, stock: 0 })), images: [] });
    setEditId(null);
    setColorImagePicker(null);
    setModal("add");
  };

  const openEdit = (p: Product) => {
    const existingMap = Object.fromEntries(p.sizes.map((s) => [s.size, s.stock]));
    const sizes = PK_SIZES.map((s) => ({ size: s, stock: existingMap[s] ?? 0 }));
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? "",
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : "",
      category: p.category, image: p.image ?? "",
      images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
      colors: p.colors ?? [], sizes, is_available: p.is_available,
    });
    setEditId(p.id);
    setColorImagePicker(null);
    setModal("edit");
  };

  const addColor = (color: ColorEntry) => {
    if (!color.name) return;
    setField("colors", [...form.colors, { ...color }]);
    setNewColor({ name: "", hex: "#b8704a" });
  };
  const removeColor = (i: number) => {
    setColorImagePicker(null);
    setField("colors", form.colors.filter((_, idx) => idx !== i));
  };
  const setStock = (size: string, stock: number) =>
    setField("sizes", form.sizes.map((s) => s.size === size ? { ...s, stock } : s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Ensure primary image is in gallery
    const allImages = form.image && !form.images.includes(form.image)
      ? [form.image, ...form.images]
      : form.images;

    const payload = {
      name:           form.name,
      slug:           form.slug || slugify(form.name),
      description:    form.description,
      price:          Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category:       form.category,
      image:          form.image,
      images:         allImages,
      colors:         form.colors,
      sizes:          form.sizes.filter((s) => s.stock > 0 || modal === "edit"),
      is_available:   form.is_available,
    };

    const res = await fetch("/api/admin/products", {
      method: modal === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modal === "edit" ? { id: editId, ...payload } : payload),
    });
    setSaving(false);
    if (res.ok) { setModal(null); fetchProducts(); }
    else alert("Error saving product");
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setDeleting(null);
    setConfirmDelete(null);
    fetchProducts();
  };

  const toggleAvailable = async (p: Product) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, is_available: !p.is_available }),
    });
    fetchProducts();
  };

  const toggleFeatured = async (p: Product) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, featured: !p.featured }),
    });
    fetchProducts();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f0a06", fontFamily: "system-ui, sans-serif" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: "#1a1008", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7a6a62", textDecoration: "none", fontSize: "0.82rem" }}>
            <ChevronLeft style={{ width: "14px", height: "14px" }} /> Orders
          </Link>
          <span style={{ color: "#4a3a32" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Package style={{ width: "16px", height: "16px", color: "#b8704a" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f2e8e1" }}>Products</span>
          </div>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", border: "none", backgroundColor: "#b8704a", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
          <Plus style={{ width: "14px", height: "14px" }} /> Add Product
        </button>
      </div>

      <div style={{ padding: "28px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f2e8e1", margin: "0 0 4px" }}>Product Catalogue</h1>
          <p style={{ fontSize: "0.78rem", color: "#7a6a62", margin: 0 }}>{products.length} product{products.length !== 1 ? "s" : ""} in your store</p>
        </div>

        {loading ? (
          <p style={{ color: "#4a3a32", padding: "40px", textAlign: "center" }}>Loading...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <Package style={{ width: "40px", height: "40px", color: "#4a3a32", margin: "0 auto 16px" }} />
            <p style={{ color: "#7a6a62", marginBottom: "16px" }}>No products yet.</p>
            <button onClick={openAdd} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", backgroundColor: "#b8704a", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add Your First Product</button>
          </div>
        ) : (
          <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Product", "Category", "Price", "Images", "Colors", "Sizes / Stock", "Featured", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a32" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {p.image && (
                          <div style={{ width: "38px", height: "38px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "#2a1a0e" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1" }}>{p.name}</div>
                          <div style={{ fontSize: "10px", color: "#4a3a32" }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(184,112,74,0.12)", color: "#b8704a", textTransform: "capitalize" }}>{p.category}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f2e8e1" }}>Rs. {p.price.toLocaleString()}</div>
                      {p.original_price && <div style={{ fontSize: "10px", color: "#7a6a62", textDecoration: "line-through" }}>Rs. {p.original_price.toLocaleString()}</div>}
                    </td>
                    {/* Images column */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                        {(Array.isArray(p.images) ? p.images.slice(0, 4) : [p.image].filter(Boolean)).map((img, idx) => (
                          <div key={idx} style={{ width: "24px", height: "24px", borderRadius: "5px", overflow: "hidden", border: idx === 0 ? "1px solid #b8704a" : "1px solid rgba(255,255,255,0.12)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                        {Array.isArray(p.images) && p.images.length > 4 && (
                          <div style={{ width: "24px", height: "24px", borderRadius: "5px", backgroundColor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#7a6a62", fontWeight: 700 }}>+{p.images.length - 4}</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {p.colors.map((c) => (
                          <div key={c.name} title={`${c.name}${c.image ? " (has image)" : ""}`} style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: c.hex, border: c.image ? "2px solid #b8704a" : "1px solid rgba(255,255,255,0.15)", position: "relative" }}>
                            {c.image && <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#b8704a", border: "1px solid #0f0a06" }} />}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {p.sizes.filter(s => s.stock > 0).map((s) => (
                          <span key={s.size} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "5px", backgroundColor: "rgba(255,255,255,0.06)", color: "#d4c4b8" }}>{s.size}<span style={{ color: "#7a6a62" }}>×{s.stock}</span></span>
                        ))}
                        {p.sizes.every(s => s.stock === 0) && <span style={{ fontSize: "10px", color: "#f87171" }}>Out of stock</span>}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleFeatured(p)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        {p.featured
                          ? <><ToggleRight style={{ width: "20px", height: "20px", color: "#f59e0b" }} /><span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 700 }}>Featured</span></>
                          : <><ToggleLeft  style={{ width: "20px", height: "20px", color: "#4a3a32" }} /><span style={{ fontSize: "11px", color: "#4a3a32", fontWeight: 700 }}>Normal</span></>
                        }
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleAvailable(p)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        {p.is_available
                          ? <><ToggleRight style={{ width: "20px", height: "20px", color: "#22c55e" }} /><span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>Live</span></>
                          : <><ToggleLeft  style={{ width: "20px", height: "20px", color: "#7a6a62" }} /><span style={{ fontSize: "11px", color: "#7a6a62", fontWeight: 700 }}>Hidden</span></>
                        }
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEdit(p)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", color: "#7a6a62", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                          <Pencil style={{ width: "11px", height: "11px" }} /> Edit
                        </button>
                        <button onClick={() => setConfirmDelete(p.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(248,113,113,0.2)", backgroundColor: "transparent", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                          <Trash2 style={{ width: "11px", height: "11px" }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ Add/Edit Modal ══ */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1008", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "780px", marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#f2e8e1", margin: 0 }}>
                {modal === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#7a6a62", cursor: "pointer" }}><X style={{ width: "18px", height: "18px" }} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                {/* Name */}
                <div>
                  <label style={lbl}>Product Name *</label>
                  <input required value={form.name} onChange={(e) => { setField("name", e.target.value); setField("slug", slugify(e.target.value)); }} placeholder="e.g. Classic Moccasin" style={inp}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* Slug */}
                <div>
                  <label style={lbl}>Slug (URL)*</label>
                  <input required value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="classic-moccasin" style={inp}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* Price */}
                <div>
                  <label style={lbl}>Sale Price (Rs.) *</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="3500" style={inp}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* Original price */}
                <div>
                  <label style={lbl}>Original Price (Rs.) — for discount</label>
                  <input type="number" min="0" value={form.original_price} onChange={(e) => setField("original_price", e.target.value)} placeholder="4500" style={inp}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* Category */}
                <div>
                  <label style={lbl}>Category *</label>
                  <input required value={form.category} onChange={(e) => setField("category", e.target.value.toLowerCase())} placeholder="e.g. heels, boots, bridal" style={inp}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* ══ IMAGE GALLERY — full width ══ */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <Images style={{ width: "14px", height: "14px", color: "#b8704a" }} />
                    <label style={{ ...lbl, margin: 0 }}>Product Images — Upload Multiple</label>
                    <span style={{ fontSize: "10px", color: "#4a3a32" }}>First image = primary. Click image to set as primary.</span>
                  </div>

                  {/* Gallery grid */}
                  {form.images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                      {form.images.map((url, idx) => (
                        <div key={idx} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: url === form.image ? "2px solid #b8704a" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", aspectRatio: "1" }}
                          onClick={() => setPrimary(url)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Image ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          {url === form.image && (
                            <div style={{ position: "absolute", top: "4px", left: "4px", backgroundColor: "#b8704a", color: "#fff", fontSize: "8px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>PRIMARY</div>
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeGalleryImage(url); }} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", border: "none", backgroundColor: "rgba(239,68,68,0.8)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                            <X style={{ width: "10px", height: "10px" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setDragOver(false);
                      Array.from(e.dataTransfer.files).forEach((f) => handleGalleryUpload(f));
                    }}
                    style={{ border: `2px dashed ${dragOver ? "#b8704a" : "rgba(255,255,255,0.1)"}`, borderRadius: "14px", backgroundColor: dragOver ? "rgba(184,112,74,0.06)" : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "24px 20px", cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                      {uploading
                        ? <div style={{ fontSize: "0.85rem", color: "#b8704a", fontWeight: 700 }}>Uploading...</div>
                        : <>
                          <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(184,112,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ImageIcon style={{ width: "18px", height: "18px", color: "#b8704a" }} />
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.82rem", color: "#d4c4b8", fontWeight: 600 }}>Drag & drop or click to upload images</div>
                            <div style={{ fontSize: "10px", color: "#4a3a32", marginTop: "3px" }}>JPG, PNG, WebP — multiple allowed (no size limit)</div>
                          </div>
                        </>
                      }
                      <input type="file" accept="image/*" multiple style={{ display: "none" }} disabled={uploading}
                        onChange={(e) => Array.from(e.target.files ?? []).forEach((f) => handleGalleryUpload(f))} />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the product..." style={{ ...inp, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                {/* ══ COLORS with per-color image ══ */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Available Colors — each color can have its own image</label>

                  {/* Preset swatches */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {PRESET_COLORS.map((c) => {
                      const added = form.colors.some((fc) => fc.name === c.name);
                      return (
                        <button key={c.name} type="button" title={c.name}
                          onClick={() => added ? removeColor(form.colors.findIndex(fc => fc.name === c.name)) : addColor(c)}
                          style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: c.hex, border: added ? "3px solid #b8704a" : "2px solid rgba(255,255,255,0.15)", cursor: "pointer", position: "relative" }}>
                          {added && <Check style={{ position: "absolute", inset: 0, margin: "auto", width: "12px", height: "12px", color: c.hex === "#f5f5f0" || c.hex === "#fffff0" ? "#333" : "#fff" }} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom color */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="color" value={newColor.hex} onChange={(e) => setNewColor((n) => ({ ...n, hex: e.target.value }))} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "transparent", cursor: "pointer", padding: "2px" }} />
                    <input value={newColor.name} onChange={(e) => setNewColor((n) => ({ ...n, name: e.target.value }))} placeholder="Custom color name" style={{ ...inp, flex: 1 }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                    <button type="button" onClick={() => addColor(newColor)} style={{ padding: "9px 14px", borderRadius: "10px", border: "none", backgroundColor: "rgba(184,112,74,0.2)", color: "#b8704a", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "inherit", flexShrink: 0 }}>
                      + Add
                    </button>
                  </div>

                  {/* Selected colors with image pickers */}
                  {form.colors.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                      {form.colors.map((c, i) => (
                        <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            {/* Color swatch */}
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: c.hex, border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2e8e1", flex: 1 }}>{c.name}</span>

                            {/* Image preview if assigned */}
                            {c.image && (
                              <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "2px solid #b8704a", flexShrink: 0 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}

                            {/* Assign image button */}
                            <button type="button" onClick={() => setColorImagePicker(colorImagePicker === i ? null : i)}
                              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(184,112,74,0.3)", backgroundColor: "rgba(184,112,74,0.1)", color: "#b8704a", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                              <Upload style={{ width: "11px", height: "11px" }} />
                              {c.image ? "Change Image" : "Assign Image"}
                            </button>

                            {/* Remove color */}
                            <button type="button" onClick={() => removeColor(i)} style={{ background: "none", border: "none", color: "#7a6a62", cursor: "pointer", padding: "4px" }}>
                              <X style={{ width: "14px", height: "14px" }} />
                            </button>
                          </div>

                          {/* Image picker panel for this color */}
                          {colorImagePicker === i && (
                            <div style={{ marginTop: "10px", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <p style={{ ...lbl, marginBottom: "10px" }}>Choose from gallery or upload new:</p>

                              {/* Gallery picks */}
                              {form.images.length > 0 && (
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                                  {form.images.map((url, gi) => (
                                    <button key={gi} type="button" onClick={() => assignGalleryImageToColor(i, url)}
                                      style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", border: c.image === url ? "2px solid #b8704a" : "1px solid rgba(255,255,255,0.15)", cursor: "pointer", padding: 0, position: "relative" }}>
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                      {c.image === url && <Check style={{ position: "absolute", inset: 0, margin: "auto", width: "16px", height: "16px", color: "#fff", filter: "drop-shadow(0 1px 2px #000)" }} />}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Upload new specifically for this color */}
                              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.15)", color: "#7a6a62", fontSize: "11px", cursor: uploadingColorIdx === i ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                                <Upload style={{ width: "11px", height: "11px" }} />
                                {uploadingColorIdx === i ? "Uploading..." : "Upload new image for this colour"}
                                <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploadingColorIdx === i}
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleColorImageUpload(f, i); }} />
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes & stock */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Pakistani Sizes & Stock</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
                    {form.sizes.map((s) => (
                      <div key={s.size} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: s.stock > 0 ? "#b8704a" : "#4a3a32", marginBottom: "6px" }}>Sz {s.size}</div>
                        <input type="number" min="0" max="999" value={s.stock}
                          onChange={(e) => setStock(s.size, Number(e.target.value))}
                          style={{ ...inp, textAlign: "center", padding: "8px 4px" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#b8704a")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                        <div style={{ fontSize: "9px", color: "#4a3a32", marginTop: "4px" }}>{s.stock > 0 ? `${s.stock} left` : "out"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available toggle */}
                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px" }}>
                  <button type="button" onClick={() => setField("is_available", !form.is_available)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                    {form.is_available ? <ToggleRight style={{ width: "28px", height: "28px", color: "#22c55e" }} /> : <ToggleLeft style={{ width: "28px", height: "28px", color: "#7a6a62" }} />}
                  </button>
                  <span style={{ fontSize: "0.85rem", color: form.is_available ? "#22c55e" : "#7a6a62", fontWeight: 600 }}>
                    {form.is_available ? "Live on store" : "Hidden from store"}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModal(null)} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent", color: "#7a6a62", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", backgroundColor: saving ? "#7a6a62" : "#b8704a", color: "#fff", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  {saving ? "Saving..." : modal === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1008", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "16px", padding: "28px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
            <Trash2 style={{ width: "32px", height: "32px", color: "#f87171", margin: "0 auto 16px" }} />
            <h3 style={{ color: "#f2e8e1", margin: "0 0 8px", fontSize: "1rem", fontWeight: 800 }}>Delete Product?</h3>
            <p style={{ color: "#7a6a62", fontSize: "0.82rem", margin: "0 0 24px" }}>This cannot be undone. The product will be permanently removed.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "9px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent", color: "#7a6a62", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={!!deleting} style={{ padding: "9px 20px", borderRadius: "10px", border: "none", backgroundColor: "#f87171", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
