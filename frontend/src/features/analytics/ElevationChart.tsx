import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ElevationPoint } from '../../types';
import { Mountain } from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface ElevationChartProps {
  points: ElevationPoint[];
  highestMeters: number;
}

export const ElevationChart: React.FC<ElevationChartProps> = ({ points, highestMeters }) => {
  if (!points || points.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-400 text-sm">
        Elevation profile data unavailable for this route.
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mountain className="w-5 h-5 text-indigo-600" />
          <h4 className="text-base font-extrabold text-slate-900">Route Elevation Profile</h4>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
          Peak: {highestMeters} m
        </span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="distanceKm"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `${v} km`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `${v}m`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ElevationPoint;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl space-y-1">
                      <div className="font-bold">{data.stationName || `${data.distanceKm} km`}</div>
                      <div>Elevation: <span className="font-bold text-indigo-300">{data.elevationMeters} m</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="elevationMeters"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#elevationGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
