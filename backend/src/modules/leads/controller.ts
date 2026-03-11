import type { Request, Response } from "express";
import { created } from "../../lib/apiResponse.js";
import * as leadsService from "./service.js";

export async function submitEnquiry(req: Request, res: Response) {
  const result = await leadsService.createLead(req.body);
  return created(res, result.message, { id: result.id });
}

export async function submitSiteVisit(req: Request, res: Response) {
  const userId = req.webUser?.sub;
  const result = await leadsService.createSiteVisitRequest({
    ...req.body,
    userId,
  });
  return created(res, result.message, { id: result.id });
}
