import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { requestIdMiddleware } from './middleware/requestId.js';
import { securityHeadersMiddleware } from './middleware/securityHeaders.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import trainsRouter from './routes/trains.js';
import journeyRouter from './routes/journey.js';
import analyticsRouter from './routes/analytics.js';
import weatherRouter from './routes/weather.js';
import geoRouter from './routes/geo.js';
import shareRouter from './routes/share.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(securityHeadersMiddleware);
  app.use(express.json());
  app.use(requestIdMiddleware);

  // Global rate limit: 120 requests per minute per IP
  app.use(rateLimitMiddleware({ maxRequests: 120, windowMs: 60 * 1000 }));

  // API Routes
  app.use('/api/trains', trainsRouter);
  app.use('/api/trains', journeyRouter);
  app.use('/api/journeys', analyticsRouter);
  app.use('/api/weather', weatherRouter);
  app.use('/api/geo', geoRouter);
  app.use('/api/share', shareRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Frontend Static Files & SPA Fallback
  const possibleDistPaths = [
    path.resolve(process.cwd(), 'frontend/dist'),
    path.resolve(process.cwd(), '../frontend/dist'),
    path.resolve(process.cwd(), 'client/dist'),
    path.resolve(process.cwd(), '../client/dist'),
    path.resolve(process.cwd(), 'dist/frontend'),
  ];

  const frontendDistPath = possibleDistPaths.find((p) => fs.existsSync(p));

  if (frontendDistPath) {
    app.use(express.static(frontendDistPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    // Helpful landing page if dist hasn't been built
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>RailGaadi API Server</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
              .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; max-width: 480px; text-align: center; }
              h1 { color: #4f46e5; margin-top: 0; font-size: 1.75rem; }
              p { color: #64748b; line-height: 1.6; font-size: 0.95rem; }
              .btn { display: inline-block; background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; margin-top: 1rem; transition: background 0.2s; }
              .btn:hover { background: #4338ca; }
              .badge { display: inline-block; background: #ecfdf5; color: #059669; font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 1rem; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">● Server Online (Port 4000)</span>
              <h1>RailGaadi Backend</h1>
              <p>The backend API server is running smoothly. To access the interactive web interface, open the frontend development server:</p>
              <a href="http://localhost:3000" class="btn">Open Web App (localhost:3000)</a>
            </div>
          </body>
        </html>
      `);
    });
  }

  // Error handling
  app.use(errorHandler);

  return app;
}
