import { Router, Request, Response, NextFunction } from 'express';
import { getLiveStatusService, getRouteService } from '../services/journeyService.js';

const router = Router();

router.get('/:trainNumber/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trainNumber } = req.params;
    const data = await getLiveStatusService(trainNumber);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/:trainNumber/route', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trainNumber } = req.params;
    const data = await getRouteService(trainNumber);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
