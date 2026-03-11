/**
 * Shared frontend types — replaces hardcoded data file exports.
 */

export interface Property {
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

export interface BlogAuthor {
    name: string;
    role: string;
    avatar: string;
}

export interface BlogSection {
    heading: string;
    body: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    author: BlogAuthor;
    date: string;
    readingTime: number;
    image: string;
    featured: boolean;
    sections: BlogSection[];
}
