import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Step Wears",
  description: "Step Wears store admin panel",
};

// This layout completely replaces the root layout for admin pages
// — no Navbar, no Footer, no CartProvider, no pt-16 padding
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
