import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import { verifyAccessToken } from "../lib/jwt.js";

/**
 * Require a valid website-user access token in the Authorization header.
 * Sets `req.webUser` with the token payload.
 */
export function requireWebUser(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing or malformed access token"));
  }

  try {
    const token = header.slice(7);
    req.webUser = verifyAccessToken(token);
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired access token"));
  }
}

/**
 * Optionally attach web user if token is present (no error if missing).
 */
export function optionalWebUser(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.webUser = verifyAccessToken(header.slice(7));
    } catch {
      // Silently ignore invalid tokens
    }
  }
  next();
}
