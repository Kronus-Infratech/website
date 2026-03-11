import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  avatar: z.string().url().optional(),
});

export const bookmarkSchema = z.object({
  inventoryItemId: z.string().min(1),
});

export const listBookmarksSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const documentUploadSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["AADHAAR", "PAN", "PASSPORT", "OTHER"]).default("OTHER"),
});
