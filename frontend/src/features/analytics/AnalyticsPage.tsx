import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { JourneyAnalytics } from '../../types';
import { MetricCard, AnimatedCounter } from './MetricCard';
import { ElevationChart } from './ElevationChart';
import { StationHistoryTable } from './StationHistoryTable';
import { JourneyTimeline } from './JourneyTimeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { Gauge, Clock, Mountain, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

interface AnalyticsPageProps {
  trainNumber: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ trainNumber }) => {
  const [analytics, setAnalytics] = useState<JourneyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .getAnalytics(trainNumber)
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [trainNumber]);

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Completion"
          value={<AnimatedCounter value={analytics.progressPercent} suffix="%" />}
          subtitle={`${analytics.distanceCoveredKm} / ${analytics.distanceCoveredKm + analytics.distanceRemainingKm} km`}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="primary"
        />

        <MetricCard
          title="Current Delay"
          value={analytics.delayMinutes > 0 ? `+${analytics.delayMinutes} m` : 'On Time'}
          subtitle={analytics.delayMinutes > 0 ? 'Behind schedule' : 'Perfect timeline'}
          icon={<Clock className="w-5 h-5" />}
          variant={analytics.delayMinutes > 0 ? 'amber' : 'emerald'}
        />

        <MetricCard
          title="Peak Elevation"
          value={`${analytics.highestElevationMeters} m`}
          subtitle={`Lowest: ${analytics.lowestElevationMeters} m`}
          icon={<Mountain className="w-5 h-5" />}
          variant="blue"
        />

        <MetricCard
          title="Avg Speed"
          value={`${analytics.averageSpeedKmh} km/h`}
          subtitle="Superfast corridor"
          icon={<Gauge className="w-5 h-5" />}
        />
      </div>

      {/* Elevation Profile Chart */}
      <ElevationChart
        points={analytics.elevation.points}
        highestMeters={analytics.elevation.highestMeters}
      />

      {/* Grid: Timeline & Station History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <JourneyTimeline timeline={analytics.timeline} />
        </div>
        <div className="lg:col-span-7">
          <StationHistoryTable events={analytics.stationHistory} />
        </div>
      </div>
    </div>
  );
};
