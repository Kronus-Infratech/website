import { z } from "zod";

export const listWebsiteProjectsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z.string().optional(),
  status: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["priceNumeric", "createdAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const websiteProjectSlugSchema = z.object({
  slug: z.string().min(1),
});

export const websiteProjectIdSchema = z.object({
  id: z.string().min(1),
});

export const createWebsiteProjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(2),
  type: z.string().min(1),
  status: z.string().min(1),
  price: z.string().min(1),
  priceNumeric: z.number().positive(),
  area: z.string().min(1),
  areaNumeric: z.number().positive(),
  bedrooms: z.number().int().min(0).default(0),
  bathrooms: z.number().int().min(0).default(0),
  location: z.string().min(1),
  locality: z.string().min(1),
  image: z.string().min(1),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  description: z.string().min(1),
  published: z.boolean().default(true),
});

export const updateWebsiteProjectSchema = createWebsiteProjectSchema.partial();
