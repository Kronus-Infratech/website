import type { Metadata } from "next";
import BlogsContent from "./components/BlogsContent";
import BLOG_POSTS from "@/data/blogs";

export const metadata: Metadata = {
    title: "Blog — Real Estate Insights, Buyer Guides & Market Trends | Kronus Infratech",
    description:
        "Expert articles on Sonipat real estate, home-buying tips, RERA compliance, Vastu design, construction quality, and investment strategies from Kronus Infratech & Consultants.",
    keywords: [
        "real estate blog",
        "Sonipat property market",
        "home buying guide India",
        "RERA Haryana",
        "Vastu Shastra homes",
        "real estate investment tips",
        "Kronus Infratech blog",
        "property trends Haryana",
    ],
    openGraph: {
        title: "The Kronus Journal — Real Estate Insights & Guides",
        description:
            "Market trends, buyer guides, construction deep-dives, and honest advice from builders who've been at it since 2014.",
        type: "website",
        locale: "en_IN",
        url: "https://kronusinfra.org/blogs",
    },
    alternates: {
        canonical: "https://kronusinfra.org/blogs",
    },
};

function BlogListJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "The Kronus Journal",
        description:
            "Expert real estate insights, buyer guides, and market analysis from Kronus Infratech & Consultants, Sonipat.",
        url: "https://kronusinfra.org/blogs",
        publisher: {
            "@type": "Organization",
            name: "Kronus Infratech & Consultants",
            url: "https://kronusinfra.org",
            logo: {
                "@type": "ImageObject",
                url: "https://kronusinfra.org/logo.png",
            },
        },
        blogPost: BLOG_POSTS.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
                "@type": "Person",
                name: post.author.name,
                jobTitle: post.author.role,
            },
            url: `https://kronusinfra.org/blogs/${post.slug}`,
            image: post.image,
            keywords: post.tags.join(", "),
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function BlogsPage() {
    return (
        <main>
            <BlogListJsonLd />
            <BlogsContent />
        </main>
    );
}
