import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const clientIpRecords = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of clientIpRecords.entries()) {
    if (now > record.resetTime) {
      clientIpRecords.delete(ip);
    }
  }
}, 60 * 1000).unref();

export function rateLimitMiddleware(options: { maxRequests: number; windowMs: number }) {
  const { maxRequests, windowMs } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = clientIpRecords.get(ip);

    if (!record || now > record.resetTime) {
      clientIpRecords.set(ip, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      next();
      return;
    }

    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        },
      });
      return;
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
    next();
  };
}
