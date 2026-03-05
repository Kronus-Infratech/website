import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BLOG_POSTS from "@/data/blogs";
import BlogPostContent from "./components/BlogPostContent";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Article Not Found | Kronus Infratech Blog",
            description: "The article you're looking for doesn't exist or may have been moved.",
        };
    }

    return {
        title: `${post.title} | Kronus Infratech Blog`,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            locale: "en_IN",
            url: `https://kronusinfra.org/blogs/${post.slug}`,
            publishedTime: post.date,
            authors: [post.author.name],
            section: post.category,
            tags: post.tags,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
        alternates: {
            canonical: `https://kronusinfra.org/blogs/${post.slug}`,
        },
    };
}

function ArticleJsonLd({ slug }: { slug: string }) {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return null;

    const wordCount = post.sections.reduce((sum, s) => sum + s.body.split(/\s+/).length, 0);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.role,
            worksFor: {
                "@type": "Organization",
                name: "Kronus Infratech & Consultants",
            },
        },
        publisher: {
            "@type": "Organization",
            name: "Kronus Infratech & Consultants",
            url: "https://kronusinfra.org",
            logo: {
                "@type": "ImageObject",
                url: "https://kronusinfra.org/logo.png",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://kronusinfra.org/blogs/${post.slug}`,
        },
        wordCount,
        articleSection: post.category,
        keywords: post.tags.join(", "),
        inLanguage: "en-IN",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

function BreadcrumbJsonLd({ slug }: { slug: string }) {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://kronusinfra.org",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://kronusinfra.org/blogs",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://kronusinfra.org/blogs/${post.slug}`,
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main>
            <ArticleJsonLd slug={slug} />
            <BreadcrumbJsonLd slug={slug} />
            <BlogPostContent post={post} />
        </main>
    );
}
