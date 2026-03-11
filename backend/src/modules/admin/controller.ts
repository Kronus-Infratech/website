import type { Request, Response } from "express";
import { ok, created, noContent } from "../../lib/apiResponse.js";
import * as adminService from "./service.js";

// ─── Auth ───

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await adminService.adminLogin(email, password);
  return ok(res, "Admin login successful", result);
}

// ─── Properties ───

export async function createProperty(req: Request, res: Response) {
  const property = await adminService.createProperty(req.body);
  return created(res, "Property created", property);
}

export async function updateProperty(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  const property = await adminService.updateProperty(id, req.body);
  return ok(res, "Property updated", property);
}

export async function deleteProperty(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  await adminService.deleteProperty(id);
  return noContent(res);
}

// ─── Leads ───

export async function listLeads(req: Request, res: Response) {
  const result = await adminService.listLeads(req.validated?.query as any);
  return ok(res, "Leads retrieved", result.leads, result.meta);
}

// ─── Site Visits ───

export async function listSiteVisits(req: Request, res: Response) {
  const { page = 1, limit = 20 } = req.query as any;
  const result = await adminService.listSiteVisits(Number(page), Number(limit));
  return ok(res, "Site visits retrieved", result.visits, result.meta);
}

export async function updateSiteVisit(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  const visit = await adminService.updateSiteVisit(id, req.body);
  return ok(res, "Site visit updated", visit);
}

// ─── Newsletter ───

export async function listSubscribers(req: Request, res: Response) {
  const { page = 1, limit = 50 } = req.query as any;
  const result = await adminService.listSubscribers(Number(page), Number(limit));
  return ok(res, "Subscribers retrieved", result.subscribers, result.meta);
}

// ─── Dashboard ───

export async function dashboardStats(_req: Request, res: Response) {
  const stats = await adminService.getDashboardStats();
  return ok(res, "Dashboard stats", stats);
}
