import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const adminPropertyCreateSchema = z.object({
  plotNumber: z.string().min(1),
  projectId: z.string().min(1),
  size: z.string().optional(),
  ratePerSqYard: z.number().positive().optional(),
  totalPrice: z.number().positive().optional(),
  facing: z.string().optional(),
  roadWidth: z.string().optional(),
  transactionType: z.enum(["SALE", "RENT", "LEASE"]).default("SALE"),
  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "INSTITUTIONAL", "AGRICULTURAL", "OTHER"]).default("RESIDENTIAL"),
  openSides: z.number().int().min(0).optional(),
  construction: z.boolean().optional(),
  boundaryWalls: z.boolean().optional(),
  gatedColony: z.boolean().optional(),
  corner: z.boolean().optional(),
  condition: z.enum(["NEW", "RESALE"]).default("NEW"),
  paymentTime: z.string().optional(),
  paymentCondition: z.string().optional(),
  circleRate: z.number().optional(),
  status: z.enum(["AVAILABLE", "BLOCKED", "SOLD"]).default("AVAILABLE"),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  block: z.string().optional(),
  askingPrice: z.number().optional(),
  reference: z.string().optional(),
  amenities: z.string().optional(),
  maintenanceCharges: z.number().optional(),
  clubCharges: z.number().optional(),
  cannesCharges: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
});

export const adminPropertyUpdateSchema = adminPropertyCreateSchema.partial();

export const adminIdSchema = z.object({
  id: z.string().min(1),
});

export const adminListLeadsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});

export const adminSiteVisitUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
});
