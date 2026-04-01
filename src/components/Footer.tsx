"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Share2, MessageCircle, Send, Video } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact Us", href: "/contact" },
  ],
  categories: [
    { label: "Moccasin", href: "/categories/moccasin" },
    { label: "Women Shoes", href: "/categories/women-shoes" },
    { label: "Court Shoes", href: "/categories/court-shoes" },
    { label: "Heels", href: "/categories/heels" },
    { label: "Pumps", href: "/categories/pumps" },
    { label: "Flats", href: "/categories/flats" },
    { label: "Sandals", href: "/categories/sandals" },
  ],
  support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Your Order", href: "/track" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Share2, label: "Instagram", href: "#" },
  { icon: MessageCircle, label: "Facebook", href: "#" },
  { icon: Send, label: "Twitter / X", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-brand-900 text-brand-300">
      {/* Promo Banner */}
      <div className="border-b border-brand-800 py-3.5 px-6 flex items-center justify-center gap-6 flex-wrap bg-brand-800">
        <p className="text-sm text-brand-50 font-medium m-0">
          🚚 Free shipping on orders over{" "}
          <span className="font-bold">Rs. 5,000</span> — Use code{" "}
          <span className="font-bold tracking-wide text-brand-200">STEPFREE</span>
        </p>
        <Link
          href="/categories"
          className="text-xs font-bold tracking-wider uppercase text-brand-900 no-underline border border-brand-50 rounded-full py-1.5 px-4.5 bg-brand-50 transition-colors duration-150 hover:bg-brand-100"
        >
          Shop Now →
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-50 text-xs font-black tracking-tight">SW</span>
            </div>
            <span className="text-lg font-black tracking-tight text-brand-50">Step Wears</span>
          </Link>

          <p className="text-sm text-brand-400 leading-relaxed max-w-56 m-0">
            Premium ladies&apos; footwear crafted for elegance and comfort. Walk with confidence, every single day.
          </p>

          <div className="flex flex-col gap-2.5">
            {[
              { icon: Mail, label: "support@stepwears.online", href: "mailto:support@stepwears.online" },
              { icon: Phone, label: "+92 339 0912145", href: "tel:+923390912145" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 text-sm text-brand-400 no-underline hover:text-brand-300 transition-colors duration-150"
              >
                <Icon className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                {label}
              </a>
            ))}
            <div className="flex items-start gap-2 text-sm text-brand-400">
              <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
              Lahore, Punjab, Pakistan
            </div>
          </div>

          <div className="flex gap-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8.5 h-8.5 rounded-full border border-brand-800 flex items-center justify-center text-brand-400 transition-all duration-150 hover:border-brand-500 hover:text-brand-500 no-underline"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links columns */}
        {[
          { title: "Company", links: footerLinks.company },
          { title: "Categories", links: footerLinks.categories },
        ].map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-xs font-bold tracking-widest uppercase text-brand-200 mb-5 mt-0">
              {title}
            </h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-400 no-underline transition-colors duration-150 hover:text-brand-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support + Newsletter */}
        <div className="flex flex-col gap-10">
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-brand-200 mb-5 mt-0">
              Support
            </h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-400 no-underline transition-colors duration-150 hover:text-brand-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-brand-200 mb-3 mt-0">
              Newsletter
            </h3>
            <p className="text-xs text-brand-400 mb-3 leading-relaxed mt-0">
              Exclusive offers & new arrivals straight to your inbox.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 py-2.5 px-3.5 rounded-lg border border-brand-800 bg-brand-800 text-sm text-brand-50 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="py-2.5 px-4 rounded-lg bg-brand-500 text-brand-50 text-sm font-bold cursor-pointer flex-shrink-0 transition-opacity duration-150 hover:opacity-80"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-800">
        <div className="max-w-7xl mx-auto py-4.5 px-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-brand-700 m-0">
            © {new Date().getFullYear()} Step Wears. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sitemap", href: "/sitemap" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-brand-700 no-underline transition-colors duration-150 hover:text-brand-500"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
