import React from 'react';
import { Train } from '../../types';
import { ArrowRight, ChevronRight, TrainFront, Radio } from 'lucide-react';

interface SearchResultCardProps {
  train: Train;
  onSelect: (train: Train) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ train, onSelect }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(train)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(train);
        }
      }}
      className="p-3.5 px-4 rounded-2xl hover:bg-indigo-50/70 active:bg-indigo-100/70 bg-white hover:border-indigo-200 transition-all border border-slate-100 cursor-pointer group flex items-center justify-between shadow-2xs select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs shrink-0">
          <TrainFront className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60 shrink-0">
              #{train.number}
            </span>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {train.name}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1 truncate">
            <span>{train.origin.name || train.origin.code}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{train.destination.name || train.destination.code}</span>
            {train.totalDistanceKm > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-normal">{train.totalDistanceKm} km</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-3.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 ml-3">
        <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        <span>Track</span>
      </div>
    </div>
  );
};
