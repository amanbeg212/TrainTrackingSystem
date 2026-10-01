import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/api.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = (req as any).requestId;
  console.error(`[Error] Request ID ${requestId}:`, err);

  const status = err.status || err.statusCode || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'An unexpected error occurred';

  const response: ApiError = {
    error: {
      code,
      message,
      requestId,
      ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
    },
  };

  res.status(status).json(response);
}
