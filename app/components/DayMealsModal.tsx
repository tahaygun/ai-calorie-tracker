import type { FoodItemNutrition } from '@/lib/openai';

interface StoredMeal {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  timestamp: string;
}

interface DayMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  meals: StoredMeal[];
}

export default function DayMealsModal({ isOpen, onClose, date, meals }: DayMealsModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        <div className='p-3 border-b border-gray-700 flex justify-between items-center'>
          <h2 className='text-sm font-semibold'>Meals for {new Date(date).toLocaleDateString()}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-300 p-1'>
            ✕
          </button>
        </div>

        <div className='p-3 overflow-y-auto max-h-[calc(90vh-3.5rem)]'>
          <div className='space-y-3'>
            {meals.map((meal) => (
              <div key={meal.id} className='p-3 bg-gray-700 rounded'>
                <p className='text-sm mb-2'>{meal.description}</p>
                <div className='space-y-2'>
                  {meal.items.map((item, index) => (
                    <div key={index} className='bg-gray-600 p-2 rounded text-xs'>
                      <p className='mb-1 text-gray-300'>{item.item}</p>
                      <div className='grid grid-cols-5 gap-2 text-gray-300'>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
