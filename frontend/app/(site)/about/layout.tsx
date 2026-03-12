import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, faqPageLd } from "@/lib/schemas";

export const metadata: Metadata = {
    title: "About Us — Our Story, Values & Team",
    description:
        "Since 2014, Kronus Infratech has served 500+ families in Sonipat with RERA-compliant homes, earthquake-resistant construction, and Vastu-aligned design. Meet the team behind Sonipat's most trusted builder.",
    keywords: [
        "about Kronus Infratech",
        "real estate developer Sonipat",
        "builder history Sonipat",
        "RERA builder Haryana",
        "trusted builder Sonipat",
        "Kronus Infratech team",
        "construction quality Sonipat",
    ],
    openGraph: {
        title: "About Kronus Infratech & Consultants",
        description:
            "From 24 apartments in 2014 to 500+ families — discover how Kronus Infratech became Sonipat's most trusted name in real estate.",
        url: "https://kronusinfra.com/about",
    },
    alternates: { canonical: "https://kronusinfra.com/about" },
};

const ABOUT_FAQS = [
    { q: "When was Kronus Infratech founded?", a: "Kronus Infratech was founded in 2014 with a single residential project of 24 apartments in Sonipat, delivered ahead of schedule." },
    { q: "How many families has Kronus served?", a: "As of 2025, Kronus Infratech has served over 500 families across residential, commercial, villa, and plotted developments in Sonipat." },
    { q: "Is Kronus Infratech RERA registered?", a: "Yes. 100% of Kronus projects are RERA-compliant. Registration numbers are displayed on-site and in all marketing materials." },
    { q: "What construction standards does Kronus follow?", a: "All Kronus projects use earthquake-resistant RCC frameworks, ISI-certified materials, and undergo 40+ quality checkpoints per floor." },
    { q: "Does Kronus offer Vastu-compliant homes?", a: "Yes. Every Kronus layout is designed with Vastu Shastra as the starting point, not an afterthought." },
    { q: "What after-sale support does Kronus provide?", a: "Kronus provides 2 years of dedicated post-possession maintenance covering plumbing, electrical, structural settling, and common area upkeep." },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={breadcrumbLd([
                    { name: "Home", url: "https://kronusinfra.com" },
                    { name: "About", url: "https://kronusinfra.com/about" },
                ])}
            />
            <JsonLd data={faqPageLd(ABOUT_FAQS)} />
            {children}
        </>
    );
}
