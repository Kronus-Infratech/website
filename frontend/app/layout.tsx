import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-clash-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-satoshi",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kronus Infratech & Consultants — Luxury Real Estate in Sonipat, Haryana",
  description:
    "An address that outlives time. Kronus Infratech builds legacy homes, premium villas, commercial spaces and plots across Sonipat with unmatched craftsmanship.",
  keywords: [
    "Kronus Infratech",
    "luxury homes Sonipat",
    "premium real estate Haryana",
    "villas Sonipat",
    "plots in Sonipat",
    "commercial spaces Sonipat",
  ],
  openGraph: {
    title: "Kronus Infratech & Consultants",
    description: "An address that outlives time — crafted for legacy in Sonipat.",
    type: "website",
    locale: "en_IN",
    url: "https://kronusinfra.org",
    images: [
      {
        url: "https://kronusinfra.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kronus Infratech luxury residence exterior showcasing modern architecture in Sonipat",
      }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
