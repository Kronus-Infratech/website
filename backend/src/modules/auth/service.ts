import { nanoid } from "nanoid";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import { hashPassword, comparePassword } from "../../lib/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  parseDuration,
} from "../../lib/jwt.js";
import { env } from "../../config/env.js";
import { generateOtp, otpProvider } from "../../providers/otp.js";
import { verifyGoogleToken } from "../../providers/google.js";
import type { OtpType } from "../../../generated/prisma/index.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

// ─────────────────────────────────────────
// OTP
// ─────────────────────────────────────────

export async function sendOtp(identifier: string, type: OtpType) {
  // Invalidate previous OTPs for this identifier + type
  await prisma.otpToken.deleteMany({ where: { identifier, type } });

  const code = generateOtp();
  await prisma.otpToken.create({
    data: {
      identifier,
      type,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    },
  });

  await otpProvider.send(identifier, code);
  return { message: "OTP sent successfully" };
}

export async function verifyOtp(identifier: string, type: OtpType, code: string) {
  const otpRecord = await prisma.otpToken.findFirst({
    where: { identifier, type },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw AppError.badRequest("No OTP found. Please request a new one.");
  }

  if (otpRecord.expiresAt < new Date()) {
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });
    throw AppError.badRequest("OTP has expired. Please request a new one.");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.otpToken.delete({ where: { id: otpRecord.id } });
    throw AppError.tooMany("Too many failed attempts. Please request a new OTP.");
  }

  if (otpRecord.code !== code) {
    await prisma.otpToken.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    throw AppError.badRequest("Invalid OTP code");
  }

  // OTP valid — delete it
  await prisma.otpToken.delete({ where: { id: otpRecord.id } });
  return true;
}

// ─────────────────────────────────────────
// Phone Auth
// ─────────────────────────────────────────

export async function loginWithPhone(phone: string, code: string, meta: { userAgent?: string; ip?: string }) {
  await verifyOtp(phone, "PHONE_LOGIN", code);

  // Find or create website user
  let user = await prisma.websiteUser.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.websiteUser.create({
      data: { phone, isPhoneVerified: true },
    });
  } else if (!user.isPhoneVerified) {
    user = await prisma.websiteUser.update({
      where: { id: user.id },
      data: { isPhoneVerified: true },
    });
  }

  if (!user.isActive) throw AppError.forbidden("Account is deactivated");

  return issueTokens(user.id, meta);
}

// ─────────────────────────────────────────
// Email Auth
// ─────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
  meta: { userAgent?: string; ip?: string },
) {
  const existing = await prisma.websiteUser.findUnique({ where: { email } });
  if (existing) throw AppError.conflict("Email already registered");

  const passwordHash = await hashPassword(password);
  const user = await prisma.websiteUser.create({
    data: { email, passwordHash, name, isEmailVerified: false },
  });

  // Send verification OTP
  await sendOtp(email, "EMAIL_VERIFY");

  return issueTokens(user.id, meta);
}

export async function loginWithEmail(
  email: string,
  password: string,
  meta: { userAgent?: string; ip?: string },
) {
  const user = await prisma.websiteUser.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw AppError.unauthorized("Invalid email or password");
  }
  if (!user.isActive) throw AppError.forbidden("Account is deactivated");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  return issueTokens(user.id, meta);
}

export async function verifyEmail(email: string, code: string) {
  await verifyOtp(email, "EMAIL_VERIFY", code);
  await prisma.websiteUser.update({
    where: { email },
    data: { isEmailVerified: true },
  });
  return { message: "Email verified successfully" };
}

// ─────────────────────────────────────────
// Password Reset
// ─────────────────────────────────────────

export async function requestPasswordReset(identifier: string) {
  const user = await prisma.websiteUser.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });
  if (!user) {
    // Don't reveal whether account exists
    return { message: "If an account exists, a reset code has been sent." };
  }
  await sendOtp(identifier, "PASSWORD_RESET");
  return { message: "If an account exists, a reset code has been sent." };
}

export async function resetPassword(identifier: string, code: string, newPassword: string) {
  await verifyOtp(identifier, "PASSWORD_RESET", code);

  const passwordHash = await hashPassword(newPassword);
  await prisma.websiteUser.updateMany({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    data: { passwordHash },
  });

  // Invalidate all refresh tokens for security
  const user = await prisma.websiteUser.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });
  if (user) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  }

  return { message: "Password reset successfully" };
}

// ─────────────────────────────────────────
// Google OAuth
// ─────────────────────────────────────────

export async function loginWithGoogle(idToken: string, meta: { userAgent?: string; ip?: string }) {
  const googleUser = await verifyGoogleToken(idToken);

  // Check by googleId first, then email
  let user = await prisma.websiteUser.findUnique({ where: { googleId: googleUser.googleId } });

  if (!user && googleUser.email) {
    user = await prisma.websiteUser.findUnique({ where: { email: googleUser.email } });
    if (user) {
      // Link Google to existing account
      user = await prisma.websiteUser.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.googleId,
          avatar: user.avatar ?? googleUser.avatar,
          isEmailVerified: true,
          name: user.name ?? googleUser.name,
        },
      });
    }
  }

  if (!user) {
    user = await prisma.websiteUser.create({
      data: {
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name,
        avatar: googleUser.avatar,
        isEmailVerified: googleUser.emailVerified,
      },
    });
  }

  if (!user.isActive) throw AppError.forbidden("Account is deactivated");

  return issueTokens(user.id, meta);
}

// ─────────────────────────────────────────
// Token Management
// ─────────────────────────────────────────

async function issueTokens(userId: string, meta: { userAgent?: string; ip?: string }) {
  const accessToken = signAccessToken(userId);
  const jti = nanoid();
  const refreshToken = signRefreshToken(userId, jti);

  const refreshExpiresMs = parseDuration(env.JWT_REFRESH_EXPIRES_IN);

  await prisma.refreshToken.create({
    data: {
      token: jti,
      userId,
      userAgent: meta.userAgent,
      ip: meta.ip,
      expiresAt: new Date(Date.now() + refreshExpiresMs),
    },
  });

  const user = await prisma.websiteUser.findUnique({
    where: { id: userId },
    select: { id: true, email: true, phone: true, name: true, avatar: true, isEmailVerified: true, isPhoneVerified: true },
  });

  return { accessToken, refreshToken, refreshExpiresMs, user };
}

export async function refreshAccessToken(refreshTokenStr: string, meta: { userAgent?: string; ip?: string }) {
  const payload = verifyRefreshToken(refreshTokenStr);

  const stored = await prisma.refreshToken.findFirst({
    where: { token: payload.jti, userId: payload.sub },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw AppError.unauthorized("Refresh token expired or revoked");
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  return issueTokens(payload.sub, meta);
}

export async function logout(refreshTokenStr: string) {
  try {
    const payload = verifyRefreshToken(refreshTokenStr);
    await prisma.refreshToken.deleteMany({ where: { token: payload.jti } });
  } catch {
    // Token already invalid — that's fine
  }
  return { message: "Logged out successfully" };
}

export async function logoutAll(userId: string) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
  return { message: "All sessions logged out" };
}
