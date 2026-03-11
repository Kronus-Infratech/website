import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireAdmin, requireRoles } from "../../middleware/requireAdmin.js";
import * as ctrl from "./controller.js";
import {
  listWebsiteProjectsSchema,
  websiteProjectSlugSchema,
  websiteProjectIdSchema,
  createWebsiteProjectSchema,
  updateWebsiteProjectSchema,
} from "./schema.js";

const router = Router();

// ─── Public ───
router.get("/", validate({ query: listWebsiteProjectsSchema }), asyncHandler(ctrl.listProjects));
router.get("/types", asyncHandler(ctrl.getTypes));
router.get("/:slug", validate({ params: websiteProjectSlugSchema }), asyncHandler(ctrl.getProject));

// ─── Admin ───
router.get("/admin/list", requireAdmin, validate({ query: listWebsiteProjectsSchema }), asyncHandler(ctrl.adminListProjects));
router.post("/admin", requireAdmin, requireRoles("ADMIN", "MANAGER", "DIRECTOR"), validate({ body: createWebsiteProjectSchema }), asyncHandler(ctrl.createProject));
router.put("/admin/:id", requireAdmin, requireRoles("ADMIN", "MANAGER", "DIRECTOR"), validate({ params: websiteProjectIdSchema, body: updateWebsiteProjectSchema }), asyncHandler(ctrl.updateProject));
router.delete("/admin/:id", requireAdmin, requireRoles("ADMIN", "DIRECTOR"), validate({ params: websiteProjectIdSchema }), asyncHandler(ctrl.deleteProject));

export default router;
