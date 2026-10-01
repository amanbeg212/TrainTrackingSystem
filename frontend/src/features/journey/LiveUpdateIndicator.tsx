import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { MachineState } from './journeyStateMachine';

interface LiveUpdateIndicatorProps {
  lastUpdatedAt?: string;
  machineState: MachineState;
  onRefresh: () => void;
}

export const LiveUpdateIndicator: React.FC<LiveUpdateIndicatorProps> = ({
  lastUpdatedAt,
  machineState,
  onRefresh,
}) => {
  const getSecondsAgo = (): number => {
    if (!lastUpdatedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(lastUpdatedAt).getTime()) / 1000));
  };

  const secondsAgo = getSecondsAgo();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-semibold">
        {machineState === 'STALE' ? (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Data is stale (updated {secondsAgo}s ago). Never showing stale data as live.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {secondsAgo} sec ago</span>
          </div>
        )}
      </div>

      <button
        onClick={onRefresh}
        className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Refresh Live Data</span>
      </button>
    </div>
  );
};
