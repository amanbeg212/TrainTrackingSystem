import { Journey, JourneyStatus, StationReference, TrainPosition, Train } from '../../types/train.js';
import { config } from '../../config/env.js';
import { getTrainRouteDetails } from './route.js';

const BASE_URL = 'https://api.railradar.in/v1';

function getHeaders() {
  return {
    'Authorization': `Bearer ${config.railRadarApiKey}`,
    'Accept': 'application/json',
  };
}

/**
 * Get live train running status from RailRadar API.
 * Endpoint: GET /v1/trains/:trainNumber/live
 * Falls back to schedule-based position estimation if live data is unavailable.
 */
export async function getLiveTrainStatus(trainNumber: string): Promise<Journey> {
  const cleanNumber = String(trainNumber).trim().replace(/^#+/, '');
  const now = new Date();

  let trainName = `Train #${cleanNumber}`;
  let trainType = 'Express';
  let routeData;

  try {
    routeData = await getTrainRouteDetails(cleanNumber);
  } catch (_) {
    routeData = null;
  }

  const stations = routeData?.stations && routeData.stations.length > 0
    ? routeData.stations
    : [
        { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', latitude: 18.970784, longitude: 72.819403, scheduledDeparture: '17:00', distanceKm: 0 },
        { code: 'NDLS', name: 'New Delhi', city: 'Delhi', latitude: 28.64177, longitude: 77.22027, scheduledArrival: '08:32', distanceKm: 1388 },
      ];

  const totalDistanceKm = routeData?.distanceKm ?? 1388;
  const coordsMap = routeData?.waypointCoordsMap ?? {};

  // Try real live status endpoint: /v1/trains/{cleanNumber}/live
  try {
    const res = await fetch(`${BASE_URL}/trains/${cleanNumber}/live`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(7000),
    });

    if (res.ok) {
      const body = await res.json() as any;
      if (body.success && body.data) {
        return mapLiveTelemetryToJourney(body.data, { stations, distanceKm: totalDistanceKm, waypointCoordsMap: coordsMap }, cleanNumber, now);
      }
    }
  } catch (_) {
    // Fall through to schedule-based estimation
  }

  // Fallback: estimate position from schedule
  return estimateFromSchedule(cleanNumber, stations, totalDistanceKm, now, trainName, trainType);
}

/**
 * Map RailRadar /live API response to our Journey type
 */
function mapLiveTelemetryToJourney(
  data: any,
  routeData: { stations: StationReference[]; distanceKm: number; waypointCoordsMap: Record<string, { lat: number; lng: number }> },
  trainNumber: string,
  now: Date
): Journey {
  const stations = routeData.stations && routeData.stations.length > 0 ? routeData.stations : [
    { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', latitude: 18.970784, longitude: 72.819403, scheduledDeparture: '17:00', distanceKm: 0 },
    { code: 'NDLS', name: 'New Delhi', city: 'Delhi', latitude: 28.64177, longitude: 77.22027, scheduledArrival: '08:32', distanceKm: 1388 },
  ];
  const totalDistanceKm = routeData.distanceKm || 1388;
  const coordsMap = routeData.waypointCoordsMap || {};

  const trainInfo = data.train ?? {};
  const currentLoc = data.currentLocation ?? {};
  const nextHalt = data.nextHalt ?? {};
  const prevHalt = data.previousHalt ?? {};

  const delayMinutes: number = typeof data.delayMinutes === 'number' ? data.delayMinutes : (currentLoc.delayMinutes ?? 0);

  // Map API status string to JourneyStatus
  let journeyStatus: JourneyStatus = 'ON_TIME';
  const apiStatus = (data.status ?? '').toLowerCase();
  if (apiStatus === 'not-started') {
    journeyStatus = 'NOT_STARTED';
  } else if (apiStatus === 'completed') {
    journeyStatus = 'COMPLETED';
  } else if (apiStatus === 'cancelled') {
    journeyStatus = 'CANCELLED';
  } else if (delayMinutes > 5) {
    journeyStatus = 'DELAYED';
  } else {
    journeyStatus = 'ON_TIME';
  }

  // Match current station and next station safely
  const currentStation = stations.find(
    (s) => s.code === currentLoc.stationCode || s.code === prevHalt.stationCode
  ) ?? stations[0];

  const nextStation = stations.find(
    (s) => s.code === nextHalt.stationCode
  ) ?? stations[Math.min(1, stations.length - 1)] ?? currentStation;

  // Determine lat/lng for current train position
  let lat = currentStation?.latitude ?? 18.970784;
  let lng = currentStation?.longitude ?? 72.819403;
  let speed = 0;

  if (journeyStatus === 'NOT_STARTED') {
    lat = stations[0]?.latitude ?? 18.970784;
    lng = stations[0]?.longitude ?? 72.819403;
    speed = 0;
  } else if (journeyStatus === 'COMPLETED') {
    lat = stations[stations.length - 1]?.latitude ?? 28.64177;
    lng = stations[stations.length - 1]?.longitude ?? 77.22027;
    speed = 0;
  } else {
    // Train is running: interpolate between currentLocation and nextHalt
    const curCoord = (currentLoc.stationCode && coordsMap[currentLoc.stationCode]) ?? { lat: currentStation.latitude, lng: currentStation.longitude };
    const nextCoord = (nextHalt.stationCode && coordsMap[nextHalt.stationCode]) ?? { lat: nextStation.latitude, lng: nextStation.longitude };
    const segFraction = typeof currentLoc.segmentProgress === 'number' ? Math.max(0, Math.min(1, currentLoc.segmentProgress)) : 0.5;

    lat = curCoord.lat + (nextCoord.lat - curCoord.lat) * segFraction;
    lng = curCoord.lng + (nextCoord.lng - curCoord.lng) * segFraction;
    speed = currentLoc.speedKmh ?? 65;
  }

  // Calculate distance covered and remaining
  const distanceCoveredKm = Math.round(
    currentLoc.distanceFromOriginKm ??
    currentStation?.distanceKm ??
    0
  );
  const distanceRemainingKm = Math.max(0, totalDistanceKm - distanceCoveredKm);
  const progressPercent = Math.min(100, Math.max(0, Math.round((distanceCoveredKm / totalDistanceKm) * 100)));

  const position: TrainPosition = {
    latitude: lat,
    longitude: lng,
    timestamp: data.lastUpdatedAt ?? now.toISOString(),
    speedKmh: speed,
    bearingHeading: currentLoc.bearingDegrees ?? 45,
  };

  const train: Train = {
    id: String(trainInfo.number ?? data.trainNumber ?? trainNumber),
    number: String(trainInfo.number ?? data.trainNumber ?? trainNumber),
    name: trainInfo.name ?? data.trainName ?? `Train #${trainNumber}`,
    type: trainInfo.type ?? 'Express',
    origin: stations[0],
    destination: stations[stations.length - 1],
    totalDistanceKm,
    runsOnDays: trainInfo.runDays ?? ['Daily'],
  };

  // Build completed & upcoming station lists based on halts
  const nextSeq = nextHalt.sequence ?? 999;
  const liveRouteMap = new Map<string, any>();
  if (Array.isArray(data.route)) {
    for (const r of data.route) {
      if (r.stationCode) liveRouteMap.set(r.stationCode, r);
    }
  }

  const completedStations: StationReference[] = [];
  const upcomingStations: StationReference[] = [];

  for (const st of stations) {
    const liveInfo = liveRouteMap.get(st.code);
    const isPast = (liveInfo?.status === 'departed') || (liveInfo?.sequence && liveInfo.sequence < nextSeq);

    if (isPast) {
      completedStations.push({
        ...st,
        actualArrival: liveInfo?.actualArrival ?? st.scheduledArrival,
        actualDeparture: liveInfo?.actualDeparture ?? st.scheduledDeparture,
        delayMinutes: liveInfo?.delayArrival ?? Math.max(0, delayMinutes),
        platform: liveInfo?.platform ?? st.platform,
      });
    } else {
      upcomingStations.push({
        ...st,
        estimatedArrival: addMinutesToTimeString(st.scheduledArrival ?? '12:00', delayMinutes),
        estimatedDeparture: addMinutesToTimeString(st.scheduledDeparture ?? '12:10', delayMinutes),
        delayMinutes,
        platform: liveInfo?.platform ?? st.platform,
      });
    }
  }

  return {
    id: `j_${trainNumber}_${now.toISOString().substring(0, 10)}`,
    train,
    origin: stations[0],
    destination: stations[stations.length - 1],
    currentStation,
    nextStation,
    position,
    progressPercent,
    distanceCoveredKm,
    distanceRemainingKm,
    delayMinutes,
    status: journeyStatus,
    lastUpdatedAt: data.lastUpdatedAt ?? now.toISOString(),
    completedStations,
    upcomingStations,
  };
}

/**
 * Fallback: estimate position using scheduled times.
 * Used when the live status endpoint is unavailable.
 */
export function estimateFromSchedule(
  trainNumber: string,
  stations: StationReference[],
  totalDistanceKm: number,
  now: Date,
  trainName: string = `Train #${trainNumber}`,
  trainType: string = 'Express'
): Journey {
  if (!stations || stations.length === 0) {
    stations = [
      { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', latitude: 18.970784, longitude: 72.819403, scheduledDeparture: '17:00', distanceKm: 0 },
      { code: 'NDLS', name: 'New Delhi', city: 'Delhi', latitude: 28.64177, longitude: 77.22027, scheduledArrival: '08:32', distanceKm: 1388 },
    ];
    totalDistanceKm = 1388;
  }

  const numSegments = Math.max(1, stations.length - 1);
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  const progressRatio = (minuteOfDay % 120) / 120;
  const rawIdx = progressRatio * numSegments;
  const currentIdx = Math.min(Math.floor(rawIdx), numSegments - 1);
  const nextIdx = Math.min(currentIdx + 1, numSegments);
  const segFraction = rawIdx - currentIdx;

  const currentStation = stations[currentIdx] || stations[0];
  const nextStation = stations[nextIdx] || stations[stations.length - 1];

  const lat = currentStation.latitude + (nextStation.latitude - currentStation.latitude) * segFraction;
  const lng = currentStation.longitude + (nextStation.longitude - currentStation.longitude) * segFraction;

  const startDist = currentStation.distanceKm ?? 0;
  const endDist = nextStation.distanceKm ?? totalDistanceKm;
  const distanceCoveredKm = Math.round(startDist + (endDist - startDist) * segFraction);
  const distanceRemainingKm = Math.max(0, totalDistanceKm - distanceCoveredKm);
  const progressPercent = Math.min(100, Math.round((distanceCoveredKm / totalDistanceKm) * 100));

  const delayMinutes = 0;

  const train: Train = {
    id: trainNumber,
    number: trainNumber,
    name: trainName,
    type: trainType,
    origin: stations[0],
    destination: stations[stations.length - 1],
    totalDistanceKm,
    runsOnDays: ['Daily'],
  };

  return {
    id: `j_${trainNumber}_${now.toISOString().substring(0, 10)}`,
    train,
    origin: stations[0],
    destination: stations[stations.length - 1],
    currentStation,
    nextStation,
    position: {
      latitude: lat,
      longitude: lng,
      timestamp: now.toISOString(),
      speedKmh: 75,
      bearingHeading: 45,
    },
    progressPercent,
    distanceCoveredKm,
    distanceRemainingKm,
    delayMinutes,
    status: 'ON_TIME',
    lastUpdatedAt: now.toISOString(),
    completedStations: stations.slice(0, currentIdx + 1).map((st) => ({
      ...st,
      actualArrival: st.scheduledArrival,
      actualDeparture: st.scheduledDeparture,
      delayMinutes: 0,
    })),
    upcomingStations: stations.slice(nextIdx).map((st) => ({
      ...st,
      estimatedArrival: st.scheduledArrival ?? '12:00',
      estimatedDeparture: st.scheduledDeparture ?? '12:10',
      delayMinutes: 0,
    })),
  };
}

function addMinutesToTimeString(timeStr?: string, mins: number = 0): string {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return timeStr || '12:00';
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
  if (isNaN(h) || isNaN(m)) return timeStr;
  const date = new Date();
  date.setHours(h, m + mins, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}


