import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  type: "access";
  role?: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  type: "refresh";
  jti: string;
}

export interface AdminTokenPayload extends JwtPayload {
  sub: string;
  type: "admin";
  roles: string[];
}

function sign(payload: object, secret: string, options: SignOptions): string {
  return jwt.sign(payload, secret, options);
}

function verify<T extends JwtPayload>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}

/** Issue a short-lived access token for website users */
export function signAccessToken(userId: string): string {
  return sign({ sub: userId, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
  });
}

/** Issue a refresh token with a unique jti */
export function signRefreshToken(userId: string, jti: string): string {
  return sign({ sub: userId, type: "refresh", jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
  });
}

/** Issue an admin access token for CRM staff */
export function signAdminToken(userId: string, roles: string[]): string {
  return sign({ sub: userId, type: "admin", roles }, env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = verify<AccessTokenPayload>(token, env.JWT_ACCESS_SECRET);
  if (decoded.type !== "access") throw new Error("Invalid token type");
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = verify<RefreshTokenPayload>(token, env.JWT_REFRESH_SECRET);
  if (decoded.type !== "refresh") throw new Error("Invalid token type");
  return decoded;
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  const decoded = verify<AdminTokenPayload>(token, env.JWT_ACCESS_SECRET);
  if (decoded.type !== "admin") throw new Error("Invalid token type");
  return decoded;
}

/** Parse "7d" / "15m" / "1h" → milliseconds for cookie maxAge */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(s|m|h|d)$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 3600 * 1000,
    d: 86400 * 1000,
  };
  return value * multipliers[unit];
}
