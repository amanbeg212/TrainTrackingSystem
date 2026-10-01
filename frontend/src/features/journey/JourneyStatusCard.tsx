import React from 'react';
import { Journey } from '../../types';
import { MapPin, Gauge, Clock, ShieldCheck, Compass, Sparkles, Navigation } from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface JourneyStatusCardProps {
  journey: Journey;
}

export const JourneyStatusCard: React.FC<JourneyStatusCardProps> = ({ journey }) => {
  const currentSt = journey.currentStation;

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-lg shadow-indigo-950/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
            Current Position
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
          <Gauge className="w-3.5 h-3.5 text-indigo-600" />
          <span>{journey.position.speedKmh || 85} km/h</span>
        </div>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
            {currentSt?.name || 'En Route (' + (journey.nextStation?.name || 'In Transit') + ')'}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>Station Code: <strong className="font-mono text-slate-800">{currentSt?.code || 'EN ROUTE'}</strong></span>
            {currentSt?.platform && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-indigo-600">Platform {currentSt.platform}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export const NextStationCard: React.FC<JourneyStatusCardProps> = ({ journey }) => {
  const nextSt = journey.nextStation;

  if (!nextSt) return null;

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-lg shadow-indigo-950/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
            Next Scheduled Halt
          </span>
        </div>
        {nextSt.platform && (
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
            Platform {nextSt.platform}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
            {nextSt.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Station Code: <strong className="font-mono text-slate-800">{nextSt.code}</strong>
            {nextSt.distanceKm !== undefined && ` • ${nextSt.distanceKm} km`}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
            {nextSt.estimatedArrival || nextSt.scheduledArrival || '--:--'}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {nextSt.estimatedArrival ? 'Estimated Arrival' : 'Scheduled Arrival'}
          </div>
        </div>
      </div>
    </div>
  );
};
