import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useJourneyStatus } from '../features/journey/useJourneyStatus';
import { JourneyHeader } from '../features/journey/JourneyHeader';
import { LiveUpdateIndicator } from '../features/journey/LiveUpdateIndicator';
import { RailwayMap } from '../components/map/RailwayMap';
import { JourneyStatusCard, NextStationCard } from '../features/journey/JourneyStatusCard';
import { ProgressBar } from '../features/journey/ProgressBar';
import { ETAList } from '../features/journey/ETAList';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { CompanionPanel } from '../features/companion/CompanionPanel';
import { ShareModal } from '../features/sharing/ShareModal';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/feedback/ErrorState';
import { Map, BarChart2, Compass, ListOrdered } from 'lucide-react';
import { recentSearches } from '../features/search/recentSearches';
import { api } from '../api/client';
import { WeatherSnapshot, WeatherForecastItem, GeographicFeature } from '../types';

interface JourneyPageProps {
  trainNumberProp?: string;
  isSharedView?: boolean;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ trainNumberProp, isSharedView = false }) => {
  const { trainNumber: routeTrainNumber } = useParams<{ trainNumber: string }>();
  const trainNumber = trainNumberProp || routeTrainNumber || '12951';
  const navigate = useNavigate();

  const {
    journey,
    routeGeometry,
    isLoading,
    error,
    machineState,
    refresh,
  } = useJourneyStatus(trainNumber);

  const [activeTab, setActiveTab] = useState<'STATIONS' | 'ANALYTICS' | 'COMPANION'>('STATIONS');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [weatherData, setWeatherData] = useState<{ current: WeatherSnapshot; forecast: WeatherForecastItem[] } | null>(null);
  const [geoFeatures, setGeoFeatures] = useState<GeographicFeature[]>([]);

  // Track recent search
  useEffect(() => {
    if (journey?.train) {
      recentSearches.add(journey.train);
    }
  }, [journey]);

  // Load weather and geo context when journey is available
  useEffect(() => {
    if (!journey) return;
    api.getWeather(journey.train.number).then(setWeatherData).catch(console.error);
    api.getNearbyGeo(journey.train.number).then(setGeoFeatures).catch(console.error);
  }, [journey?.train.number]);

  if (isLoading && !journey) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-[450px] w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  if (error && !journey) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-16 w-full">
          <ErrorState onRetry={refresh} message={error} />
        </main>
      </div>
    );
  }

  if (!journey || !routeGeometry) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Journey Header */}
        <JourneyHeader
          journey={journey}
          onBack={() => navigate('/')}
          onShare={() => setIsShareModalOpen(true)}
        />

        {/* Live Freshness & Stale Banner */}
        <LiveUpdateIndicator
          lastUpdatedAt={journey.lastUpdatedAt}
          machineState={machineState}
          onRefresh={refresh}
        />

        {/* Main Grid: Interactive Map + Status Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (Dominant on Desktop) */}
          <div className="lg:col-span-7 h-[450px] sm:h-[520px]">
            <RailwayMap
              routeGeometry={routeGeometry}
              position={journey.position}
              currentStation={journey.currentStation}
              nextStation={journey.nextStation}
            />
          </div>

          {/* Quick Status Cards Column */}
          <div className="lg:col-span-5 space-y-4">
            <JourneyStatusCard journey={journey} />
            <NextStationCard journey={journey} />
            <ProgressBar
              progressPercent={journey.progressPercent}
              distanceCoveredKm={journey.distanceCoveredKm}
              distanceRemainingKm={journey.distanceRemainingKm}
            />
          </div>
        </div>

        {/* Tabs for Detailed Modules: Stations, Analytics, Companion */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('STATIONS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'STATIONS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Upcoming Stations & ETA ({journey.upcomingStations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'ANALYTICS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Journey Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('COMPANION')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'COMPANION'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Travel Companion</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'STATIONS' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Route Station Schedule</h3>
              <ETAList
                upcomingStations={journey.upcomingStations}
                completedStations={journey.completedStations}
                currentStation={journey.currentStation}
              />
            </div>
          )}

          {activeTab === 'ANALYTICS' && <AnalyticsPage trainNumber={journey.train.number} />}

          {activeTab === 'COMPANION' && (
            <CompanionPanel
              weather={weatherData?.current || null}
              forecast={weatherData?.forecast || []}
              features={geoFeatures}
            />
          )}
        </section>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trainNumber={journey.train.number}
        trainName={journey.train.name}
      />
    </div>
  );
};
