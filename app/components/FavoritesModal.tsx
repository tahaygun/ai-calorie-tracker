import type { MealEntry } from '@/lib/types';
import React from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import FavoriteMealItem from './FavoriteMealItem';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MealEntry[];
  onSelect: (_meal: MealEntry) => void;
  onDelete: (_id: string) => void;
}

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onDelete,
}: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-black/50 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FaStar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Favorite Meals</h2>
              <p className="text-xs text-slate-400">Quickly add meals to your daily log</p>
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

        {favorites.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-slate-400 text-sm">No favorite meals saved yet</p>
            <p className="text-xs text-slate-500">Star meals in your logged list to access them here</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {favorites.map(meal => (
              <FavoriteMealItem key={meal.id} meal={meal} onSelect={onSelect} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
