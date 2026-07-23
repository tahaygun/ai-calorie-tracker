'use client';

import { useLocalStorage } from './useLocalStorage';
import type { MealEntry } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<MealEntry[]>('favorite_meals', []);

  const toggleFavorite = (meal: MealEntry) => {
    const isFavorite = favorites.some(fav => fav.id === meal.id);
    if (isFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== meal.id));
    } else {
      setFavorites(prev => [...prev, meal]);
    }
  };

  const deleteFavorite = (id: string) => {
    setFavorites(prev => prev.filter(meal => meal.id !== id));
  };

  const isMealFavorite = (id: string) => favorites.some(fav => fav.id === id);

  return {
    favorites,
    toggleFavorite,
    deleteFavorite,
    isMealFavorite,
  };
}
