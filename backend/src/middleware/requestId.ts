import { Request, Response, NextFunction } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const reqId = req.headers['x-request-id'] as string || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  (req as any).requestId = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}
