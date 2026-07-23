import type { FoodItemNutrition } from '@/lib/openai';
import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaPencilAlt,
  FaRegStar,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import MealMacroSummaryBar from './MealMacroSummaryBar';

interface MealItemProps {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  timestamp?: string;
}

export default function MealItem({
  description,
  items,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onEdit,
  timestamp,
}: MealItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  // Calculate totals
  const totalCalories = parseFloat(
    items.reduce((sum, item) => sum + item.nutrition.calories, 0).toFixed(2)
  );
  const totalProtein = parseFloat(
    items.reduce((sum, item) => sum + item.nutrition.protein, 0).toFixed(2)
  );
  const totalCarbs = parseFloat(
    items.reduce((sum, item) => sum + item.nutrition.carbs, 0).toFixed(2)
  );
  const totalFat = parseFloat(items.reduce((sum, item) => sum + item.nutrition.fat, 0).toFixed(2));
  const totalFiber = parseFloat(
    items.reduce((sum, item) => sum + item.nutrition.fiber, 0).toFixed(2)
  );

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl shadow-md shadow-black/20 overflow-hidden transition-all">
      {/* Header section - click to expand */}
      <div className="cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center p-4">
          <div className="flex-1 mr-3">
            <h4 className="font-semibold text-slate-100 text-base group-hover:text-blue-400 transition-colors">
              {description}
            </h4>
            {formattedTime && (
              <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs font-mono">
                <FaClock className="w-3 h-3 text-slate-500" />
                <span>Added at {formattedTime}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800 whitespace-nowrap">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-xl transition-all ${
                  isFavorite
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-label="Toggle favorite status"
              >
                {isFavorite ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
              </button>

              {onEdit && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 border border-transparent rounded-xl transition-all"
                  title="Edit meal"
                  aria-label="Edit meal"
                >
                  <FaPencilAlt className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent rounded-xl transition-all"
                title="Delete meal"
                aria-label="Delete meal"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="p-1 text-slate-400 group-hover:text-slate-200 transition-colors">
              {isExpanded ? <FaChevronDown className="w-3.5 h-3.5" /> : <FaChevronRight className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>

        {/* Summary nutrition bar */}
        <MealMacroSummaryBar
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          totalCarbs={totalCarbs}
          totalFat={totalFat}
          totalFiber={totalFiber}
        />
      </div>

      {/* Detailed item list - visible when expanded */}
      {isExpanded && (
        <div className="space-y-2 p-3.5 bg-slate-950/40 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Itemized Breakdown
          </span>
          {items.map((item, index) => (
            <div key={index} className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-100 text-sm">{item.item}</span>
                <span className="text-xs font-mono font-bold text-amber-400">{item.nutrition.calories} kcal</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                <div className="bg-blue-500/10 text-blue-300 py-1 rounded border border-blue-500/20">
                  P: {item.nutrition.protein}g
                </div>
                <div className="bg-yellow-500/10 text-yellow-300 py-1 rounded border border-yellow-500/20">
                  C: {item.nutrition.carbs}g
                </div>
                <div className="bg-pink-500/10 text-pink-300 py-1 rounded border border-pink-500/20">
                  F: {item.nutrition.fat}g
                </div>
                <div className="bg-emerald-500/10 text-emerald-300 py-1 rounded border border-emerald-500/20">
                  Fb: {item.nutrition.fiber}g
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
