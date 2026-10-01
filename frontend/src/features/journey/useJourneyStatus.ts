import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../api/client';
import { Journey, RouteGeometry } from '../../types';
import { determineMachineState, MachineState } from './journeyStateMachine';

export function useJourneyStatus(trainNumber: string) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [machineState, setMachineState] = useState<MachineState>('UNKNOWN');

  const isFetchingRef = useRef(false);

  const fetchStatusAndRoute = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isInitial) setIsLoading(true);
    setError(null);

    try {
      const statusData = await api.getLiveStatus(trainNumber);
      setJourney(statusData);

      if (isInitial || !routeGeometry) {
        const routeData = await api.getRouteGeometry(trainNumber);
        setRouteGeometry(routeData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update live train status');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [trainNumber, routeGeometry]);

  // Initial fetch
  useEffect(() => {
    fetchStatusAndRoute(true);
  }, [trainNumber]);

  // Auto-refresh interval (15s) with visibility-aware pause
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchStatusAndRoute(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchStatusAndRoute]);

  // Evaluate state machine state
  useEffect(() => {
    const state = determineMachineState(
      journey?.status || null,
      isLoading,
      Boolean(error),
      journey?.lastUpdatedAt
    );
    setMachineState(state);
  }, [journey, isLoading, error]);

  return {
    journey,
    routeGeometry,
    isLoading,
    error,
    machineState,
    refresh: () => fetchStatusAndRoute(false),
  };
}
