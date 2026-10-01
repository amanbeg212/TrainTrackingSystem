import { JourneyStatus } from '../../types';

export type MachineState = 'UNKNOWN' | 'FETCHING' | 'LIVE' | 'STALE' | 'ERROR';

export function determineMachineState(
  status: JourneyStatus | null,
  isLoading: boolean,
  error: boolean,
  lastUpdatedTimestamp?: string,
  staleThresholdMs: number = 60000 // 60s
): MachineState {
  if (error) return 'ERROR';
  if (isLoading && !status) return 'FETCHING';
  if (!status) return 'UNKNOWN';

  if (lastUpdatedTimestamp) {
    const ageMs = Date.now() - new Date(lastUpdatedTimestamp).getTime();
    if (ageMs > staleThresholdMs) {
      return 'STALE';
    }
  }

  return 'LIVE';
}
