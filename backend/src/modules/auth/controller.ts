import type { Request, Response } from "express";
import { ok, created } from "../../lib/apiResponse.js";
import { env } from "../../config/env.js";
import * as authService from "./service.js";

function getMeta(req: Request) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.ip ?? req.socket.remoteAddress,
  };
}

function setRefreshCookie(res: Response, token: string, maxAge: number) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/api/auth",
    maxAge,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth" });
}

// ─── OTP ───

export async function sendOtp(req: Request, res: Response) {
  const { identifier, type } = req.body;
  const result = await authService.sendOtp(identifier, type);
  return ok(res, result.message);
}

export async function verifyPhoneLogin(req: Request, res: Response) {
  const { identifier, code } = req.body;
  const result = await authService.loginWithPhone(identifier, code, getMeta(req));
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return ok(res, "Phone login successful", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

// ─── Email ───

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const result = await authService.registerWithEmail(email, password, name, "BUYER", getMeta(req));
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return created(res, "Registration successful. Please verify your email.", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

export async function registerSeller(req: Request, res: Response) {
  const { email, password, name, phone, companyName, businessType, address, city, state, pincode } = req.body;
  const result = await authService.registerAsSeller(
    { email, password, name, phone, companyName, businessType, address, city, state, pincode },
    getMeta(req),
  );
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return created(res, "Seller registration successful. Awaiting admin approval.", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

export async function loginEmail(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.loginWithEmail(email, password, getMeta(req));
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return ok(res, "Login successful", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

export async function verifyEmail(req: Request, res: Response) {
  const { identifier, code } = req.body;
  const result = await authService.verifyEmail(identifier, code);
  return ok(res, result.message);
}

// ─── Password Reset ───

export async function forgotPassword(req: Request, res: Response) {
  const { identifier } = req.body;
  const result = await authService.requestPasswordReset(identifier);
  return ok(res, result.message);
}

export async function resetPassword(req: Request, res: Response) {
  const { identifier, code, newPassword } = req.body;
  const result = await authService.resetPassword(identifier, code, newPassword);
  clearRefreshCookie(res);
  return ok(res, result.message);
}

// ─── Google ───

export async function googleAuth(req: Request, res: Response) {
  const { idToken } = req.body;
  const result = await authService.loginWithGoogle(idToken, getMeta(req));
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return ok(res, "Google login successful", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

// ─── Token Refresh ───

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "No refresh token provided" });
  }
  const result = await authService.refreshAccessToken(token, getMeta(req));
  setRefreshCookie(res, result.refreshToken, result.refreshExpiresMs);
  return ok(res, "Token refreshed", {
    accessToken: result.accessToken,
    user: result.user,
  });
}

// ─── Logout ───

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (token) await authService.logout(token);
  clearRefreshCookie(res);
  return ok(res, "Logged out successfully");
}

export async function logoutAll(req: Request, res: Response) {
  const userId = req.webUser!.sub;
  await authService.logoutAll(userId);
  clearRefreshCookie(res);
  return ok(res, "All sessions logged out");
}

// ─── Current User ───

export async function me(req: Request, res: Response) {
  const userId = req.webUser!.sub;
  const { prisma } = await import("../../lib/prisma.js");
  const user = await prisma.websiteUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      avatar: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });
  return ok(res, "Current user", user);
}
