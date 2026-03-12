/**
 * Shared JSON-LD structured data builders for SEO.
 * Each function returns a plain object — render with <JsonLd data={...} />.
 */

import type { Property, BlogPost } from "./types";

const SITE_URL = "https://kronusinfra.com";
const LOGO_URL = `${SITE_URL}/logo.png`;
const ORG_NAME = "Kronus Infratech & Consultants";

// ─── Reusable fragments ───

export const organizationLd = {
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    sameAs: [
        "https://www.youtube.com/@kronusinfratech",
        "https://www.instagram.com/kronus_infratech",
        "https://www.facebook.com/Kronusinfra",
    ],
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-98765-43210",
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
    },
};

// ─── WebSite (global — appears once on home) ───

export function websiteLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: ORG_NAME,
        url: SITE_URL,
        description:
            "An address that outlives time. Kronus Infratech builds legacy homes, premium villas, commercial spaces and plots across Sonipat with unmatched craftsmanship.",
        publisher: organizationLd,
        potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/projects?search={search_term_string}` },
            "query-input": "required name=search_term_string",
        },
    };
}

// ─── Organization (global) ───

export function organizationFullLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: ORG_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: LOGO_URL },
        image: `${SITE_URL}/og-image.webp`,
        description:
            "Kronus Infratech & Consultants — luxury real estate developer in Sonipat, Haryana. Building homes, villas, commercial spaces, and plotted developments since 2014.",
        foundingDate: "2014",
        address: {
            "@type": "PostalAddress",
            streetAddress: "GT Road",
            addressLocality: "Sonipat",
            addressRegion: "Haryana",
            postalCode: "131001",
            addressCountry: "IN",
        },
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+91-98765-43210",
                contactType: "sales",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
            },
            {
                "@type": "ContactPoint",
                email: "admin@kronusinfra.com",
                contactType: "customer service",
            },
        ],
        sameAs: [
            "https://www.youtube.com/@kronusinfratech",
            "https://www.instagram.com/kronus_infratech",
            "https://www.facebook.com/Kronusinfra",
        ],
    };
}

// ─── RealEstateAgent (home) ───

export function realEstateAgentLd() {
    return {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: ORG_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/og-image.webp`,
        telephone: "+91-98765-43210",
        email: "admin@kronusinfra.com",
        address: {
            "@type": "PostalAddress",
            streetAddress: "GT Road",
            addressLocality: "Sonipat",
            addressRegion: "Haryana",
            postalCode: "131001",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "28.9931",
            longitude: "77.0151",
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "19:00",
            },
        ],
        priceRange: "₹₹₹",
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "156",
            bestRating: "5",
            worstRating: "1",
        },
    };
}

// ─── LocalBusiness (contact page) ───

export function localBusinessLd() {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: ORG_NAME,
        image: `${SITE_URL}/og-image.webp`,
        url: SITE_URL,
        telephone: "+91-98765-43210",
        email: "admin@kronusinfra.com",
        address: {
            "@type": "PostalAddress",
            streetAddress: "GT Road",
            addressLocality: "Sonipat",
            addressRegion: "Haryana",
            postalCode: "131001",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "28.9931",
            longitude: "77.0151",
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "19:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Sunday",
                opens: "00:00",
                closes: "00:00",
                description: "By appointment only",
            },
        ],
        priceRange: "₹₹₹",
        sameAs: [
            "https://www.youtube.com/@kronusinfratech",
            "https://www.instagram.com/kronus_infratech",
            "https://www.facebook.com/Kronusinfra",
        ],
    };
}

// ─── FAQPage ───

export function faqPageLd(faqs: { q: string; a: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}

// ─── BreadcrumbList ───

export function breadcrumbLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

// ─── ItemList (project/blog listings) ───

export function projectListLd(projects: Property[]) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Kronus Infratech Properties",
        description: "Premium real estate projects in Sonipat, Haryana by Kronus Infratech.",
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/projects/${p.slug}`,
            name: p.title,
            image: p.image,
        })),
    };
}

// ─── RealEstateListing (individual project) ───

export function realEstateListingLd(p: Property) {
    return {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: p.title,
        description: p.description,
        url: `${SITE_URL}/projects/${p.slug}`,
        image: p.image,
        datePosted: new Date().toISOString().split("T")[0],
        address: {
            "@type": "PostalAddress",
            streetAddress: p.locality,
            addressLocality: p.location,
            addressRegion: "Haryana",
            postalCode: "131001",
            addressCountry: "IN",
        },
        offers: {
            "@type": "Offer",
            price: p.priceNumeric,
            priceCurrency: "INR",
            availability:
                p.status === "Ready to Move"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/PreOrder",
        },
        ...(p.bedrooms > 0 && { numberOfRooms: p.bedrooms }),
        floorSize: {
            "@type": "QuantitativeValue",
            value: p.areaNumeric,
            unitCode: "FTK",
            unitText: "sq ft",
        },
    };
}

// ─── Product (individual project — for Google rich results) ───

export function productLd(p: Property) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.title,
        description: p.description,
        image: p.image,
        url: `${SITE_URL}/projects/${p.slug}`,
        brand: { "@type": "Brand", name: ORG_NAME },
        category: `Real Estate > ${p.type}`,
        offers: {
            "@type": "Offer",
            price: p.priceNumeric,
            priceCurrency: "INR",
            availability:
                p.status === "Ready to Move"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/PreOrder",
            seller: organizationLd,
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "156",
            bestRating: "5",
            worstRating: "1",
        },
        review: [
            {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Deepak Gupta" },
                reviewBody:
                    "We visited twelve builders in Sonipat. The moment we saw the construction quality at Kronus, there was no going back. Three years in and the walls still look freshly painted.",
            },
            {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Dr. Rakesh Yadav" },
                reviewBody:
                    "Amit ji personally walked me through the structural drawings and explained why the pillars were placed the way they were. That kind of transparency sold me more than any brochure.",
            },
            {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Neha Malhotra" },
                reviewBody:
                    "My parents were sceptical about moving from Delhi. Six months later, my father refuses to visit us in the city — he says the air and community at Kronus Township are irreplaceable.",
            },
        ],
    };
}

// ─── Render helper component ───

export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
