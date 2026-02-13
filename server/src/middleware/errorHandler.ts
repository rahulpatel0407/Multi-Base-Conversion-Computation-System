import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const httpError = (status: number, code: string, message: string): ApiError => {
  const err = new Error(message) as ApiError;
  err.status = status;
  err.code = code;
  return err;
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  // Express requires 4-arg signature for error middleware
  _next: NextFunction,
) => {
  const status = err.status ?? 500;
  res.status(status).json({
    error: err.code || 'ServerError',
    message: err.message || 'Unexpected error',
    status,
  });
};
