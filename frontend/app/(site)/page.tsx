import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import FeaturedProperties from "./components/FeaturedProperties";
import StatsSection from "./components/StatsSection";
import PropertyTypes from "./components/PropertyTypes";
import AboutSection from "./components/AboutSection";
import CTASection from "./components/CTASection";
import { JsonLd, realEstateAgentLd, breadcrumbLd } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Luxury Real Estate in Sonipat, Haryana | Kronus Infratech & Consultants",
  description:
    "An address that outlives time. Explore premium villas, luxury homes, commercial spaces, plots and penthouses in Sonipat by Kronus Infratech — RERA approved, 500+ families served since 2014.",
  keywords: [
    "luxury homes Sonipat",
    "premium real estate Haryana",
    "Kronus Infratech",
    "villas in Sonipat",
    "plots Sonipat",
    "commercial spaces Sonipat",
    "RERA approved Sonipat",
    "builder Sonipat",
    "real estate developer Haryana",
    "penthouse Sonipat",
  ],
  openGraph: {
    title: "Kronus Infratech & Consultants — Luxury Real Estate in Sonipat",
    description: "An address that outlives time — crafted for legacy in Sonipat. Premium homes, villas, plots & commercial spaces.",
    url: "https://kronusinfra.com",
  },
  alternates: { canonical: "https://kronusinfra.com" },
};

export default function Home() {
  return (
    <main>
      <JsonLd data={realEstateAgentLd()} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: "https://kronusinfra.com" }])} />
      <HeroSection />
      <FeaturedProperties />
      <StatsSection />
      <PropertyTypes />
      <AboutSection />
      <CTASection />
    </main>
  );
}
