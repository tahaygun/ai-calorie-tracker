import type { FoodItemNutrition } from '@/lib/openai';
import { useState } from 'react';
import {
  FaChevronDown,
  FaChevronRight,
  FaPencilAlt,
  FaRegStar,
  FaStar,
  FaTrash,
} from 'react-icons/fa';

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
    <div className="bg-gray-800 border border-gray-700 rounded">
      {/* Header section - always visible */}
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center p-3">
          <div className="flex-1 mr-2">
            <p className="text-sm">{description}</p>
            {formattedTime && (
              <p className="mt-1 text-gray-400 text-xs">Added at {formattedTime}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs whitespace-nowrap">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`${
                  isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                }`}
              >
                {isFavorite ? <FaStar size={16} /> : <FaRegStar size={16} />}
              </button>
              {onEdit && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <FaPencilAlt size={14} />
                </button>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-400 hover:text-red-300"
              >
                <FaTrash size={14} />
              </button>
            </div>

            <span className="text-gray-400">
              {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
            </span>
          </div>
        </div>

        {/* Summary nutrition info - always visible */}
        <div className="bg-blue-700/20 p-2 border-t border-blue-600/30">
          <div className="gap-2 grid grid-cols-5 text-gray-300 text-xs">
            <div>
              <span className="text-gray-400">Cal</span> {totalCalories}
            </div>
            <div>
              <span className="text-gray-400">P</span> {totalProtein}g
            </div>
            <div>
              <span className="text-gray-400">C</span> {totalCarbs}g
            </div>
            <div>
              <span className="text-gray-400">F</span> {totalFat}g
            </div>
            <div>
              <span className="text-gray-400">Fb</span> {totalFiber}g
            </div>
          </div>
        </div>
      </div>

      {/* Detailed items - only visible when expanded */}
      {isExpanded && (
        <div className="space-y-2 p-3 pt-0">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded">
              <p className="mb-1 text-sm">{item.item}</p>
              <div className="gap-2 grid grid-cols-5 text-gray-300 text-xs">
                <div>
                  <span className="text-gray-400">Cal</span> {item.nutrition.calories}
                </div>
                <div>
                  <span className="text-gray-400">P</span> {item.nutrition.protein}g
                </div>
                <div>
                  <span className="text-gray-400">C</span> {item.nutrition.carbs}g
                </div>
                <div>
                  <span className="text-gray-400">F</span> {item.nutrition.fat}g
                </div>
                <div>
                  <span className="text-gray-400">Fb</span> {item.nutrition.fiber}g
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
