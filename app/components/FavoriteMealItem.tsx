import type { MealEntry } from '@/lib/types';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface FavoriteMealItemProps {
  meal: MealEntry;
  onSelect: (_meal: MealEntry) => void;
  onDelete: (_id: string) => void;
}

export default function FavoriteMealItem({ meal, onSelect, onDelete }: FavoriteMealItemProps) {
  const totalCalories = meal.items.reduce((sum, item) => sum + item.nutrition.calories, 0);

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-xl transition-all flex justify-between items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100 truncate">{meal.description}</p>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-amber-400 font-mono font-bold">{Math.round(totalCalories)} kcal</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">{meal.items.length} {meal.items.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(meal)}
          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 active:scale-[0.97]"
        >
          <FaPlus className="w-3 h-3" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(meal.id)}
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all"
          title="Delete favorite"
          aria-label="Delete favorite meal"
        >
          <FaTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
