import type { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler so thrown / rejected errors
 * are forwarded to Express's built-in error handler.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
