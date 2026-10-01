import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={clsx('skeleton-shimmer rounded-lg bg-slate-200', className)} />
  );
};
