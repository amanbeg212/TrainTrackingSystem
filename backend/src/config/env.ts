import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  railRadarApiKey: process.env.RAILRADAR_API_KEY || '',
  mapTilerApiKey: process.env.MAPTILER_API_KEY || '',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  openTopographyApiKey: process.env.OPENTOPOGRAPHY_API_KEY || '',
  overpassBaseUrl: process.env.OVERPASS_BASE_URL || 'https://overpass-api.de/api/interpreter',
  cacheTtl: {
    search: 10 * 60, // 10 mins
    liveStatus: 30, // 30 secs
    route: 24 * 3600, // 24 hours
    weather: 10 * 60, // 10 mins
    geo: 60 * 60, // 1 hour
    terrain: 24 * 3600, // 24 hours
  }
};
