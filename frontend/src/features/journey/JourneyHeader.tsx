import React from 'react';
import { Journey } from '../../types';
import { StatusBadge, DelayBadge } from '../../components/ui/Badge';
import { Heart, Share2, ArrowLeft, TrainFront, Radio, ArrowRight, Clock, Navigation } from 'lucide-react';
import { useFavourites } from '../favourites/useFavourites';

interface JourneyHeaderProps {
  journey: Journey;
  onBack: () => void;
  onShare: () => void;
}

export const JourneyHeader: React.FC<JourneyHeaderProps> = ({ journey, onBack, onShare }) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const fav = isFavourite(journey.train.number);

  return (
    <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 p-5 sm:p-6 shadow-xl shadow-slate-900/5 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Back button + Train info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
            aria-label="Back to search"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/30 shrink-0">
              <TrainFront className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                  #{journey.train.number}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {journey.train.type || 'Express'}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Telemetry</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
                {journey.train.name}
              </h1>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1 flex-wrap">
                <span className="text-slate-800 font-bold">{journey.origin.name} ({journey.origin.code})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-800 font-bold">{journey.destination.name} ({journey.destination.code})</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{journey.distanceCoveredKm + journey.distanceRemainingKm} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Status Badges & Actions */}
        <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-2">
            <StatusBadge status={journey.status} />
            {journey.delayMinutes > 0 && <DelayBadge delayMinutes={journey.delayMinutes} />}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavourite(journey.train)}
              className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs cursor-pointer active:scale-95 ${
                fav
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs'
              }`}
              title={fav ? 'Remove from Favourites' : 'Save Train'}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{fav ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onShare}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 font-bold text-xs cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
