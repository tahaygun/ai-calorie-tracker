import type { MealEntry } from '../../lib/types';
import MealItem from './MealItem';

interface MealListProps {
  meals: MealEntry[];
  onToggleFavorite: (_meal: MealEntry) => void;
  onDelete: (_id: string) => void;
  onEdit?: (_meal: MealEntry) => void;
  isFavorite: (_id: string) => boolean;
}

export default function MealList({
  meals,
  onToggleFavorite,
  onDelete,
  onEdit,
  isFavorite,
}: MealListProps) {
  if (meals.length === 0) return null;

  // Sort meals by timestamp in descending order (newest first)
  const sortedMeals = [...meals].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <span>🍽️</span> Logged Meals
        </h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
          {sortedMeals.length} {sortedMeals.length === 1 ? 'meal' : 'meals'} logged
        </span>
      </div>

      <div className="space-y-3">
        {sortedMeals.map(meal => (
          <MealItem
            key={meal.id}
            id={meal.id}
            description={meal.description}
            items={meal.items}
            timestamp={meal.timestamp}
            isFavorite={isFavorite(meal.id)}
            onToggleFavorite={() => onToggleFavorite(meal)}
            onDelete={() => onDelete(meal.id)}
            onEdit={onEdit ? () => onEdit(meal) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
