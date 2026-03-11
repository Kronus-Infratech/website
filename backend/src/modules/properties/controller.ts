import type { Request, Response } from "express";
import { ok } from "../../lib/apiResponse.js";
import * as propertiesService from "./service.js";

export async function listProperties(req: Request, res: Response) {
  const result = await propertiesService.listProperties(req.validated?.query as any);
  return ok(res, "Properties retrieved", result.items, result.meta);
}

export async function getProperty(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  const item = await propertiesService.getPropertyById(id);
  return ok(res, "Property retrieved", item);
}

export async function getProjects(_req: Request, res: Response) {
  const projects = await propertiesService.getProjects();
  return ok(res, "Projects retrieved", projects);
}

export async function getProject(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  const project = await propertiesService.getProjectById(id);
  return ok(res, "Project retrieved", project);
}
