import React from 'react';
import { WeatherSnapshot, WeatherForecastItem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Sun, Cloud, Wind, Droplets, CloudSun, Thermometer } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherSnapshot;
  forecast: WeatherForecastItem[];
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, forecast }) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white border border-blue-100/80 p-6 shadow-xl shadow-blue-950/5 space-y-5 overflow-hidden">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
            Station Atmospheric Telemetry
          </span>
          <h4 className="text-xl font-black text-slate-900 mt-1.5">{weather.stationName}</h4>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
          <CloudSun className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {weather.temperatureC}°
          </span>
          <span className="text-base font-bold text-slate-400">C</span>
        </div>
        <div className="text-right text-xs">
          <div className="font-extrabold text-slate-800 text-sm">{weather.conditionText}</div>
          <div className="text-slate-400 font-semibold mt-0.5">Feels like {weather.feelsLikeC}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-center font-semibold">
        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1 text-[11px]">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Humidity</span>
          </div>
          <div className="font-black text-slate-900 text-sm">{weather.humidityPercent}%</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1 text-[11px]">
            <Wind className="w-3.5 h-3.5 text-indigo-500" />
            <span>Wind</span>
          </div>
          <div className="font-black text-slate-900 text-sm">{weather.windKph} km/h</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1 text-[11px]">
            <Cloud className="w-3.5 h-3.5 text-cyan-500" />
            <span>Precipitation</span>
          </div>
          <div className="font-black text-slate-900 text-sm">{weather.precipitationProbability}%</div>
        </div>
      </div>

      {/* Hourly forecast snippet */}
      {forecast.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Upcoming Hours Forecast
          </div>
          <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
            {forecast.map((f, i) => (
              <div key={i} className="p-2.5 rounded-2xl bg-white/90 border border-slate-200/60 shadow-2xs">
                <div className="font-semibold text-slate-400 text-[10px]">{f.time}</div>
                <div className="font-black text-slate-900 my-1 text-sm">{f.tempC}°</div>
                <div className="text-[10px] text-blue-600 font-bold">{f.rainProb}% rain</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
