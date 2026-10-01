export interface StationReference {
  code: string;
  name: string;
  city?: string;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  platform?: string;
  delayMinutes?: number;
  distanceKm?: number;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: string;
  origin: StationReference;
  destination: StationReference;
  totalDistanceKm: number;
  runsOnDays: string[];
}

export interface TrainPosition {
  latitude: number;
  longitude: number;
  timestamp: string;
  speedKmh?: number;
  bearingHeading?: number;
  accuracyMeters?: number;
}

export type JourneyStatus =
  | "NOT_STARTED"
  | "ON_TIME"
  | "DELAYED"
  | "STALE"
  | "COMPLETED"
  | "CANCELLED"
  | "UNAVAILABLE";

export interface Journey {
  id: string;
  train: Train;
  origin: StationReference;
  destination: StationReference;
  currentStation?: StationReference;
  nextStation?: StationReference;
  position: TrainPosition;
  progressPercent: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  delayMinutes: number;
  status: JourneyStatus;
  lastUpdatedAt: string;
  upcomingStations: StationReference[];
  completedStations: StationReference[];
}

export interface RouteGeometry {
  trainNumber: string;
  distanceKm: number;
  stations: StationReference[];
  route: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export interface StationEvent {
  station: StationReference;
  scheduledTime: string;
  actualOrEstimatedTime: string;
  delayMinutes: number;
  status: "DEPARTED" | "ARRIVED" | "EXPECTED" | "SKIPPED";
}

export interface ElevationPoint {
  distanceKm: number;
  elevationMeters: number;
  stationName?: string;
}

export interface JourneyAnalytics {
  progressPercent: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  delayMinutes: number;
  highestElevationMeters: number;
  lowestElevationMeters: number;
  averageSpeedKmh: number;
  timeline: {
    time: string;
    title: string;
    description: string;
    type: "START" | "ARRIVAL" | "DEPARTURE" | "DELAY_CHANGE" | "CHECKPOINT";
  }[];
  stationHistory: StationEvent[];
  elevation: {
    highestMeters: number;
    points: ElevationPoint[];
  };
}

export interface WeatherSnapshot {
  stationName: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windKph: number;
  precipitationProbability: number;
  conditionText: string;
  conditionIcon: string;
  timestamp: string;
}

export interface WeatherForecastItem {
  time: string;
  tempC: number;
  condition: string;
  rainProb: number;
}

export interface GeographicFeature {
  id: string;
  category:
    | "RIVER"
    | "LAKE"
    | "MOUNTAIN"
    | "GHAT"
    | "BRIDGE"
    | "TUNNEL"
    | "MONUMENT"
    | "ATTRACTION"
    | "CITY"
    | "DISTRICT"
    | "FORT";
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  description?: string;
}
