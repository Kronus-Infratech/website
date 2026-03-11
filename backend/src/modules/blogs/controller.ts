import type { Request, Response } from "express";
import { ok, created, noContent } from "../../lib/apiResponse.js";
import * as blogsService from "./service.js";

// ─── Public ───

export async function listBlogs(req: Request, res: Response) {
  const result = await blogsService.listBlogs(req.validated?.query as any);
  return ok(res, "Blog posts retrieved", result.posts, result.meta);
}

export async function getBlog(req: Request, res: Response) {
  const { slug } = req.validated?.params as { slug: string };
  const post = await blogsService.getBlogBySlug(slug);
  return ok(res, "Blog post retrieved", post);
}

export async function getCategories(_req: Request, res: Response) {
  const categories = await blogsService.getCategories();
  return ok(res, "Categories retrieved", categories);
}

export async function getTags(_req: Request, res: Response) {
  const tags = await blogsService.getTags();
  return ok(res, "Tags retrieved", tags);
}

// ─── Admin ───

export async function adminListBlogs(req: Request, res: Response) {
  const result = await blogsService.adminListBlogs(req.validated?.query as any);
  return ok(res, "Blog posts retrieved", result.posts, result.meta);
}

export async function createBlog(req: Request, res: Response) {
  const post = await blogsService.createBlog({
    ...req.body,
    date: new Date(req.body.date),
  });
  return created(res, "Blog post created", post);
}

export async function updateBlog(req: Request, res: Response) {
  const data = { ...req.body };
  if (data.date) data.date = new Date(data.date);
  const { id } = req.validated?.params as { id: string };
  const post = await blogsService.updateBlog(id, data);
  return ok(res, "Blog post updated", post);
}

export async function deleteBlog(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  await blogsService.deleteBlog(id);
  return noContent(res);
}
