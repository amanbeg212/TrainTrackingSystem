import { RouteGeometry, StationReference } from '../../types/train.js';
import { config } from '../../config/env.js';

const BASE_URL = 'https://api.railradar.in/v1';

function getHeaders() {
  return {
    'Authorization': `Bearer ${config.railRadarApiKey}`,
    'Accept': 'application/json',
  };
}

/**
 * Map a single RailRadar route stop to our StationReference type
 */
function mapStop(stop: any): StationReference {
  const st = stop.station ?? {};
  return {
    code: st.code ?? 'UNK',
    name: st.name ?? 'Unknown Station',
    city: st.name,
    latitude: st.lat ?? 20.5937,
    longitude: st.lng ?? 78.9629,
    scheduledArrival: stop.arrival ?? undefined,
    scheduledDeparture: stop.departure ?? undefined,
    platform: stop.platform ?? undefined,
    distanceKm: stop.distance ?? 0,
    elevationMeters: undefined,
  };
}

export interface RouteResult extends RouteGeometry {
  waypointCoordsMap: Record<string, { lat: number; lng: number }>;
}

/**
 * Fetch full train route geometry from RailRadar API.
 * Endpoint: GET /v1/trains/:trainNumber
 * Returns route with all stations + lat/lng coordinates.
 */
export async function getTrainRoute(trainNumber: string): Promise<RouteGeometry> {
  const result = await getTrainRouteDetails(trainNumber);
  return {
    trainNumber: result.trainNumber,
    distanceKm: result.distanceKm,
    stations: result.stations,
    route: result.route,
  };
}

export async function getTrainRouteDetails(trainNumber: string): Promise<RouteResult> {
  try {
    const res = await fetch(`${BASE_URL}/trains/${trainNumber}`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const body = await res.json() as any;
      if (body.success && body.data) {
        const data = body.data;
        const t = data.train ?? {};
        const rawRoute: any[] = data.route ?? [];

        if (rawRoute.length > 0) {
          const waypointCoordsMap: Record<string, { lat: number; lng: number }> = {};
          for (const r of rawRoute) {
            const code = r.station?.code;
            const lat = r.station?.lat;
            const lng = r.station?.lng;
            if (code && typeof lat === 'number' && typeof lng === 'number') {
              waypointCoordsMap[code] = { lat, lng };
            }
          }

          // Build high-resolution GeoJSON LineString coordinates from all waypoints [lng, lat]
          const coordinates: [number, number][] = rawRoute
            .filter((r: any) => typeof r.station?.lng === 'number' && typeof r.station?.lat === 'number')
            .map((r: any) => [r.station.lng, r.station.lat] as [number, number]);

          // Filter stations to ONLY halting stops (plus origin & destination)
          const haltStops = rawRoute.filter((r: any, idx: number) =>
            r.isHalt === true || idx === 0 || idx === rawRoute.length - 1
          );

          const stations = (haltStops.length > 0 ? haltStops : rawRoute).map(mapStop);
          const totalDistance = stations[stations.length - 1].distanceKm ?? t.distance ?? 1000;

          return {
            trainNumber,
            distanceKm: totalDistance,
            stations,
            route: {
              type: 'LineString',
              coordinates: coordinates.length > 0 ? coordinates : stations.map((s) => [s.longitude, s.latitude]),
            },
            waypointCoordsMap,
          };
        }
      }
    }
  } catch (err) {
    // API error — fall through to generic fallback
  }

  // Fallback: return a minimal route so the UI doesn't crash
  const fallback = buildGenericFallbackRoute(trainNumber);
  return {
    ...fallback,
    waypointCoordsMap: {
      NDLS: { lat: 28.6143, lng: 77.2183 },
      HWH: { lat: 22.5851, lng: 88.3415 },
    },
  };
}

/**
 * Generic fallback route centered on India, used when API call fails.
 * This prevents the server from crashing; the UI shows degraded data.
 */
function buildGenericFallbackRoute(trainNumber: string): RouteGeometry {
  const stations: StationReference[] = [
    {
      code: 'NDLS', name: 'New Delhi', city: 'Delhi',
      latitude: 28.6143, longitude: 77.2183,
      scheduledDeparture: '08:00', distanceKm: 0,
    },
    {
      code: 'HWH', name: 'Howrah Junction', city: 'Kolkata',
      latitude: 22.5851, longitude: 88.3415,
      scheduledArrival: '22:30', distanceKm: 1447,
    },
  ];
  return {
    trainNumber,
    distanceKm: 1447,
    stations,
    route: {
      type: 'LineString',
      coordinates: stations.map((s) => [s.longitude, s.latitude]),
    },
  };
}
