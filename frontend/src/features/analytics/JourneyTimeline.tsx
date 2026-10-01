import React from 'react';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Clock, Navigation } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'START' | 'ARRIVAL' | 'DEPARTURE' | 'DELAY_CHANGE' | 'CHECKPOINT';
}

export const JourneyTimeline: React.FC<{ timeline: TimelineEvent[] }> = ({ timeline }) => {
  return (
    <Card className="p-6 space-y-4">
      <h4 className="text-base font-extrabold text-slate-900">Live Journey Timeline</h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-3">
            <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50 flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {event.time}
                </span>
                <h5 className="text-sm font-extrabold text-slate-900">{event.title}</h5>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
