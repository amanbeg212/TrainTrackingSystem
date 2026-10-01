import { getLiveStatusService } from './journeyService.js';
import { getElevationProfile } from '../providers/opentopography/elevation.js';
import { JourneyAnalytics, StationEvent } from '../types/train.js';
import { cacheManager } from '../cache/cacheManager.js';
import { config } from '../config/env.js';

export async function getJourneyAnalyticsService(trainNumber: string): Promise<JourneyAnalytics> {
  const cleanNumber = String(trainNumber).trim().replace(/^#+/, '');
  const cacheKey = `analytics:${cleanNumber}`;
  const cached = cacheManager.get<JourneyAnalytics>(cacheKey);
  if (cached) return cached;

  let journey;
  try {
    journey = await getLiveStatusService(cleanNumber);
  } catch (_) {
    journey = null;
  }

  let elevationData;
  try {
    elevationData = await getElevationProfile(cleanNumber);
  } catch (_) {
    elevationData = { highestMeters: 450, lowestMeters: 10, points: [] };
  }

  if (!journey) {
    return {
      progressPercent: 0,
      distanceCoveredKm: 0,
      distanceRemainingKm: 1388,
      delayMinutes: 0,
      highestElevationMeters: elevationData.highestMeters,
      lowestElevationMeters: elevationData.lowestMeters,
      averageSpeedKmh: 75,
      timeline: [],
      stationHistory: [],
      elevation: {
        highestMeters: elevationData.highestMeters,
        points: elevationData.points,
      },
    };
  }

  const stationHistory: StationEvent[] = [
    ...(journey.completedStations || []).map((st) => ({
      station: st,
      scheduledTime: st.scheduledDeparture || st.scheduledArrival || "00:00",
      actualOrEstimatedTime: st.actualDeparture || st.actualArrival || "00:00",
      delayMinutes: st.delayMinutes || 0,
      status: "DEPARTED" as const,
    })),
    ...(journey.upcomingStations || []).map((st) => ({
      station: st,
      scheduledTime: st.scheduledArrival || "00:00",
      actualOrEstimatedTime: st.estimatedArrival || "00:00",
      delayMinutes: st.delayMinutes || journey.delayMinutes,
      status: "EXPECTED" as const,
    })),
  ];

  const timeStr = journey.lastUpdatedAt && journey.lastUpdatedAt.length >= 16 ? journey.lastUpdatedAt.substring(11, 16) : "12:00";

  const timeline = [
    {
      time: journey.origin?.scheduledDeparture || "00:00",
      title: `Journey Started at ${journey.origin?.name || 'Origin'}`,
      description: `Train #${journey.train.number} departed from ${journey.origin?.city || journey.origin?.name || 'Origin'}`,
      type: "START" as const,
    },
    {
      time: timeStr,
      title: `Current Location: near ${journey.currentStation?.name || "En Route"}`,
      description: `Running ${journey.delayMinutes} minutes delayed at ${journey.position?.speedKmh || 80} km/h`,
      type: "CHECKPOINT" as const,
    },
    {
      time: journey.nextStation?.estimatedArrival || "12:00",
      title: `Next Halt: ${journey.nextStation?.name || "Destination"}`,
      description: `Expected arrival at ${journey.nextStation?.estimatedArrival || 'Scheduled time'} on platform ${journey.nextStation?.platform || '1'}`,
      type: "ARRIVAL" as const,
    },
  ];

  const analytics: JourneyAnalytics = {
    progressPercent: journey.progressPercent,
    distanceCoveredKm: journey.distanceCoveredKm,
    distanceRemainingKm: journey.distanceRemainingKm,
    delayMinutes: journey.delayMinutes,
    highestElevationMeters: elevationData.highestMeters,
    lowestElevationMeters: elevationData.lowestMeters,
    averageSpeedKmh: journey.position.speedKmh || 78,
    timeline,
    stationHistory,
    elevation: {
      highestMeters: elevationData.highestMeters,
      points: elevationData.points,
    },
  };

  cacheManager.set(cacheKey, analytics, config.cacheTtl.liveStatus);
  return analytics;
}
