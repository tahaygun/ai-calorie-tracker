'use client';

import { useEffect, useState } from 'react';
import type { MealEntry } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<MealEntry[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorite_meals');
    setFavorites(JSON.parse(storedFavorites || '[]'));
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      localStorage.setItem('favorite_meals', JSON.stringify(favorites));
    }
  }, [favorites, firstLoad]);

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
