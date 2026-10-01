import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { JourneyPage } from '../../pages/JourneyPage';
import { Header } from '../../components/layout/Header';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Share2, Lock } from 'lucide-react';

export const SharedJourneyPage: React.FC = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const [trainNumber, setTrainNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!journeyId) return;
    setIsLoading(true);
    api
      .getSharedJourney(journeyId)
      .then((data) => {
        setTrainNumber(data.trainNumber);
      })
      .catch((err) => {
        setError(err.message || 'Shared journey not found or link has expired');
      })
      .finally(() => setIsLoading(false));
  }, [journeyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 w-full space-y-6">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  if (error || !trainNumber) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 w-full">
          <ErrorState
            title="Invalid or Expired Share Link"
            message={error || 'This live train tracking link is no longer valid.'}
            onRetry={() => navigate('/')}
          />
        </main>
      </div>
    );
  }

  return (
    <div>
      {/* Banner for shared view */}
      <div className="bg-indigo-600 text-white text-xs font-bold text-center py-2.5 px-4 flex items-center justify-center gap-2 shadow-xs">
        <Share2 className="w-4 h-4 text-indigo-200 animate-pulse" />
        <span>You are viewing a shared live train journey</span>
      </div>
      <JourneyPage trainNumberProp={trainNumber} isSharedView={true} />
    </div>
  );
};
