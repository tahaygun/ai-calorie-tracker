import type { MealEntry } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import MealItem from './MealItem';

interface DayMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  meals: MealEntry[];
}

export default function DayMealsModal({ isOpen, onClose, date, meals }: DayMealsModalProps) {
  const [favorites, setFavorites] = useState<MealEntry[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorite_meals');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: MealEntry[]) => {
    localStorage.setItem('favorite_meals', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleToggleFavorite = (meal: MealEntry) => {
    const isFavorite = favorites.some(fav => fav.id === meal.id);
    if (isFavorite) {
      // Remove from favorites
      saveFavorites(favorites.filter(fav => fav.id !== meal.id));
    } else {
      // Add to favorites
      saveFavorites([...favorites, meal]);
    }
  };

  const isMealFavorite = (id: string) => favorites.some(fav => fav.id === id);

  // In history view, we don't want to allow meal deletion
  const handleDelete = () => {
    console.log('Delete not supported in history view');
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl shadow-black/50 space-y-3 p-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FaCalendarAlt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">
                Meals for {new Date(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </h2>
              <p className="text-xs text-slate-400">{meals.length} {meals.length === 1 ? 'meal' : 'meals'} logged</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[calc(85vh-5rem)] overflow-y-auto pr-1 space-y-3">
          {meals.map(meal => (
            <MealItem
              key={meal.id}
              id={meal.id}
              description={meal.description}
              items={meal.items}
              isFavorite={isMealFavorite(meal.id)}
              onToggleFavorite={() => handleToggleFavorite(meal)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
