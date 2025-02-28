import type { MealEntry } from '../lib/types';
import MealItem from './MealItem';

interface MealListProps {
  meals: MealEntry[];
  onToggleFavorite: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export default function MealList({ meals, onToggleFavorite, onDelete, isFavorite }: MealListProps) {
  if (meals.length === 0) return null;

  return (
    <div className='mt-6'>
      <h3 className='text-sm font-semibold mb-2'>Logged Meals</h3>
      <div className='space-y-3'>
        {meals.map((meal) => (
          <MealItem
            key={meal.id}
            id={meal.id}
            description={meal.description}
            items={meal.items}
            isFavorite={isFavorite(meal.id)}
            onToggleFavorite={() => onToggleFavorite(meal)}
            onDelete={() => onDelete(meal.id)}
          />
        ))}
      </div>
    </div>
  );
}
