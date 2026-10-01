import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { cacheManager } from '../cache/cacheManager.js';

const router = Router();

const shareSchema = z.object({
  trainNumber: z.string().min(1),
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = shareSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'trainNumber is required' } });
      return;
    }

    const { trainNumber } = parseResult.data;
    const publicId = `j_${trainNumber}_${Math.random().toString(36).substring(2, 9)}`;

    cacheManager.set(`share:${publicId}`, { trainNumber, createdAt: new Date().toISOString() }, 7 * 24 * 3600);

    res.json({
      data: {
        journeyId: publicId,
        trainNumber,
        urlPath: `/journey/${publicId}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:journeyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { journeyId } = req.params;
    const sharedData = cacheManager.get<{ trainNumber: string; createdAt: string }>(`share:${journeyId}`);

    if (!sharedData) {
      res.status(404).json({ error: { code: 'JOURNEY_NOT_FOUND', message: 'Shared journey not found or expired' } });
      return;
    }

    res.json({
      data: {
        journeyId,
        trainNumber: sharedData.trainNumber,
        createdAt: sharedData.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
