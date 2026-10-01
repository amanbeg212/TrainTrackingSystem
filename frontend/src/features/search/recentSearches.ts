import { Train } from '../../types';

const RECENT_KEY = 'railgaadi_recent_searches';

export interface RecentSearchItem {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  timestamp: number;
}

export const recentSearches = {
  get: (): RecentSearchItem[] => {
    try {
      const data = localStorage.getItem(RECENT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (train: Train) => {
    try {
      const items = recentSearches.get();
      const filtered = items.filter((i) => i.trainNumber !== train.number);
      const newItem: RecentSearchItem = {
        trainNumber: train.number,
        trainName: train.name,
        origin: train.origin.name,
        destination: train.destination.name,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  remove: (trainNumber: string) => {
    try {
      const items = recentSearches.get().filter((i) => i.trainNumber !== trainNumber);
      localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {
      console.error(e);
    }
  },
};

export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}
