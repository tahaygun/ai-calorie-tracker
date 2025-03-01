import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useRef, useState } from 'react';

// Extend NutritionData to include grams
type ExtendedNutritionData = NutritionData & {
  grams: number;
};

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (
    itemIndex: number,
    field: keyof NutritionData,
    value: number
  ) => void;
  onUpdateItemName: (itemIndex: number, newName: string) => void;
  onRemoveItem: (itemIndex: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NutritionEditor({
  items,
  onUpdateItem,
  onUpdateItemName,
  onRemoveItem,
  onConfirm,
  onCancel,
}: NutritionEditorProps) {
  // Store original nutrition values per gram for each item
  const initialNutritionPerGram = useRef<(ExtendedNutritionData | null)[]>([]);

  // Track whether we're in the middle of changing a value
  const [activeChange, setActiveChange] = useState<{
    itemIndex: number;
    field: string;
    value: string; // Store as string to allow empty input
  } | null>(null);

  // Track name editing
  const [activeNameEdit, setActiveNameEdit] = useState<{
    itemIndex: number;
    value: string;
  } | null>(null);

  // Initialize the per-gram nutrition values
  useEffect(() => {
    initialNutritionPerGram.current = items.map((item) => {
      const nutrition = item.nutrition as ExtendedNutritionData;
      if (!nutrition.grams || nutrition.grams === 0) {
        return null;
      }

      // Calculate per gram values
      const perGramValues: ExtendedNutritionData = {
        calories: nutrition.calories / nutrition.grams,
        protein: nutrition.protein / nutrition.grams,
        carbs: nutrition.carbs / nutrition.grams,
        fat: nutrition.fat / nutrition.grams,
        fiber: nutrition.fiber / nutrition.grams,
        grams: 1, // 1 gram per gram
      };

      return perGramValues;
    });
  }, [items]);

  // Handle input change without immediate update
  const handleInputChange = (
    itemIndex: number,
    field: string,
    value: string
  ) => {
    setActiveChange({ itemIndex, field, value });
  };

  // Handle name change without immediate update
  const handleNameChange = (itemIndex: number, value: string) => {
    setActiveNameEdit({ itemIndex, value });
  };

  // Commit the name change
  const commitNameChange = () => {
    if (!activeNameEdit) return;

    const { itemIndex, value } = activeNameEdit;
    onUpdateItemName(itemIndex, value.trim() || 'Unnamed Item');
    setActiveNameEdit(null);
  };

  // Commit the change and update all values when needed
  const commitChange = () => {
    if (!activeChange) return;

    const { itemIndex, field, value } = activeChange;

    // Convert to number only when committing, if empty string use 0
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;

    // If we're updating grams, scale all other values
    if (field === 'grams' && initialNutritionPerGram.current[itemIndex]) {
      const perGramValues = initialNutritionPerGram.current[itemIndex];
      if (perGramValues) {
        // Update all nutrition values based on grams
        Object.keys(perGramValues).forEach((nutrientKey) => {
          if (nutrientKey !== 'grams') {
            const scaledValue =
              perGramValues[nutrientKey as keyof ExtendedNutritionData] *
              numericValue;
            onUpdateItem(
              itemIndex,
              nutrientKey as keyof NutritionData,
              scaledValue
            );
          }
        });
      }
    }

    // Update the requested field
    onUpdateItem(itemIndex, field as keyof NutritionData, numericValue);

    // Clear the active change
    setActiveChange(null);
  };

  return (
    <div className='bg-gray-800 p-3 border border-gray-700 rounded'>
      <h2 className='mb-2 font-semibold text-sm'>
        Verify Nutrition Information
      </h2>
      <div className='space-y-3'>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className='bg-gray-700 p-2.5 rounded'>
            <div className='flex justify-between items-center mb-2'>
              {activeNameEdit && activeNameEdit.itemIndex === itemIndex ? (
                <input
                  type='text'
                  value={activeNameEdit.value}
                  onChange={(e) => handleNameChange(itemIndex, e.target.value)}
                  onBlur={commitNameChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      commitNameChange();
                    }
                  }}
                  className='bg-gray-600 px-2 py-1 border border-gray-500 rounded w-full font-medium text-gray-100 text-sm'
                  autoFocus
                />
              ) : (
                <div className='flex items-center'>
                  <p className='font-medium text-sm'>{item.item}</p>
                  <button
                    onClick={() =>
                      setActiveNameEdit({ itemIndex, value: item.item })
                    }
                    className='ml-2 p-0.5 text-gray-400 hover:text-white'
                    title='Edit item name'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      className='w-3.5 h-3.5'
                    >
                      <path d='M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z' />
                      <path d='M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z' />
                    </svg>
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemoveItem(itemIndex)}
                className='p-1 text-red-400 hover:text-red-300'
                title='Remove item'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
            <div className='gap-2 grid grid-cols-3 md:grid-cols-5'>
              {Object.entries(item.nutrition).map(([key, value]) => (
                <div key={key} className='flex flex-col'>
                  <label className='mb-0.5 text-gray-400 text-xs'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type='number'
                    value={
                      activeChange &&
                      activeChange.itemIndex === itemIndex &&
                      activeChange.field === key
                        ? activeChange.value
                        : value.toString()
                    }
                    onChange={(e) => {
                      handleInputChange(itemIndex, key, e.target.value);
                    }}
                    onBlur={() => {
                      commitChange();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        commitChange();
                      }
                    }}
                    className='bg-gray-600 px-2 py-1 border border-gray-500 rounded w-full text-gray-100 text-sm'
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className='mt-2.5 pt-2 border-gray-600 border-t'>
          <div className='gap-2 grid grid-cols-3 md:grid-cols-5 text-xs'>
            {Object.keys(items[0]?.nutrition || {}).map((key) => {
              const total = items.reduce(
                (sum, item) =>
                  sum + (item.nutrition[key as keyof NutritionData] || 0),
                0
              );
              return (
                <div
                  key={key}
                  className='flex flex-col items-center bg-gray-900 px-2 py-1.5 rounded'
                >
                  <span className='text-gray-400'>
                    Total {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className='font-bold text-green-400 text-sm'>
                    {total.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className='flex gap-2 mt-3'>
        <button
          onClick={onConfirm}
          className='bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded font-medium text-sm transition-colors'
        >
          Confirm & Save
        </button>
        <button
          onClick={onCancel}
          className='bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
