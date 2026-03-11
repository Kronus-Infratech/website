import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { optionalWebUser } from "../../middleware/requireWebUser.js";
import { formLimiter } from "../../config/rateLimit.js";
import * as ctrl from "./controller.js";
import { createLeadSchema, siteVisitRequestSchema } from "./schema.js";

const router = Router();

// Public form submissions — rate limited
router.post(
  "/enquiry",
  formLimiter,
  optionalWebUser,
  validate({ body: createLeadSchema }),
  asyncHandler(ctrl.submitEnquiry),
);

router.post(
  "/site-visit",
  formLimiter,
  optionalWebUser,
  validate({ body: siteVisitRequestSchema }),
  asyncHandler(ctrl.submitSiteVisit),
);

export default router;
