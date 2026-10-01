import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Train, Search, Radio } from 'lucide-react';
import { recentSearches } from '../../features/search/recentSearches';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const handleLiveTrackingClick = () => {
    const recents = recentSearches.get();
    const targetTrainNumber = recents.length > 0 ? recents[0].trainNumber : '12951';
    navigate(`/train/${targetTrainNumber}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Rail<span className="text-indigo-600">Gaadi</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-2 bg-slate-100 px-1.5 py-0.5 rounded">
              LIVE
            </span>
          </div>
        </Link>

        {/* Global Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-200/80 transition-all active:scale-95"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Search</span>
          </Link>

          <button
            onClick={handleLiveTrackingClick}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Radio className="w-4 h-4" />
            <span>Live Tracking</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
