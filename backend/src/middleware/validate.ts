import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Validate request body, query, and/or params against Zod schemas.
 * Parsed values are stored on `req.validated` (Express 5 makes query/params read-only).
 */

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export function validate(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = {};
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
        req.validated.body = req.body;
      }
      if (schemas.query) {
        req.validated.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.validated.params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: String(e.path.join(".")),
          message: e.message,
        }));
        return next({
          statusCode: 400,
          isOperational: true,
          message: "Validation failed",
          errors,
        });
      }
      next(err);
    }
  };
}
