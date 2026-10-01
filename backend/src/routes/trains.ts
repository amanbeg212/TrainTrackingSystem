import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { searchTrainsService } from '../services/journeyService.js';

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1).max(50).trim(),
});

router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = searchSchema.safeParse(req.query);
    if (!parseResult.success) {
      res.json({ data: [], meta: { query: req.query.q || '' } });
      return;
    }

    const { q } = parseResult.data;
    const data = await searchTrainsService(q);
    res.json({ data, meta: { query: q } });
  } catch (error) {
    next(error);
  }
});

export default router;
