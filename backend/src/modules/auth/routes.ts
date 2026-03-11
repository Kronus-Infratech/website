import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireWebUser } from "../../middleware/requireWebUser.js";
import { authLimiter, otpLimiter } from "../../config/rateLimit.js";
import * as ctrl from "./controller.js";
import {
  sendOtpSchema,
  verifyOtpSchema,
  registerEmailSchema,
  loginEmailSchema,
  googleAuthSchema,
  resetPasswordSchema,
} from "./schema.js";

const router = Router();

// OTP
router.post("/otp/send", otpLimiter, validate({ body: sendOtpSchema }), asyncHandler(ctrl.sendOtp));
router.post("/otp/verify-phone", authLimiter, validate({ body: verifyOtpSchema }), asyncHandler(ctrl.verifyPhoneLogin));

// Email
router.post("/register", authLimiter, validate({ body: registerEmailSchema }), asyncHandler(ctrl.register));
router.post("/login/email", authLimiter, validate({ body: loginEmailSchema }), asyncHandler(ctrl.loginEmail));
router.post("/verify-email", authLimiter, validate({ body: verifyOtpSchema }), asyncHandler(ctrl.verifyEmail));

// Password reset
router.post("/forgot-password", authLimiter, validate({ body: sendOtpSchema }), asyncHandler(ctrl.forgotPassword));
router.post("/reset-password", authLimiter, validate({ body: resetPasswordSchema }), asyncHandler(ctrl.resetPassword));

// Google
router.post("/google", authLimiter, validate({ body: googleAuthSchema }), asyncHandler(ctrl.googleAuth));

// Tokens
router.post("/refresh", asyncHandler(ctrl.refreshToken));
router.post("/logout", asyncHandler(ctrl.logout));
router.post("/logout-all", requireWebUser, asyncHandler(ctrl.logoutAll));

// Current user
router.get("/me", requireWebUser, asyncHandler(ctrl.me));

export default router;
