import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Card } from '../../components/ui/Card';

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'primary' | 'emerald' | 'amber' | 'blue';
}

export const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // 800ms animation
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = (value - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= value) || (increment < 0 && start <= value)) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200/80 text-slate-900',
    primary: 'bg-indigo-50/60 border-indigo-200 text-indigo-900',
    emerald: 'bg-emerald-50/60 border-emerald-200 text-emerald-900',
    amber: 'bg-amber-50/60 border-amber-200 text-amber-900',
    blue: 'bg-blue-50/60 border-blue-200 text-blue-900',
  };

  return (
    <Card className={clsx('p-5 space-y-2', variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-white shadow-2xs text-indigo-600">{icon}</div>}
      </div>
      <div className="text-2xl font-black tracking-tight">{value}</div>
      {subtitle && <p className="text-xs font-semibold text-slate-500">{subtitle}</p>}
    </Card>
  );
};
