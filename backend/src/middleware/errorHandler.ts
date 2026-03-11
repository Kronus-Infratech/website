import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import { logger } from "../lib/logger.js";
import { env } from "../config/env.js";

interface ErrorResponseBody {
  success: false;
  message: string;
  code?: string;
  errors?: unknown;
  stack?: string;
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Already-structured validation errors from validate middleware
  if (typeof err === "object" && err !== null && "statusCode" in err && "errors" in err) {
    const structured = err as { statusCode: number; message: string; errors: unknown };
    res.status(structured.statusCode).json({
      success: false,
      message: structured.message,
      errors: structured.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    const body: ErrorResponseBody = {
      success: false,
      message: err.message,
      code: err.code,
    };
    if (env.NODE_ENV === "development") body.stack = err.stack;
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown / programmer errors
  const error = err instanceof Error ? err : new Error(String(err));
  logger.error({ err: error }, "Unhandled error");

  const body: ErrorResponseBody = {
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : error.message,
  };
  if (env.NODE_ENV === "development") body.stack = error.stack;
  res.status(500).json(body);
}
