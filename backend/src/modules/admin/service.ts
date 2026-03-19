import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import { comparePassword } from "../../lib/hash.js";
import { signAdminToken } from "../../lib/jwt.js";
import type { Prisma } from "../../../generated/prisma/index.js";

// ─── Admin Auth (WebsiteUser with admin roles) ───

export async function adminLogin(email: string, password: string) {
  const user = await prisma.websiteUser.findUnique({ where: { email } });
  if (!user || !user.isActive || !user.passwordHash) {
    throw AppError.unauthorized("Invalid credentials");
  }

  // Only users with ADMIN role can log in to admin panel
  if (user.userType !== "ADMIN") {
    throw AppError.unauthorized("Invalid credentials");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw AppError.unauthorized("Invalid credentials");

  const token = signAdminToken(user.id, [user.userType]);

  return {
    token,
    user: {
      id: user.id,
      name: user.name ?? user.email ?? "",
      email: user.email ?? "",
      userType: user.userType,
    },
  };
}

// ─── Admin Property CRUD ───

export async function createProperty(data: Prisma.InventoryItemCreateWithoutProjectInput & { projectId: string }) {
  const { projectId, ...rest } = data;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw AppError.notFound("Project not found");

  return prisma.inventoryItem.create({
    data: { ...rest, project: { connect: { id: projectId } } },
    include: { project: true },
  });
}

export async function updateProperty(id: string, data: Prisma.InventoryItemUpdateInput) {
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) throw AppError.notFound("Property not found");
  return prisma.inventoryItem.update({
    where: { id },
    data,
    include: { project: true },
  });
}

export async function deleteProperty(id: string) {
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) throw AppError.notFound("Property not found");
  await prisma.inventoryItem.delete({ where: { id } });
  return { message: "Property deleted" };
}

// ─── Admin Leads View ───

interface AdminListLeadsParams {
  page: number;
  limit: number;
  status?: string;
  source?: string;
  search?: string;
}

export async function listLeads(params: AdminListLeadsParams) {
  const where: Prisma.LeadWhereInput = { source: "WEBSITE" };

  if (params.status) where.status = params.status as any;
  if (params.source) where.source = params.source as any;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: "desc" },
      include: { assignedTo: { select: { id: true, name: true } } },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    meta: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
  };
}

// ─── Admin Site Visits ───

export async function listSiteVisits(page: number, limit: number) {
  const [visits, total] = await Promise.all([
    prisma.siteVisitRequest.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteVisitRequest.count(),
  ]);

  return {
    visits,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateSiteVisit(id: string, data: { status: string; notes?: string }) {
  const visit = await prisma.siteVisitRequest.findUnique({ where: { id } });
  if (!visit) throw AppError.notFound("Site visit not found");
  return prisma.siteVisitRequest.update({
    where: { id },
    data: { status: data.status as any, notes: data.notes },
  });
}

// ─── Admin Newsletter ───

export async function listSubscribers(page: number, limit: number) {
  const where = { isActive: true };
  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { subscribedAt: "desc" },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  return {
    subscribers,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Admin Dashboard Stats ───

export async function getDashboardStats() {
  const [
    totalProperties,
    availableProperties,
    totalLeads,
    newLeads,
    totalSiteVisits,
    pendingSiteVisits,
    totalSubscribers,
    totalWebUsers,
  ] = await Promise.all([
    prisma.inventoryItem.count(),
    prisma.inventoryItem.count({ where: { status: "AVAILABLE" } }),
    prisma.lead.count({ where: { source: "WEBSITE" } }),
    prisma.lead.count({ where: { source: "WEBSITE", status: "NEW" } }),
    prisma.siteVisitRequest.count(),
    prisma.siteVisitRequest.count({ where: { status: "PENDING" } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.websiteUser.count({ where: { isActive: true } }),
  ]);

  return {
    properties: { total: totalProperties, available: availableProperties },
    leads: { total: totalLeads, new: newLeads },
    siteVisits: { total: totalSiteVisits, pending: pendingSiteVisits },
    newsletter: { subscribers: totalSubscribers },
    users: { total: totalWebUsers },
  };
}
