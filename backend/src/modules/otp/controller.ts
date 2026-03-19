import type { Request, Response } from "express";
import { ok } from "../../lib/apiResponse.js";
import * as otpService from "./service.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export async function sendOtp(req: Request, res: Response) {
  try {
    const { identifier, type, isEmail } = req.body;

    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: identifier, type",
      });
    }

    const validTypes = ["PHONE_LOGIN", "EMAIL_LOGIN", "EMAIL_VERIFY", "PASSWORD_RESET"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP type",
      });
    }

    const result = await otpService.generateOtp(identifier, type, isEmail === true);

    return ok(res, "OTP sent successfully", {
      expiresAt: result.expiresAt,
      message: isEmail ? "Check your email for OTP" : "OTP sent to your phone",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { identifier, code, type } = req.body;

    if (!identifier || !code || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: identifier, code, type",
      });
    }

    const validTypes = ["PHONE_LOGIN", "EMAIL_LOGIN", "EMAIL_VERIFY", "PASSWORD_RESET"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP type",
      });
    }

    await otpService.verifyOtp(identifier, code, type);

    return ok(res, "OTP verified successfully", {
      verified: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid") || error.message.includes("expired")) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
}
