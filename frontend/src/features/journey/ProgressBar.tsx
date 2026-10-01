import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  distanceCoveredKm,
  distanceRemainingKm,
}) => {
  const totalKm = distanceCoveredKm + distanceRemainingKm;

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/80 p-5 shadow-lg shadow-indigo-950/5 space-y-3">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-indigo-600 font-mono">
            {progressPercent}%
          </span>
          <span className="text-xs font-bold text-slate-500">Route Completed</span>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          <strong className="text-indigo-600 font-extrabold">{distanceCoveredKm} km</strong> of {totalKm} km
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-xs"
          style={{ width: `${Math.min(100, Math.max(2, progressPercent))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-0.5">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span>Origin</span>
        </span>
        <span>{distanceRemainingKm} km remaining</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Destination</span>
        </span>
      </div>
    </div>
  );
};
