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
    <div className="mt-6">
      <h3 className="mb-2 font-semibold text-sm">Logged Meals</h3>
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
