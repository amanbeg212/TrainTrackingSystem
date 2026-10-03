import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Train } from '../../types';

export function useTrainSearch(query: string) {
  const [results, setResults] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim().replace(/^#+/, '').trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await api.searchTrains(trimmed);
        if (isMounted) {
          setResults(data);
        }
      } catch (err: any) {
        if (isMounted) {
          // If backend is down but the query looks like a valid train number,
          // return a placeholder so the user can still navigate to the journey page.
          const rawDigits = trimmed.replace(/\D/g, '');
          if (rawDigits.length >= 4 && rawDigits.length <= 5 && /^\d+$/.test(trimmed)) {
            setResults([{
              id: rawDigits,
              number: rawDigits,
              name: `Train #${rawDigits}`,
              type: 'Express',
              origin: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
              destination: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
              totalDistanceKm: 0,
              runsOnDays: ['Daily'],
            }]);
            setError(null);
          } else {
            setError(err.message || 'Failed to search trains');
            setResults([]);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, isLoading, error };
}

