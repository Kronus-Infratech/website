import type { Metadata } from "next";
import { JsonLd, localBusinessLd, breadcrumbLd, faqPageLd } from "@/lib/schemas";

export const metadata: Metadata = {
    title: "Contact Us — Visit, Call or Email",
    description:
        "Get in touch with Kronus Infratech & Consultants. Visit our office in Sonipat, call +91 98765 43210, or email admin@kronusinfra.com. Home loan assistance, site visits, and NRI desk available.",
    keywords: [
        "contact Kronus Infratech",
        "real estate office Sonipat",
        "property enquiry Sonipat",
        "book site visit Sonipat",
        "Kronus phone number",
        "home loan Sonipat",
        "NRI property India",
    ],
    openGraph: {
        title: "Contact Kronus Infratech & Consultants",
        description: "Call, email or visit us in Sonipat. We respond within 4 hours. Walk-ins welcome, chai included.",
        url: "https://kronusinfra.com/contact",
    },
    alternates: { canonical: "https://kronusinfra.com/contact" },
};

const CONTACT_FAQS = [
    { q: "What documents do I need to book a property?", a: "You'll need Aadhaar card, PAN card, two passport-size photos, and the booking amount cheque. Our team walks you through every step — no surprises, no hidden paperwork." },
    { q: "Is Kronus RERA registered?", a: "Every single Kronus project is 100% RERA-compliant. Registration numbers are prominently displayed on-site and in all marketing material. Transparency isn't a feature — it's our default." },
    { q: "Can I visit the construction site before booking?", a: "Absolutely. We encourage it. Our site engineers will walk you through the raw structure, explain the materials, and let you see exactly what you're investing in. No polished show-flats — just honest concrete." },
    { q: "What's included in the post-possession maintenance?", a: "Two years of dedicated maintenance covering plumbing, electrical, structural settling, and common area upkeep. If a tap leaks at 11 PM, our team is one call away." },
    { q: "Do you offer home loan assistance?", a: "We've partnered with SBI, HDFC, ICICI, and Axis Bank. Our finance desk handles the entire loan process — from eligibility checks to disbursement. Pre-approved loans available on select projects." },
    { q: "Can NRIs invest in Kronus properties?", a: "Yes. We have a dedicated NRI desk that handles FEMA compliance, power-of-attorney documentation, and virtual site tours. Several NRI families across the US, UK, and Middle East are proud Kronus homeowners." },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={localBusinessLd()} />
            <JsonLd
                data={breadcrumbLd([
                    { name: "Home", url: "https://kronusinfra.com" },
                    { name: "Contact", url: "https://kronusinfra.com/contact" },
                ])}
            />
            <JsonLd data={faqPageLd(CONTACT_FAQS)} />
            {children}
        </>
    );
}
