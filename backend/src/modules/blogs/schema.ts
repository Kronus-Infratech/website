import { z } from "zod";

export const listBlogsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["date", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const blogSlugSchema = z.object({
  slug: z.string().min(1),
});

export const blogIdSchema = z.object({
  id: z.string().min(1),
});

const blogSectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const createBlogSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  authorName: z.string().min(1),
  authorRole: z.string().min(1),
  authorAvatar: z.string().optional(),
  date: z.string().datetime(),
  readingTime: z.number().int().positive(),
  image: z.string().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sections: z.array(blogSectionSchema).min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();
