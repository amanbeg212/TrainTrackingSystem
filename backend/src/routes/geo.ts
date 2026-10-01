import { Router, Request, Response, NextFunction } from 'express';
import { getNearbyGeographicFeatures } from '../providers/overpass/geo.js';
import { getCompanionDataService } from '../services/companionService.js';

const router = Router();

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainNumber = req.query.trainNumber as string;
    if (trainNumber) {
      const companion = await getCompanionDataService(trainNumber);
      res.json({ data: companion.features });
      return;
    }

    const lat = parseFloat(req.query.lat as string) || 28.6143;
    const lng = parseFloat(req.query.lng as string) || 77.2183;
    const radius = parseFloat(req.query.radius as string) || 50;

    const data = await getNearbyGeographicFeatures(lat, lng, radius);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;
