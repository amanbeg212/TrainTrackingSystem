import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  glass = false,
  hoverable = false,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        glass
          ? 'bg-white/80 backdrop-blur-md border-white/60 shadow-glass'
          : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md',
        hoverable && 'hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
