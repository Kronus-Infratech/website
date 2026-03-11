import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  property: z.string().min(1, "Property interest is required"),
  budgetFrom: z.number().positive().optional(),
  budgetTo: z.number().positive().optional(),
  message: z.string().max(2000).optional(),
  pageSource: z.string().optional(), // e.g., "contact-page", "project-slug-page"
});

export const siteVisitRequestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  projectId: z.string().optional(),
  inventoryItemId: z.string().optional(),
  preferredDate: z.string().datetime({ message: "preferredDate must be a valid ISO date" }),
  preferredTime: z.string().optional(),
  notes: z.string().max(1000).optional(),
});
