import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import type { DocumentType } from "../../../generated/prisma/index.js";

// ─── Profile ───

export async function getProfile(userId: string) {
  const user = await prisma.websiteUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      avatar: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
  if (!user) throw AppError.notFound("User not found");
  return user;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string; phone?: string; avatar?: string },
) {
  // Check for email/phone uniqueness if changing
  if (data.email) {
    const existing = await prisma.websiteUser.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (existing) throw AppError.conflict("Email already in use");
  }
  if (data.phone) {
    const existing = await prisma.websiteUser.findFirst({
      where: { phone: data.phone, NOT: { id: userId } },
    });
    if (existing) throw AppError.conflict("Phone number already in use");
  }

  return prisma.websiteUser.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      avatar: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
}

// ─── Bookmarks ───

export async function addBookmark(userId: string, inventoryItemId: string) {
  // Verify inventory item exists
  const item = await prisma.inventoryItem.findUnique({ where: { id: inventoryItemId } });
  if (!item) throw AppError.notFound("Property not found");

  const existing = await prisma.bookmark.findUnique({
    where: { userId_inventoryItemId: { userId, inventoryItemId } },
  });
  if (existing) throw AppError.conflict("Property already bookmarked");

  return prisma.bookmark.create({
    data: { userId, inventoryItemId },
  });
}

export async function removeBookmark(userId: string, inventoryItemId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_inventoryItemId: { userId, inventoryItemId } },
  });
  if (!bookmark) throw AppError.notFound("Bookmark not found");

  await prisma.bookmark.delete({
    where: { id: bookmark.id },
  });
  return { message: "Bookmark removed" };
}

export async function listBookmarks(userId: string, page: number, limit: number) {
  const where = { userId };
  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        // Join to inventory_items to get property details
      },
    }),
    prisma.bookmark.count({ where }),
  ]);

  // Fetch inventory details for each bookmark
  const inventoryIds = bookmarks.map((b) => b.inventoryItemId);
  const items = await prisma.inventoryItem.findMany({
    where: { id: { in: inventoryIds } },
    include: { project: { include: { city: true } } },
  });

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const enriched = bookmarks.map((b) => ({
    ...b,
    inventoryItem: itemMap.get(b.inventoryItemId) ?? null,
  }));

  return {
    bookmarks: enriched,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function isBookmarked(userId: string, inventoryItemId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_inventoryItemId: { userId, inventoryItemId } },
  });
  return { bookmarked: !!bookmark };
}

// ─── Site Visits (user's own) ───

export async function listUserSiteVisits(userId: string) {
  return prisma.siteVisitRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Documents (KYC) ───

export async function addDocument(
  userId: string,
  data: { name: string; type: DocumentType; fileUrl: string; fileSize?: number },
) {
  return prisma.websiteUserDocument.create({
    data: { userId, ...data },
  });
}

export async function listDocuments(userId: string) {
  return prisma.websiteUserDocument.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function deleteDocument(userId: string, documentId: string) {
  const doc = await prisma.websiteUserDocument.findFirst({
    where: { id: documentId, userId },
  });
  if (!doc) throw AppError.notFound("Document not found");
  await prisma.websiteUserDocument.delete({ where: { id: documentId } });
  return { message: "Document deleted", fileUrl: doc.fileUrl };
}
