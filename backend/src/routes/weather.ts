import { Router, Request, Response, NextFunction } from 'express';
import { getWeatherForCoords } from '../providers/openweather/weather.js';
import { getCompanionDataService } from '../services/companionService.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 28.6143;
    const lng = parseFloat(req.query.lng as string) || 77.2183;
    const trainNumber = req.query.trainNumber as string;

    if (trainNumber) {
      const companion = await getCompanionDataService(trainNumber);
      res.json({ data: companion.weather });
      return;
    }

    const weather = await getWeatherForCoords(lat, lng);
    res.json({ data: weather });
  } catch (error) {
    next(error);
  }
});

export default router;
