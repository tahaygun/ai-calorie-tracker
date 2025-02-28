import type { MealEntry } from '@/lib/types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MealEntry[];
  onSelect: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
}

export default function FavoritesModal({ isOpen, onClose, favorites, onSelect, onDelete }: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-gray-800 rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Favorite Meals</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-300'>
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <p className='text-gray-400 text-center py-4'>No favorite meals yet</p>
        ) : (
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {favorites.map((meal) => (
              <div key={meal.id} className='p-3 bg-gray-700 rounded'>
                <div className='flex justify-between items-start gap-2'>
                  <div>
                    <p className='text-sm mb-1'>{meal.description}</p>
                    <p className='text-xs text-gray-400'>
                      {new Date(meal.timestamp).toLocaleDateString()} - {meal.items.reduce((sum, item) => sum + item.nutrition.calories, 0)}{' '}
                      calories
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={() => onSelect(meal)} className='text-sm text-blue-400 hover:text-blue-300'>
                      Add
                    </button>
                    <button onClick={() => onDelete(meal.id)} className='text-sm text-red-400 hover:text-red-300'>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
