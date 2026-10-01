import { Train, Journey, RouteGeometry, JourneyAnalytics, WeatherSnapshot, WeatherForecastItem, GeographicFeature } from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
  }
  const body = await res.json();
  return body.data as T;
}

export const api = {
  searchTrains: (query: string): Promise<Train[]> => {
    if (!query.trim()) return Promise.resolve([]);
    return fetchJson<Train[]>(`${BASE_URL}/trains/search?q=${encodeURIComponent(query)}`);
  },

  getLiveStatus: (trainNumber: string): Promise<Journey> => {
    return fetchJson<Journey>(`${BASE_URL}/trains/${encodeURIComponent(trainNumber)}/status`);
  },

  getRouteGeometry: (trainNumber: string): Promise<RouteGeometry> => {
    return fetchJson<RouteGeometry>(`${BASE_URL}/trains/${encodeURIComponent(trainNumber)}/route`);
  },

  getAnalytics: (trainNumber: string): Promise<JourneyAnalytics> => {
    return fetchJson<JourneyAnalytics>(`${BASE_URL}/journeys/${encodeURIComponent(trainNumber)}/analytics`);
  },

  getWeather: (trainNumber: string, lat?: number, lng?: number): Promise<{ current: WeatherSnapshot; forecast: WeatherForecastItem[] }> => {
    const query = trainNumber ? `trainNumber=${encodeURIComponent(trainNumber)}` : `lat=${lat}&lng=${lng}`;
    return fetchJson<{ current: WeatherSnapshot; forecast: WeatherForecastItem[] }>(`${BASE_URL}/weather?${query}`);
  },

  getNearbyGeo: (trainNumber: string, lat?: number, lng?: number): Promise<GeographicFeature[]> => {
    const query = trainNumber ? `trainNumber=${encodeURIComponent(trainNumber)}` : `lat=${lat}&lng=${lng}`;
    return fetchJson<GeographicFeature[]>(`${BASE_URL}/geo/nearby?${query}`);
  },

  createShareLink: (trainNumber: string): Promise<{ journeyId: string; trainNumber: string; urlPath: string }> => {
    return fetchJson<{ journeyId: string; trainNumber: string; urlPath: string }>(`${BASE_URL}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainNumber }),
    });
  },

  getSharedJourney: (journeyId: string): Promise<{ journeyId: string; trainNumber: string; createdAt: string }> => {
    return fetchJson<{ journeyId: string; trainNumber: string; createdAt: string }>(`${BASE_URL}/share/${encodeURIComponent(journeyId)}`);
  },
};
