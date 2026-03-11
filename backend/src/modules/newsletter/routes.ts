import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { formLimiter } from "../../config/rateLimit.js";
import * as ctrl from "./controller.js";
import { subscribeSchema, unsubscribeSchema } from "./schema.js";

const router = Router();

router.post("/subscribe", formLimiter, validate({ body: subscribeSchema }), asyncHandler(ctrl.subscribe));
router.post("/unsubscribe", validate({ body: unsubscribeSchema }), asyncHandler(ctrl.unsubscribe));

export default router;
