import type { Request, Response } from "express";
import { ok, created } from "../../lib/apiResponse.js";
import * as newsletterService from "./service.js";

export async function subscribe(req: Request, res: Response) {
  const result = await newsletterService.subscribe(req.body.email);
  return created(res, result.message);
}

export async function unsubscribe(req: Request, res: Response) {
  const result = await newsletterService.unsubscribe(req.body.email);
  return ok(res, result.message);
}
