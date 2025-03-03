import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useRef, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

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
            const scaledValue = parseFloat(
              (
                perGramValues[nutrientKey as keyof ExtendedNutritionData] *
                numericValue
              ).toFixed(2)
            );
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
                    <FaPen className='w-3.5 h-3.5' />
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemoveItem(itemIndex)}
                className='p-1 text-red-400 hover:text-red-300'
                title='Remove item'
              >
                <FaTrash className='w-4 h-4' />
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
