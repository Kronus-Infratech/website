import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import type { Prisma } from "../../../generated/prisma/index.js";

interface ListParams {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export async function listProjects(params: ListParams) {
  const where: Prisma.WebsiteProjectWhereInput = { published: true };

  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;
  if (params.featured !== undefined) where.featured = params.featured;

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { locality: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.websiteProject.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.websiteProject.count({ where }),
  ]);

  return {
    projects,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.websiteProject.findUnique({ where: { slug } });
  if (!project || !project.published) throw AppError.notFound("Project not found");
  return project;
}

export async function getTypes() {
  const projects = await prisma.websiteProject.findMany({
    where: { published: true },
    select: { type: true },
    distinct: ["type"],
  });
  return projects.map((p) => p.type);
}

// ─── Admin CRUD ───

export async function createProject(data: Prisma.WebsiteProjectCreateInput) {
  const existing = await prisma.websiteProject.findUnique({ where: { slug: data.slug } });
  if (existing) throw AppError.conflict("Project with this slug already exists");
  return prisma.websiteProject.create({ data });
}

export async function updateProject(id: string, data: Prisma.WebsiteProjectUpdateInput) {
  const project = await prisma.websiteProject.findUnique({ where: { id } });
  if (!project) throw AppError.notFound("Project not found");
  return prisma.websiteProject.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  const project = await prisma.websiteProject.findUnique({ where: { id } });
  if (!project) throw AppError.notFound("Project not found");
  await prisma.websiteProject.delete({ where: { id } });
  return { message: "Project deleted" };
}

export async function adminListProjects(params: ListParams) {
  const where: Prisma.WebsiteProjectWhereInput = {};
  if (params.type) where.type = params.type;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { locality: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.websiteProject.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.websiteProject.count({ where }),
  ]);

  return {
    projects,
    meta: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
  };
}
