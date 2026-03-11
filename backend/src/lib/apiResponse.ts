import type { Response } from "express";

interface ApiResponseOptions<T> {
  res: Response;
  status: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export function apiResponse<T>({ res, status, success, message, data, meta }: ApiResponseOptions<T>) {
  const body: Record<string, unknown> = { success, message };
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;
  return res.status(status).json(body);
}

export function ok<T>(res: Response, message: string, data?: T, meta?: Record<string, unknown>) {
  return apiResponse({ res, status: 200, success: true, message, data, meta });
}

export function created<T>(res: Response, message: string, data?: T) {
  return apiResponse({ res, status: 201, success: true, message, data });
}

export function noContent(res: Response) {
  return res.status(204).send();
}
