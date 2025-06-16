'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { MealEntry } from '../types';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<MealEntry[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const userId = user.uid;
    const storedFavorites = localStorage.getItem(`favorite_meals_${userId}`);
    setFavorites(JSON.parse(storedFavorites || '[]'));
    setFirstLoad(false);
  }, [user]);

  useEffect(() => {
    if (!firstLoad && user) {
      const userId = user.uid;
      localStorage.setItem(`favorite_meals_${userId}`, JSON.stringify(favorites));
    }
  }, [favorites, firstLoad, user]);

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