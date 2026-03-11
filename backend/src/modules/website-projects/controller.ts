import type { Request, Response } from "express";
import { ok, created, noContent } from "../../lib/apiResponse.js";
import * as projectService from "./service.js";

// ─── Public ───

export async function listProjects(req: Request, res: Response) {
  const result = await projectService.listProjects(req.validated?.query as any);
  return ok(res, "Projects retrieved", result.projects, result.meta);
}

export async function getProject(req: Request, res: Response) {
  const { slug } = req.validated?.params as { slug: string };
  const project = await projectService.getProjectBySlug(slug);
  return ok(res, "Project retrieved", project);
}

export async function getTypes(_req: Request, res: Response) {
  const types = await projectService.getTypes();
  return ok(res, "Types retrieved", types);
}

// ─── Admin ───

export async function adminListProjects(req: Request, res: Response) {
  const result = await projectService.adminListProjects(req.validated?.query as any);
  return ok(res, "Projects retrieved", result.projects, result.meta);
}

export async function createProject(req: Request, res: Response) {
  const project = await projectService.createProject(req.body);
  return created(res, "Project created", project);
}

export async function updateProject(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  const project = await projectService.updateProject(id, req.body);
  return ok(res, "Project updated", project);
}

export async function deleteProject(req: Request, res: Response) {
  const { id } = req.validated?.params as { id: string };
  await projectService.deleteProject(id);
  return noContent(res);
}
