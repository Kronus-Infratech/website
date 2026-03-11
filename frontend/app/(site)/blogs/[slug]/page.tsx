import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBlogBySlug, fetchBlogPosts } from "@/lib/fetchers";
import type { BlogPost } from "@/lib/types";
import BlogPostContent from "./components/BlogPostContent";

export const revalidate = 60;

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchBlogBySlug(slug);

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
            url: `https://kronusinfra.com/blogs/${post.slug}`,
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
            canonical: `https://kronusinfra.com/blogs/${post.slug}`,
        },
    };
}

function ArticleJsonLd({ post }: { post: BlogPost }) {
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
            url: "https://kronusinfra.com",
            logo: {
                "@type": "ImageObject",
                url: "https://kronusinfra.com/logo.png",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://kronusinfra.com/blogs/${post.slug}`,
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

function BreadcrumbJsonLd({ post }: { post: BlogPost }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://kronusinfra.com",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://kronusinfra.com/blogs",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://kronusinfra.com/blogs/${post.slug}`,
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
    const [post, allPosts] = await Promise.all([
        fetchBlogBySlug(slug),
        fetchBlogPosts(),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <main>
            <ArticleJsonLd post={post} />
            <BreadcrumbJsonLd post={post} />
            <BlogPostContent post={post} allPosts={allPosts} />
        </main>
    );
}
