import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Step Wears — Premium Ladies' Footwear",
  description:
    "Discover Step Wears's handpicked collection of ladies' footwear — from timeless moccasins to statement heels. Crafted for elegance, built for comfort.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId="GTM-5BSNJ69M" />
      <GoogleAnalytics gaId="G-ETBHJ5HF4F" />
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8467889658250907"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col pt-16">
        <NextTopLoader color="#2299DD" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} showSpinner={false} easing="ease" speed={200} shadow="0 0 10px #2299DD,0 0 5px #2299DD" />
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
