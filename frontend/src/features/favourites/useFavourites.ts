import { useState, useEffect } from 'react';
import { Train } from '../../types';

const FAVOURITES_KEY = 'railgaadi_favourite_trains';

export interface FavouriteTrainItem {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  addedAt: number;
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteTrainItem[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    try {
      const data = localStorage.getItem(FAVOURITES_KEY);
      if (data) setFavourites(JSON.parse(data));
    } catch {
      setFavourites([]);
    }
  };

  const isFavourite = (trainNumber: string): boolean => {
    return favourites.some((f) => f.trainNumber === trainNumber);
  };

  const toggleFavourite = (train: Train) => {
    try {
      let updated: FavouriteTrainItem[];
      if (isFavourite(train.number)) {
        updated = favourites.filter((f) => f.trainNumber !== train.number);
      } else {
        const newItem: FavouriteTrainItem = {
          trainNumber: train.number,
          trainName: train.name,
          origin: train.origin.name,
          destination: train.destination.name,
          addedAt: Date.now(),
        };
        updated = [newItem, ...favourites];
      }
      setFavourites(updated);
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return { favourites, isFavourite, toggleFavourite };
}
