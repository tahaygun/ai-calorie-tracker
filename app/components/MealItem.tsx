import type { FoodItemNutrition } from '@/lib/openai';

interface MealItemProps {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  timestamp?: string;
}

export default function MealItem({
  description,
  items,
  isFavorite,
  onToggleFavorite,
  onDelete,
  timestamp,
}: MealItemProps) {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="bg-gray-800 p-3 border border-gray-700 rounded">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <p className="text-sm">{description}</p>
          {formattedTime && <p className="mt-1 text-gray-400 text-xs">Added at {formattedTime}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onToggleFavorite}
            className={`text-xl leading-none ${
              isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
            }`}
          >
            ★
          </button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-300 text-sm">
            Delete
          </button>
        </div>
      </div>
      <div className="space-y-2">
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
        {items.length > 1 && (
          <div className="bg-blue-700/20 mt-2 p-2 border-t border-blue-600 rounded">
            <div className="gap-2 grid grid-cols-5 text-gray-300 text-xs">
              <div>
                <span className="text-gray-400">Cal</span>{' '}
                {items.reduce((sum, item) => sum + item.nutrition.calories, 0)}
              </div>
              <div>
                <span className="text-gray-400">P</span>{' '}
                {items.reduce((sum, item) => sum + item.nutrition.protein, 0)}g
              </div>
              <div>
                <span className="text-gray-400">C</span>{' '}
                {items.reduce((sum, item) => sum + item.nutrition.carbs, 0)}g
              </div>
              <div>
                <span className="text-gray-400">F</span>{' '}
                {items.reduce((sum, item) => sum + item.nutrition.fat, 0)}g
              </div>
              <div>
                <span className="text-gray-400">Fb</span>{' '}
                {items.reduce((sum, item) => sum + item.nutrition.fiber, 0)}g
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
