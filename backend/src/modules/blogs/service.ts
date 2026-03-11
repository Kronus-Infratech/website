import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import type { Prisma } from "../../../generated/prisma/index.js";

interface ListBlogsParams {
  page: number;
  limit: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export async function listBlogs(params: ListBlogsParams) {
  const where: Prisma.BlogPostWhereInput = { published: true };

  if (params.category) where.category = params.category;
  if (params.tag) where.tags = { has: params.tag };
  if (params.featured !== undefined) where.featured = params.featured;

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        tags: true,
        authorName: true,
        authorRole: true,
        authorAvatar: true,
        date: true,
        readingTime: true,
        image: true,
        featured: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getBlogBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) throw AppError.notFound("Blog post not found");
  return post;
}

export async function getCategories() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return posts.map((p) => p.category);
}

export async function getTags() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true },
  });
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// ─── Admin CRUD ───

export async function createBlog(data: Prisma.BlogPostCreateInput) {
  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) throw AppError.conflict("Blog with this slug already exists");
  return prisma.blogPost.create({ data });
}

export async function updateBlog(id: string, data: Prisma.BlogPostUpdateInput) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw AppError.notFound("Blog post not found");
  return prisma.blogPost.update({ where: { id }, data });
}

export async function deleteBlog(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw AppError.notFound("Blog post not found");
  await prisma.blogPost.delete({ where: { id } });
  return { message: "Blog post deleted" };
}

/** Admin list — includes unpublished */
export async function adminListBlogs(params: ListBlogsParams) {
  const where: Prisma.BlogPostWhereInput = {};
  if (params.category) where.category = params.category;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
