import React from 'react';
import { Card } from '../../components/ui/Card';
import { Train } from '../../types';
import { ArrowRight, MapPin, Gauge } from 'lucide-react';

interface RouteSummaryProps {
  train: Train;
  currentStationName?: string;
  delayMinutes: number;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  train,
  currentStationName,
  delayMinutes,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white space-y-4">
      <div className="flex items-center justify-between text-indigo-200 text-xs font-bold uppercase tracking-wider">
        <span>Route Summary</span>
        <span>#{train.number}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-black">{train.origin.name}</div>
          <div className="text-xs font-semibold text-indigo-300">{train.origin.code}</div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Currently: {currentStationName || 'En Route'}</span>
          </div>
          <div className="w-full h-1 bg-indigo-700/60 rounded-full relative">
            <div className="absolute left-1/2 -top-1 w-3 h-3 bg-emerald-400 rounded-full ring-4 ring-indigo-900" />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black">{train.destination.name}</div>
          <div className="text-xs font-semibold text-indigo-300">{train.destination.code}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-indigo-200 border-t border-indigo-800/80 pt-3">
        <span>Total Route: {train.totalDistanceKm} km</span>
        <span>Delay Status: {delayMinutes > 0 ? `+${delayMinutes} mins` : 'On Time'}</span>
      </div>
    </Card>
  );
};
