import { GeographicFeature } from '../../types/train.js';
import { config } from '../../config/env.js';

export async function getNearbyGeographicFeatures(
  lat: number,
  lng: number,
  radiusKm: number = 50
): Promise<GeographicFeature[]> {
  const radiusMeters = radiusKm * 1000;

  // Overpass QL query: find rivers, mountains, historic sites, tourist attractions
  const query = `
[out:json][timeout:15];
(
  node["natural"="water"]["water"="river"](around:${radiusMeters},${lat},${lng});
  way["natural"="water"]["water"="river"](around:${radiusMeters},${lat},${lng});
  node["natural"="peak"](around:${radiusMeters},${lat},${lng});
  node["historic"="monument"](around:${radiusMeters},${lat},${lng});
  node["historic"="fort"](around:${radiusMeters},${lat},${lng});
  node["historic"="castle"](around:${radiusMeters},${lat},${lng});
  node["tourism"="attraction"]["name"](around:${radiusMeters},${lat},${lng});
  node["railway"="bridge"](around:${radiusMeters},${lat},${lng});
  node["tunnel"="yes"](around:${radiusMeters},${lat},${lng});
);
out body 20;
  `.trim();

  try {
    const res = await fetch(config.overpassBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(18000),
    });

    if (res.ok) {
      const body = await res.json() as any;
      const elements: any[] = body.elements ?? [];

      const features: GeographicFeature[] = elements
        .filter((el: any) => el.tags?.name)
        .map((el: any, idx: number): GeographicFeature => {
          const elLat = el.lat ?? el.center?.lat ?? lat;
          const elLng = el.lon ?? el.center?.lon ?? lng;
          return {
            id: `ovp_${el.id ?? idx}`,
            category: inferCategory(el.tags),
            name: el.tags.name,
            latitude: elLat,
            longitude: elLng,
            distanceKm: Math.round(haversineDistanceKm(lat, lng, elLat, elLng) * 10) / 10,
            description: el.tags['description:en'] ?? el.tags.description ?? undefined,
          };
        })
        .filter((f) => f.name.length > 1)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 8);

      if (features.length > 0) return features;
    }
  } catch (_) {
    // Fall through to static catalog
  }

  // Static fallback catalog (used when Overpass is unavailable)
  return getStaticFallback(lat, lng);
}

function inferCategory(tags: Record<string, string>): GeographicFeature['category'] {
  if (tags.natural === 'peak') return 'MOUNTAIN';
  if (tags.natural === 'water' || tags.waterway) return 'RIVER';
  if (tags.historic === 'fort' || tags.historic === 'castle') return 'FORT';
  if (tags.historic === 'monument') return 'MONUMENT';
  if (tags.railway === 'bridge') return 'BRIDGE';
  if (tags.tunnel) return 'TUNNEL';
  if (tags.tourism === 'attraction') return 'ATTRACTION';
  if (tags.natural === 'wetland' || tags.water === 'lake') return 'LAKE';
  return 'ATTRACTION';
}

function getStaticFallback(lat: number, lng: number): GeographicFeature[] {
  const catalog: Omit<GeographicFeature, 'distanceKm'>[] = [
    { id: 'geo_1', category: 'RIVER', name: 'Narmada River Rail Bridge', latitude: 21.7051, longitude: 72.9959, description: 'Historic 1.4km railway bridge crossing the Narmada River near Bharuch.' },
    { id: 'geo_2', category: 'RIVER', name: 'Yamuna River Rail Bridge', latitude: 27.1800, longitude: 78.0200, description: 'Major river bridge along the North Central Railway corridor.' },
    { id: 'geo_3', category: 'GHAT', name: 'Western Ghats (Sahyadri Range)', latitude: 19.1200, longitude: 73.4000, description: 'UNESCO World Heritage mountain range featuring scenic rail viaducts and tunnels.' },
    { id: 'geo_4', category: 'TUNNEL', name: 'Karbude Railway Tunnel', latitude: 17.0500, longitude: 73.3500, description: '6.5 km Konkan Railway engineering marvel tunnel.' },
    { id: 'geo_5', category: 'MONUMENT', name: 'Chhatrapati Shivaji Maharaj Terminus', latitude: 18.9400, longitude: 72.8353, description: 'Victorian Gothic UNESCO World Heritage landmark.' },
    { id: 'geo_6', category: 'MONUMENT', name: 'Taj Mahal', latitude: 27.1751, longitude: 78.0421, description: 'Iconic marble mausoleum visible near Agra Cantt approach.' },
    { id: 'geo_7', category: 'FORT', name: 'Gwalior Fort', latitude: 26.2295, longitude: 78.1652, description: 'Hilltop fortress overlooking the railway lines.' },
    { id: 'geo_8', category: 'MOUNTAIN', name: 'Vindhyachal Mountain Range', latitude: 24.5000, longitude: 78.0000, description: 'Ancient plateau range dividing Northern and Peninsular India.' },
  ];

  return catalog
    .map((item) => ({ ...item, distanceKm: Math.round(haversineDistanceKm(lat, lng, item.latitude, item.longitude) * 10) / 10 }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5);
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
