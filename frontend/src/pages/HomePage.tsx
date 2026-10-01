import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../features/search/SearchBar';
import { recentSearches, RecentSearchItem, formatRelativeTime } from '../features/search/recentSearches';
import { useFavourites } from '../features/favourites/useFavourites';
import {
  Heart,
  Clock,
  Radio,
  Activity,
  MapPin,
  Mountain,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Sparkles,
  Compass,
  ChevronRight,
  X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Header } from '../components/layout/Header';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recents, setRecents] = useState<RecentSearchItem[]>(recentSearches.get());
  const { favourites } = useFavourites();

  const handleSelectTrain = (train: { number: string }) => {
    navigate(`/train/${train.number}`);
  };

  const handleClearRecents = () => {
    recentSearches.clear();
    setRecents([]);
  };

  const FLAGSHIP_TRAINS = [
    {
      number: '12951',
      name: 'Tejas Rajdhani Express',
      type: 'Rajdhani',
      from: 'Mumbai Central',
      fromCode: 'MMCT',
      to: 'New Delhi',
      toCode: 'NDLS',
      tag: 'Premier Sleeper',
      color: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
      number: '12002',
      name: 'New Delhi Shatabdi',
      type: 'Shatabdi',
      from: 'New Delhi',
      fromCode: 'NDLS',
      to: 'Rani Kamlapati',
      toCode: 'RKMP',
      tag: 'Superfast Chair Car',
      color: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      number: '22436',
      name: 'Vande Bharat Express',
      type: 'Vande Bharat',
      from: 'New Delhi',
      fromCode: 'NDLS',
      to: 'Varanasi Jn',
      toCode: 'BSB',
      tag: 'Semi High-Speed',
      color: 'from-indigo-600 to-violet-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    },
    {
      number: '12259',
      name: 'Sealdah Duronto Express',
      type: 'Duronto',
      from: 'Kolkata Sealdah',
      fromCode: 'SDAH',
      to: 'Bikaner Jn',
      toCode: 'BKN',
      tag: 'Non-Stop Express',
      color: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient background light gradients */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-96 -left-48 w-96 h-96 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-96 -right-48 w-96 h-96 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Dot pattern grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-7 max-w-3xl mx-auto pt-2">
          {/* Live Telemetry Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700 tracking-wide">
              Live Indian Railways Telemetry
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              13,500+ Trains
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Track any train in India, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              in real time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg font-normal text-slate-500 max-w-xl mx-auto leading-relaxed">
            Live GPS positions, upcoming stops, delay predictions, station weather, and topographic terrain in one fluid view.
          </p>

          {/* Floating Unified Search Bar */}
          <div className="pt-2">
            <SearchBar onSelectTrain={handleSelectTrain} />
            <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-slate-400 font-medium">
              <span>Popular:</span>
              <button
                type="button"
                onClick={() => navigate('/train/12951')}
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                #12951 Rajdhani
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/train/22436')}
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                #22436 Vande Bharat
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/train/12002')}
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                #12002 Shatabdi
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 max-w-lg mx-auto text-center border-t border-slate-200/60">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">13,500+</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Trains</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-indigo-600 flex items-center justify-center gap-1">
                <Gauge className="w-4 h-4" />
                <span>Live GPS</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Telemetry Feeds</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">MapTiler</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GIS Alignment</div>
            </div>
          </div>
        </section>

        {/* Live Spotlight Showcase Card */}
        <section className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-md pointer-events-none opacity-70" />
          <div className="relative rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-indigo-950/5 overflow-hidden">
            {/* Ambient corner decoration */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              {/* Left Column: Live Showcase Details */}
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Tracking Ready</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">• Flagship Corridor</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>#12951 Tejas Rajdhani Express</span>
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Mumbai Central (MMCT) → New Delhi (NDLS) • 1,386 km Corridor
                  </p>
                </div>

                {/* Micro Route Track Graphic */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>MMCT (Mumbai)</span>
                    </span>
                    <span className="text-slate-400 font-normal">8 Scheduled Halts</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>NDLS (Delhi)</span>
                    </span>
                  </div>

                  <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Speed: ~89 km/h</span>
                    <span>Elevation: 10m → 216m</span>
                    <span>MapTiler 221 GIS Points</span>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => navigate('/train/12951')}
                  className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer group"
                >
                  <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span>Launch Live Tracker</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/train/12002')}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Track Shatabdi #12002</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Indian Trains Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Featured Indian Express Trains
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click any express to track live GPS telemetry, station halts, and topography
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLAGSHIP_TRAINS.map((train) => (
              <div
                key={train.number}
                onClick={() => navigate(`/train/${train.number}`)}
                className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 active:scale-98"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/80 shadow-2xs">
                      #{train.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${train.badge}`}>
                      {train.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {train.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{train.fromCode}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span>{train.toCode}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span className="text-[11px] text-slate-400 font-normal">{train.tag}</span>
                  <span className="flex items-center gap-1">
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Capabilities Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Real-Time Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Direct railway feeds delivering live station departure timestamps, running delay predictions, and progress calculation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">MapTiler GIS Alignment</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              High-resolution vector track lines rendered with true curvature, interactive station halos, and dynamic heading indicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Topography & Weather</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              NASA SRTM elevation profiles alongside live OpenWeather temperature, wind, and precipitation conditions at each upcoming halt.
            </p>
          </div>
        </section>

        {/* Saved & Recents Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Recent Searches</h3>
              </div>
              {recents.length > 0 && (
                <button
                  onClick={handleClearRecents}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {recents.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">No recent searches yet.</p>
                <p className="text-[11px] text-slate-400">Search any 5-digit train number above to track it.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recents.map((item) => (
                  <div
                    key={item.trainNumber}
                    onClick={() => navigate(`/train/${item.trainNumber}`)}
                    className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-indigo-50/50 border border-slate-200/60 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/70 shadow-2xs shrink-0">
                        #{item.trainNumber}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {item.trainName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5">
                          <span>{item.origin} → {item.destination}</span>
                          {item.timestamp && (
                            <>
                              <span>•</span>
                              <span className="text-[10px] text-slate-400">{formatRelativeTime(item.timestamp)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          recentSearches.remove(item.trainNumber);
                          setRecents(recentSearches.get());
                        }}
                        className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                        title="Remove from recents"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                        <span>Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Favourite Trains */}
          <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Saved Trains</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{favourites.length} Saved</span>
            </div>

            {favourites.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">No favorite trains saved.</p>
                <p className="text-[11px] text-slate-400">Click the heart icon on any train journey to pin it here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favourites.map((fav) => (
                  <div
                    key={fav.trainNumber}
                    onClick={() => navigate(`/train/${fav.trainNumber}`)}
                    className="p-3.5 rounded-xl bg-rose-50/30 hover:bg-rose-50/80 border border-rose-100 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-100 shadow-2xs">
                        #{fav.trainNumber}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {fav.trainName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {fav.origin} → {fav.destination}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-400">
          <span>RailGaadi — Live Indian Train Tracking & Journey Intelligence</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Powered by RailRadar, MapTiler & OpenWeather</span>
          </span>
        </div>
      </footer>
    </div>
  );
};
