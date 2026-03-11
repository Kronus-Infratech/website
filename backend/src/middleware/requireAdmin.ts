import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import { verifyAdminToken } from "../lib/jwt.js";

/**
 * Require a valid CRM admin token in the Authorization header.
 * Sets `req.adminUser` with the token payload.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing admin access token"));
  }

  try {
    const token = header.slice(7);
    req.adminUser = verifyAdminToken(token);
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired admin token"));
  }
}

/**
 * Restrict access to specific CRM roles.
 */
export function requireRoles(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.adminUser) {
      return next(AppError.unauthorized("Admin authentication required"));
    }
    const hasRole = req.adminUser.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return next(AppError.forbidden("Insufficient permissions"));
    }
    next();
  };
}
