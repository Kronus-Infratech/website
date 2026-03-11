import { z } from "zod";

export const listPropertiesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  status: z.enum(["AVAILABLE", "BLOCKED", "SOLD"]).optional(),
  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "INSTITUTIONAL", "AGRICULTURAL", "OTHER"]).optional(),
  transactionType: z.enum(["SALE", "RENT", "LEASE"]).optional(),
  projectId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["totalPrice", "listingDate", "size"]).default("listingDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const propertyIdSchema = z.object({
  id: z.string().min(1),
});
