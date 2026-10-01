import React, { useState } from 'react';
import { GeographicFeature, WeatherSnapshot, WeatherForecastItem } from '../../types';
import { Card } from '../../components/ui/Card';
import { WeatherCard } from './WeatherCard';
import { Compass, Waves, Mountain, LandPlot, Building2, Landmark, Navigation } from 'lucide-react';
import { Drawer } from '../../components/ui/Drawer';

interface CompanionPanelProps {
  weather: WeatherSnapshot | null;
  forecast: WeatherForecastItem[];
  features: GeographicFeature[];
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({ weather, forecast, features }) => {
  const [selectedFeature, setSelectedFeature] = useState<GeographicFeature | null>(null);

  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'RIVER':
      case 'LAKE':
        return <Waves className="w-5 h-5 text-cyan-600" />;
      case 'MOUNTAIN':
      case 'GHAT':
        return <Mountain className="w-5 h-5 text-emerald-600" />;
      case 'MONUMENT':
      case 'ATTRACTION':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      default:
        return <Compass className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {weather && <WeatherCard weather={weather} forecast={forecast} />}

      {/* Nearby Geographic Context */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Geographic & Historic Context</h4>
          </div>
          <span className="text-xs font-bold text-slate-400">Nearby Route POIs</span>
        </div>

        {features.length === 0 ? (
          <p className="text-xs font-semibold text-slate-400">No major geographical landmarks detected nearby.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feat) => (
              <div
                key={feat.id}
                onClick={() => setSelectedFeature(feat)}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-100">
                    {getIconForCategory(feat.category)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{feat.name}</h5>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {feat.category}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {feat.distanceKm} km
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* POI Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedFeature)}
        onClose={() => setSelectedFeature(null)}
        title={selectedFeature?.name}
      >
        {selectedFeature && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 p-2.5 rounded-xl">
              <Navigation className="w-4 h-4" />
              <span>{selectedFeature.distanceKm} km from current train position</span>
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {selectedFeature.description || 'A key landmark situated along this Indian Railways corridor.'}
            </p>
            <div className="text-xs font-medium text-slate-400">
              Coordinates: {selectedFeature.latitude.toFixed(4)}° N, {selectedFeature.longitude.toFixed(4)}° E
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
