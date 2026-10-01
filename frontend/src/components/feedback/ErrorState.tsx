import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to fetch train details',
  message = 'Provider connection timed out or is temporarily unavailable. Please try refreshing.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-rose-600" />
      </div>
      <h4 className="text-base font-bold text-rose-900 mb-1">{title}</h4>
      <p className="text-sm text-rose-700 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
