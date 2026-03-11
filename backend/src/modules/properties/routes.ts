import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./controller.js";
import { listPropertiesSchema, propertyIdSchema } from "./schema.js";

const router = Router();

// Public endpoints
router.get("/", validate({ query: listPropertiesSchema }), asyncHandler(ctrl.listProperties));
router.get("/projects", asyncHandler(ctrl.getProjects));
router.get("/projects/:id", validate({ params: propertyIdSchema }), asyncHandler(ctrl.getProject));
router.get("/:id", validate({ params: propertyIdSchema }), asyncHandler(ctrl.getProperty));

export default router;
