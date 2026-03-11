import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";

interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  property: string;
  budgetFrom?: number;
  budgetTo?: number;
  message?: string;
  pageSource?: string;
}

/**
 * Create a lead in the CRM's leads collection.
 * - source = WEBSITE
 * - financeNotes stores the page source + user message for CRM staff context
 * - Activity is logged against the system user
 */
export async function createLead(input: CreateLeadInput) {
  const systemUserId = env.SYSTEM_USER_ID;

  // Build finance notes with page source context
  const notesParts: string[] = [];
  if (input.pageSource) notesParts.push(`Source page: ${input.pageSource}`);
  if (input.message) notesParts.push(`Message: ${input.message}`);
  const financeNotes = notesParts.length > 0 ? notesParts.join(" | ") : undefined;

  const lead = await prisma.lead.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      property: input.property,
      source: "WEBSITE",
      status: "NEW",
      priority: "MEDIUM",
      budgetFrom: input.budgetFrom,
      budgetTo: input.budgetTo,
      financeNotes,
      createdById: systemUserId,
    },
  });

  // Log an activity in CRM
  await prisma.activity.create({
    data: {
      type: "NOTE",
      title: "Website enquiry received",
      description: `New enquiry from ${input.name} (${input.phone}) via website${input.pageSource ? ` — ${input.pageSource}` : ""}`,
      userId: systemUserId,
      leadId: lead.id,
    },
  });

  logger.info({ leadId: lead.id, source: input.pageSource }, "CRM lead created from website");

  return { id: lead.id, message: "Enquiry submitted successfully" };
}

interface SiteVisitInput {
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  inventoryItemId?: string;
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
  userId?: string;
}

/**
 * Create a site visit request + corresponding CRM lead.
 */
export async function createSiteVisitRequest(input: SiteVisitInput) {
  // Create the site visit record
  const visit = await prisma.siteVisitRequest.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      projectId: input.projectId,
      inventoryItemId: input.inventoryItemId,
      preferredDate: new Date(input.preferredDate),
      preferredTime: input.preferredTime,
      notes: input.notes,
      userId: input.userId,
      status: "PENDING",
    },
  });

  // Also create a CRM lead for the site visit
  const propertyContext = input.projectId
    ? `Site visit request (Project: ${input.projectId})`
    : "Site visit request";

  await createLead({
    name: input.name,
    phone: input.phone,
    email: input.email,
    property: propertyContext,
    message: input.notes,
    pageSource: "site-visit-request",
  });

  logger.info({ visitId: visit.id }, "Site visit request created");

  return { id: visit.id, message: "Site visit request submitted successfully" };
}
