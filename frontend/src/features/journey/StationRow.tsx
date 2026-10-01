import React from 'react';
import { StationReference } from '../../types';
import { Clock, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

interface StationRowProps {
  station: StationReference;
  isPassed?: boolean;
  isCurrent?: boolean;
  isNext?: boolean;
  onSelect?: (station: StationReference) => void;
}

export const StationRow: React.FC<StationRowProps> = ({
  station,
  isPassed = false,
  isCurrent = false,
  isNext = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(station)}
      className={clsx(
        'group flex items-center justify-between p-3.5 px-4 rounded-2xl border transition-all cursor-pointer select-none',
        isCurrent
          ? 'bg-emerald-50/80 border-emerald-300 ring-4 ring-emerald-500/10 shadow-xs'
          : isNext
          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/10 shadow-xs'
          : isPassed
          ? 'bg-slate-50/40 border-slate-200/50 opacity-60 hover:opacity-100 hover:bg-slate-50'
          : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-indigo-200'
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-black shrink-0 transition-transform group-hover:scale-105',
            isCurrent
              ? 'bg-emerald-500 text-white shadow-xs'
              : isNext
              ? 'bg-amber-500 text-white shadow-xs'
              : isPassed
              ? 'bg-slate-200 text-slate-600'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
          )}
        >
          {station.code}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {station.name}
            </h5>
            {isCurrent && (
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                Current
              </span>
            )}
            {isNext && (
              <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                Next Halt
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-2">
            <span>{station.distanceKm} km</span>
            {station.platform && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-bold">Platform {station.platform}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <div className="flex items-center gap-1.5 justify-end">
          <span className={clsx(
            'text-sm font-black tracking-tight',
            isCurrent ? 'text-emerald-700' : isNext ? 'text-amber-700' : 'text-slate-900'
          )}>
            {station.estimatedArrival || station.actualArrival || station.scheduledArrival || '--:--'}
          </span>
        </div>
        {station.scheduledArrival && (
          <div className="text-[11px] font-semibold text-slate-400">
            Sched: {station.scheduledArrival}
          </div>
        )}
      </div>
    </div>
  );
};

export const ETAList: React.FC<{
  upcomingStations: StationReference[];
  completedStations: StationReference[];
  currentStation?: StationReference;
  onSelectStation?: (station: StationReference) => void;
}> = ({ upcomingStations, completedStations, currentStation, onSelectStation }) => {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
      {currentStation && (
        <StationRow station={currentStation} isCurrent onSelect={onSelectStation} />
      )}
      {upcomingStations.map((st, idx) => (
        <StationRow
          key={st.code}
          station={st}
          isNext={idx === 0}
          onSelect={onSelectStation}
        />
      ))}
      {completedStations.map((st) => (
        <StationRow key={st.code} station={st} isPassed onSelect={onSelectStation} />
      ))}
    </div>
  );
};
