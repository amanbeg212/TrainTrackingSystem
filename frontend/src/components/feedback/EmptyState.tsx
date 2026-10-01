import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try searching with a train number or name.',
  icon = <Search className="w-8 h-8 text-indigo-500" />,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
