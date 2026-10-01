import React from 'react';
import { clsx } from 'clsx';
import { JourneyStatus } from '../../types';

interface BadgeProps {
  status?: JourneyStatus;
  delayMinutes?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<{ status: JourneyStatus; className?: string }> = ({ status, className }) => {
  const statusConfig: Record<JourneyStatus, { label: string; bg: string; text: string; dot: string }> = {
    ON_TIME: { label: 'On Time', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    DELAYED: { label: 'Delayed', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    NOT_STARTED: { label: 'Scheduled', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    COMPLETED: { label: 'Journey Completed', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    STALE: { label: 'Data Stale', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', dot: 'bg-orange-400' },
    CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    UNAVAILABLE: { label: 'Unavailable', bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', dot: 'bg-gray-400' },
  };

  const config = statusConfig[status] || statusConfig.UNAVAILABLE;

  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs', config.bg, config.text, className)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      {config.label}
    </span>
  );
};

export const DelayBadge: React.FC<{ delayMinutes: number; className?: string }> = ({ delayMinutes, className }) => {
  if (delayMinutes <= 0) {
    return (
      <span className={clsx('inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800', className)}>
        On Time
      </span>
    );
  }

  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-200', className)}>
      +{delayMinutes} min delay
    </span>
  );
};
