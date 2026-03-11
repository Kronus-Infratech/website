/**
 * Data fetchers — server-side helpers that call the backend API
 * and transform responses into frontend-friendly types.
 *
 * Used by server components (blogs pages) and optionally by client hooks.
 */

import type { Property, BlogPost } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// ─── Raw API response types ───

interface ApiProject {
    id: string;
    slug: string;
    title: string;
    type: string;
    status: string;
    price: string;
    priceNumeric: number;
    area: string;
    areaNumeric: number;
    bedrooms: number;
    bathrooms: number;
    location: string;
    locality: string;
    image: string;
    images?: string[];
    featured: boolean;
    amenities: string[];
    description: string;
}

interface ApiBlogListItem {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    authorName: string;
    authorRole: string;
    authorAvatar: string;
    date: string;
    readingTime: number;
    image: string;
    featured: boolean;
}

interface ApiBlogFull extends ApiBlogListItem {
    sections: { heading: string; body: string }[];
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}

// ─── Transformers ───

function toProperty(p: ApiProject): Property {
    return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        type: p.type,
        status: p.status,
        price: p.price,
        priceNumeric: p.priceNumeric,
        area: p.area,
        areaNumeric: p.areaNumeric,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        location: p.location,
        locality: p.locality,
        image: p.image,
        images: p.images,
        featured: p.featured,
        amenities: p.amenities,
        description: p.description,
    };
}

function toBlogPost(b: ApiBlogListItem | ApiBlogFull): BlogPost {
    return {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        category: b.category,
        tags: b.tags,
        author: {
            name: b.authorName,
            role: b.authorRole,
            avatar: b.authorAvatar,
        },
        date: typeof b.date === "string" ? b.date : new Date(b.date).toISOString(),
        readingTime: b.readingTime,
        image: b.image,
        featured: b.featured,
        sections: "sections" in b ? (b as ApiBlogFull).sections : [],
    };
}

// ─── Fetcher (works in server components and on the client) ───

async function apiFetch<T>(endpoint: string, revalidate?: number): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            next: { revalidate: revalidate ?? 60 },
        });
        if (!res.ok) return null;
        const json: ApiEnvelope<T> = await res.json();
        return json.data ?? null;
    } catch {
        return null;
    }
}

// ─── Public API ───

export async function fetchProjects(): Promise<Property[]> {
    const data = await apiFetch<ApiProject[]>("/projects?limit=50");
    return (data ?? []).map(toProperty);
}

export async function fetchProjectBySlug(slug: string): Promise<Property | null> {
    const data = await apiFetch<ApiProject>(`/projects/${slug}`);
    return data ? toProperty(data) : null;
}

export async function fetchFeaturedProjects(): Promise<Property[]> {
    const data = await apiFetch<ApiProject[]>("/projects?featured=true&limit=10");
    return (data ?? []).map(toProperty);
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    const data = await apiFetch<ApiBlogListItem[]>("/blogs?limit=50");
    return (data ?? []).map(toBlogPost);
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
    const data = await apiFetch<ApiBlogFull>(`/blogs/${slug}`);
    return data ? toBlogPost(data) : null;
}

export async function fetchBlogCategories(): Promise<string[]> {
    const data = await apiFetch<string[]>("/blogs/categories");
    return data ?? [];
}
