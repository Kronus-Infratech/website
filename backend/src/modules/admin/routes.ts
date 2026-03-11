import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireAdmin, requireRoles } from "../../middleware/requireAdmin.js";
import { authLimiter } from "../../config/rateLimit.js";
import * as ctrl from "./controller.js";
import {
  adminLoginSchema,
  adminPropertyCreateSchema,
  adminPropertyUpdateSchema,
  adminIdSchema,
  adminListLeadsSchema,
  adminSiteVisitUpdateSchema,
} from "./schema.js";

const router = Router();

// Admin auth — no admin token required
router.post("/login", authLimiter, validate({ body: adminLoginSchema }), asyncHandler(ctrl.login));

// All routes below require admin auth
router.use(requireAdmin);

// Dashboard
router.get("/dashboard", asyncHandler(ctrl.dashboardStats));

// Properties CRUD
router.post(
  "/properties",
  requireRoles("ADMIN", "MANAGER", "DIRECTOR"),
  validate({ body: adminPropertyCreateSchema }),
  asyncHandler(ctrl.createProperty),
);
router.put(
  "/properties/:id",
  requireRoles("ADMIN", "MANAGER", "DIRECTOR"),
  validate({ params: adminIdSchema, body: adminPropertyUpdateSchema }),
  asyncHandler(ctrl.updateProperty),
);
router.delete(
  "/properties/:id",
  requireRoles("ADMIN", "DIRECTOR"),
  validate({ params: adminIdSchema }),
  asyncHandler(ctrl.deleteProperty),
);

// Leads (read-only from website perspective)
router.get("/leads", validate({ query: adminListLeadsSchema }), asyncHandler(ctrl.listLeads));

// Site visits
router.get("/site-visits", asyncHandler(ctrl.listSiteVisits));
router.patch(
  "/site-visits/:id",
  validate({ params: adminIdSchema, body: adminSiteVisitUpdateSchema }),
  asyncHandler(ctrl.updateSiteVisit),
);

// Newsletter subscribers
router.get("/newsletter", asyncHandler(ctrl.listSubscribers));

export default router;
