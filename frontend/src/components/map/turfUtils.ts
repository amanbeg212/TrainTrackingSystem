import * as turf from '@turf/turf';
import { StationReference } from '../../types';

export function calculateRouteProgress(
  coordinates: [number, number][],
  trainPosition: [number, number]
): {
  completedRoute: [number, number][];
  remainingRoute: [number, number][];
  distanceKm: number;
} {
  if (!coordinates || coordinates.length < 2) {
    return { completedRoute: [], remainingRoute: [], distanceKm: 0 };
  }

  try {
    const line = turf.lineString(coordinates);
    const trainPoint = turf.point(trainPosition);

    // Find nearest point on line
    const snapped = turf.nearestPointOnLine(line, trainPoint);
    const lineChunk = turf.lineSlice(turf.point(coordinates[0]), snapped, line);
    const lineRemaining = turf.lineSlice(snapped, turf.point(coordinates[coordinates.length - 1]), line);

    return {
      completedRoute: lineChunk.geometry.coordinates as [number, number][],
      remainingRoute: lineRemaining.geometry.coordinates as [number, number][],
      distanceKm: Math.round(turf.length(line, { units: 'kilometers' })),
    };
  } catch (e) {
    // Fallback if turf slicing fails
    const idx = Math.floor(coordinates.length / 2);
    return {
      completedRoute: coordinates.slice(0, idx + 1),
      remainingRoute: coordinates.slice(idx),
      distanceKm: 1000,
    };
  }
}

export function getRouteBounds(coordinates: [number, number][]): [[number, number], [number, number]] | null {
  if (!coordinates || coordinates.length === 0) return null;
  try {
    const line = turf.lineString(coordinates);
    const bbox = turf.bbox(line); // [minLng, minLat, maxLng, maxLat]
    return [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
  } catch {
    return null;
  }
}
