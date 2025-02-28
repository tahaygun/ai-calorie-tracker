import type { MealEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import MealItem from './MealItem';

interface DayMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  meals: MealEntry[];
}

export default function DayMealsModal({
  isOpen,
  onClose,
  date,
  meals,
}: DayMealsModalProps) {
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
    const isFavorite = favorites.some((fav) => fav.id === meal.id);
    if (isFavorite) {
      // Remove from favorites
      saveFavorites(favorites.filter((fav) => fav.id !== meal.id));
    } else {
      // Add to favorites
      saveFavorites([...favorites, meal]);
    }
  };

  const isMealFavorite = (id: string) => favorites.some((fav) => fav.id === id);

  // In history view, we don't want to allow meal deletion
  const handleDelete = () => {
    // This is intentionally a no-op function for the history view
    console.log('Delete not supported in history view');
  };

  if (!isOpen) return null;

  return (
    <div className='z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4'>
      <div className='bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        <div className='flex justify-between items-center border-gray-700 p-3 border-b'>
          <h2 className='font-semibold text-sm'>
            Meals for {new Date(date).toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className='p-1 text-gray-400 hover:text-gray-300'
          >
            ✕
          </button>
        </div>

        <div className='p-3 max-h-[calc(90vh-3.5rem)] overflow-y-auto'>
          <div className='space-y-3'>
            {meals.map((meal) => (
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
    </div>
  );
}
