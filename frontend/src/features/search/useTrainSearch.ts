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
          setError(err.message || 'Failed to search trains');
          setResults([]);
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

