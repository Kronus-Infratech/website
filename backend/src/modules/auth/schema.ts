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

export const registerSellerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  companyName: z.string().min(2, "Company name required"),
  businessType: z.string().min(2, "Business type required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
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
