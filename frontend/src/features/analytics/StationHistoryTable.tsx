import React from 'react';
import { StationEvent } from '../../types';
import { Card } from '../../components/ui/Card';
import { DelayBadge } from '../../components/ui/Badge';

interface StationHistoryTableProps {
  events: StationEvent[];
}

export const StationHistoryTable: React.FC<StationHistoryTableProps> = ({ events }) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-extrabold text-slate-900">Station Arrival & History</h4>
        <span className="text-xs font-bold text-slate-500">Total {events.length} Stations</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3">Station</th>
              <th className="pb-3">Code</th>
              <th className="pb-3">Scheduled</th>
              <th className="pb-3">Actual / Est</th>
              <th className="pb-3">Delay</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {events.map((ev, idx) => (
              <tr key={ev.station.code + idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 font-bold text-slate-900">{ev.station.name}</td>
                <td className="py-3 font-mono text-indigo-600">{ev.station.code}</td>
                <td className="py-3 text-slate-500">{ev.scheduledTime}</td>
                <td className="py-3 font-bold text-slate-900">{ev.actualOrEstimatedTime}</td>
                <td className="py-3">
                  <DelayBadge delayMinutes={ev.delayMinutes} />
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      ev.status === 'DEPARTED'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
