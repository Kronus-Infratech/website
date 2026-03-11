import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import type { Prisma } from "../../../generated/prisma/index.js";

interface ListPropertiesParams {
  page: number;
  limit: number;
  status?: string;
  propertyType?: string;
  transactionType?: string;
  projectId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export async function listProperties(params: ListPropertiesParams) {
  const where: Prisma.InventoryItemWhereInput = {};

  if (params.status) where.status = params.status as any;
  if (params.propertyType) where.propertyType = params.propertyType as any;
  if (params.transactionType) where.transactionType = params.transactionType as any;
  if (params.projectId) where.projectId = params.projectId;

  if (params.minPrice || params.maxPrice) {
    where.totalPrice = {};
    if (params.minPrice) where.totalPrice.gte = params.minPrice;
    if (params.maxPrice) where.totalPrice.lte = params.maxPrice;
  }

  if (params.search) {
    where.OR = [
      { plotNumber: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { block: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      include: { project: { include: { city: true } } },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder },
    }),
    prisma.inventoryItem.count({ where }),
  ]);

  return {
    items,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getPropertyById(id: string) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: { project: { include: { city: true } } },
  });
  if (!item) throw AppError.notFound("Property not found");
  return item;
}

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      city: true,
      _count: { select: { inventory: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      city: true,
      inventory: {
        where: { status: "AVAILABLE" },
        orderBy: { listingDate: "desc" },
      },
    },
  });
  if (!project) throw AppError.notFound("Project not found");
  return project;
}
