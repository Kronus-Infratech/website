import { z } from "zod";

export const sendOtpSchema = z.object({
  identifier: z.string().min(1, "Phone or email is required"),
  type: z.enum(["PHONE_LOGIN", "EMAIL_LOGIN", "EMAIL_VERIFY", "PASSWORD_RESET"]),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1),
  type: z.enum(["PHONE_LOGIN", "EMAIL_LOGIN", "EMAIL_VERIFY", "PASSWORD_RESET"]),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const registerEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export const resetPasswordSchema = z.object({
  identifier: z.string().min(1),
  code: z.string().length(6),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const refreshTokenSchema = z.object({
  // Refresh token comes from httpOnly cookie, but allow body as fallback
  refreshToken: z.string().optional(),
});
