'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { MealEntry } from '../types';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<MealEntry[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/user/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
      setFirstLoad(false);
    };

    loadFavorites();
  }, [user]);

  useEffect(() => {
    if (!firstLoad && user && favorites.length >= 0) {
      const saveFavorites = async () => {
        try {
          const token = await user.getIdToken();
          await fetch('/api/user/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ favorites }),
          });
        } catch (error) {
          console.error('Error saving favorites:', error);
        }
      };

      const timeoutId = setTimeout(saveFavorites, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
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
