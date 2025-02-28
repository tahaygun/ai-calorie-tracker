import { FoodItemNutrition } from '@/lib/openai';

interface FavoriteMeal {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  timestamp: string;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteMeal[];
  onAddFavorite: (meal: FavoriteMeal) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesModal({ isOpen, onClose, favorites, onAddFavorite, onRemoveFavorite }: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        <div className='p-3 border-b border-gray-700 flex justify-between items-center'>
          <h2 className='text-sm font-semibold'>Favorite Meals</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-300 p-1'>
            ✕
          </button>
        </div>

        <div className='p-3 overflow-y-auto max-h-[calc(90vh-3.5rem)]'>
          {favorites.length === 0 ? (
            <p className='text-sm text-gray-400 text-center'>No favorite meals yet</p>
          ) : (
            <div className='space-y-2'>
              {favorites.map((meal) => (
                <div key={meal.id} className='p-2 bg-gray-700 rounded'>
                  <div className='flex items-center gap-2 mb-2'>
                    <p className='text-sm flex-1'>{meal.description}</p>
                    <div className='flex gap-2 shrink-0'>
                      <button onClick={() => onAddFavorite(meal)} className='bg-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-700'>
                        Add
                      </button>
                      <button onClick={() => onRemoveFavorite(meal.id)} className='text-xs text-red-400 hover:text-red-300'>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className='space-y-1.5'>
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
          )}
        </div>
      </div>
    </div>
  );
}
