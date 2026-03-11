import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
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
    url: "https://kronusinfra.com",
    images: [
      {
        url: "https://kronusinfra.com/og-image.png",
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
      <head>
        <title>Kronus Infratech & Consultants</title>
        <meta name="description" content="An address that outlives time — crafted for legacy in Sonipat." />

        <meta property="og:url" content="https://www.kronusinfra.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kronus Infratech & Consultants/" />
        <meta property="og:description" content="An address that outlives time — crafted for legacy in Sonipat." />
        <meta property="og:image" content="https://kronusinfra.com/og-image.png" />
        <meta property="og:logo" content="https://kronusinfra.com/logo.png" />
        
        <meta name="apple-mobile-web-app-title" content="Kronus" />
      
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="kronusinfra.com" />
        <meta property="twitter:url" content="https://www.kronusinfra.com/" />
        <meta name="twitter:title" content="Kronus Infratech & Consultants" />
        <meta name="twitter:description" content="An address that outlives time — crafted for legacy in Sonipat." />
        <meta name="twitter:image" content="https://kronusinfra.com/og-image.png" />

      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
