import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { JsonLd, organizationFullLd, websiteLd } from "@/lib/schemas";
import "./globals.css";

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
  metadataBase: new URL("https://kronusinfra.com"),
  title: {
    default: "Kronus Infratech & Consultants — Luxury Real Estate in Sonipat, Haryana",
    template: "%s | Kronus Infratech",
  },
  description:
    "An address that outlives time. Kronus Infratech builds legacy homes, premium villas, commercial spaces and plots across Sonipat with unmatched craftsmanship.",
  keywords: [
    "Kronus Infratech",
    "luxury homes Sonipat",
    "premium real estate Haryana",
    "villas Sonipat",
    "plots in Sonipat",
    "commercial spaces Sonipat",
    "real estate developer Haryana",
    "RERA approved projects Sonipat",
    "property in Sonipat",
  ],
  authors: [{ name: "Kronus Infratech & Consultants", url: "https://kronusinfra.com" }],
  creator: "Kronus Infratech & Consultants",
  publisher: "Kronus Infratech & Consultants",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    title: "Kronus Infratech & Consultants",
    description: "An address that outlives time — crafted for legacy in Sonipat.",
    type: "website",
    locale: "en_IN",
    url: "https://kronusinfra.com",
    siteName: "Kronus Infratech",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Kronus Infratech luxury residence exterior showcasing modern architecture in Sonipat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kronus Infratech & Consultants",
    description: "An address that outlives time — crafted for legacy in Sonipat.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://kronusinfra.com" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Kronus Infratech & Consultants</title>
        <meta name="description" content="An address that outlives time — crafted for legacy in Sonipat." />

        <meta property="og:url" content="https://kronusinfra.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kronus Infratech & Consultants" />
        <meta property="og:description" content="An address that outlives time — crafted for legacy in Sonipat." />
        <meta property="og:image" content="https://kronusinfra.com/og-image.webp" />
        <meta property="og:logo" content="https://kronusinfra.com/logo.png" />

        <meta name="apple-mobile-web-app-title" content="Kronus" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="kronusinfra.com" />
        <meta property="twitter:url" content="https://kronusinfra.com/" />
        <meta name="twitter:title" content="Kronus Infratech & Consultants" />
        <meta name="twitter:description" content="An address that outlives time — crafted for legacy in Sonipat." />
        <meta name="twitter:image" content="https://kronusinfra.com/og-image.webp" />

        <JsonLd data={organizationFullLd()} />
        <JsonLd data={websiteLd()} />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
