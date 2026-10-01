import { getLiveTrainStatus } from '../providers/railradar/status.js';
import { getWeatherForCoords } from '../providers/openweather/weather.js';
import { getNearbyGeographicFeatures } from '../providers/overpass/geo.js';
import { WeatherSnapshot, WeatherForecastItem, GeographicFeature } from '../types/train.js';

export async function getCompanionDataService(trainNumber: string): Promise<{
  weather: { current: WeatherSnapshot; forecast: WeatherForecastItem[] };
  features: GeographicFeature[];
}> {
  const journey = await getLiveTrainStatus(trainNumber);
  const lat = journey.position.latitude;
  const lng = journey.position.longitude;
  const stationName = journey.currentStation?.name || journey.train.name;

  const weather = await getWeatherForCoords(lat, lng, stationName);
  const features = await getNearbyGeographicFeatures(lat, lng);

  return { weather, features };
}
