import type { FoodItemNutrition } from '@/lib/openai';

interface MealItemProps {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export default function MealItem({ description, items, isFavorite, onToggleFavorite, onDelete }: MealItemProps) {
  return (
    <div className='p-3 bg-gray-800 rounded border border-gray-700'>
      <div className='flex justify-between items-start gap-3 mb-2'>
        <p className='text-sm'>{description}</p>
        <div className='flex gap-2 shrink-0'>
          <button
            onClick={onToggleFavorite}
            className={`text-xl leading-none ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
          >
            ★
          </button>
          <button onClick={onDelete} className='text-sm text-red-400 hover:text-red-300'>
            Delete
          </button>
        </div>
      </div>
      <div className='space-y-2'>
        {items.map((item, index) => (
          <div key={index} className='bg-gray-700 p-2 rounded'>
            <p className='text-sm mb-1'>{item.item}</p>
            <div className='grid grid-cols-5 gap-2 text-xs text-gray-300'>
              <div>
                <span className='text-gray-400'>Cal</span> {item.nutrition.calories}
              </div>
              <div>
                <span className='text-gray-400'>P</span> {item.nutrition.protein}g
              </div>
              <div>
                <span className='text-gray-400'>C</span> {item.nutrition.carbs}g
              </div>
              <div>
                <span className='text-gray-400'>F</span> {item.nutrition.fat}g
              </div>
              <div>
                <span className='text-gray-400'>Fb</span> {item.nutrition.fiber}g
              </div>
            </div>
          </div>
        ))}
        {items.length > 1 && (
          <div className='bg-gray-700/50 p-2 rounded mt-2 border-t border-gray-600'>
            <div className='grid grid-cols-5 gap-2 text-xs text-gray-300'>
              <div>
                <span className='text-gray-400'>Cal</span> {items.reduce((sum, item) => sum + item.nutrition.calories, 0)}
              </div>
              <div>
                <span className='text-gray-400'>P</span> {items.reduce((sum, item) => sum + item.nutrition.protein, 0)}g
              </div>
              <div>
                <span className='text-gray-400'>C</span> {items.reduce((sum, item) => sum + item.nutrition.carbs, 0)}g
              </div>
              <div>
                <span className='text-gray-400'>F</span> {items.reduce((sum, item) => sum + item.nutrition.fat, 0)}g
              </div>
              <div>
                <span className='text-gray-400'>Fb</span> {items.reduce((sum, item) => sum + item.nutrition.fiber, 0)}g
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
