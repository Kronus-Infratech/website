import { Router } from "express";
import * as controller from "./controller.js";

const router = Router();

// Send OTP
router.post("/send", controller.sendOtp);

// Verify OTP
router.post("/verify", controller.verifyOtp);

export default router;
