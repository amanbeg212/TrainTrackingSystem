import { Router, Request, Response, NextFunction } from 'express';
import { getJourneyAnalyticsService } from '../services/analyticsService.js';
import { getElevationProfile } from '../providers/opentopography/elevation.js';

const router = Router();

router.get('/:trainNumber/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trainNumber } = req.params;
    const data = await getJourneyAnalyticsService(trainNumber);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/terrain/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainNumber = (req.query.routeId as string) || (req.query.trainNumber as string) || "12951";
    const data = await getElevationProfile(trainNumber);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
