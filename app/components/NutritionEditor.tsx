import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useRef, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

// Extended type to include grams in nutrition data
type ExtendedNutritionData = NutritionData & {
  grams: number;
};

// Common serving size options for quick selection
const SERVING_SIZE_OPTIONS = [
  { value: '0.25', label: '1/4' },
  { value: '0.33', label: '1/3' },
  { value: '0.5', label: '1/2' },
  { value: '0.75', label: '3/4' },
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
];

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (itemIndex: number, field: keyof NutritionData, value: number) => void;
  onUpdateItemName: (itemIndex: number, newName: string) => void;
  onRemoveItem: (itemIndex: number) => void;
  onConfirm: (adjustedItems: FoodItemNutrition[]) => void;
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

  // Original items without serving size adjustment
  const [originalItems, setOriginalItems] = useState<FoodItemNutrition[]>([]);
  const isInitialized = useRef(false);

  // Track whether we're in the middle of changing a value
  const [activeChange, setActiveChange] = useState<{
    itemIndex: number;
    field: keyof NutritionData;
    value: string; // Store as string to allow empty input
  } | null>(null);

  // Track name editing
  const [activeNameEdit, setActiveNameEdit] = useState<{
    itemIndex: number;
    value: string;
  } | null>(null);

  // Serving size state
  const [servingSize, setServingSize] = useState<number>(1);
  const [activeServingEdit, setActiveServingEdit] = useState<string>('1');

  // Initialize the per-gram nutrition values and store original items
  useEffect(() => {
    if (items.length > 0 && !isInitialized.current) {
      // Initialize original items once
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      isInitialized.current = true;

      initialNutritionPerGram.current = items.map(item => {
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
    }
  }, [items]);

  // Handle input change without immediate update
  const handleInputChange = (itemIndex: number, field: keyof NutritionData, value: string) => {
    setActiveChange({ itemIndex, field, value });
  };

  // Handle name change without immediate update
  const handleNameChange = (itemIndex: number, value: string) => {
    setActiveNameEdit({ itemIndex, value });
  };

  // Handle serving size change
  const handleServingSizeChange = (value: string) => {
    setActiveServingEdit(value);
  };

  // Commit the serving size change - only changes the display value, not actual data
  const commitServingSizeChange = () => {
    const newServingSize = parseFloat(activeServingEdit) || 1;
    if (newServingSize <= 0) {
      setActiveServingEdit('1');
      setServingSize(1);
      return;
    }

    setServingSize(newServingSize);
    setActiveServingEdit(newServingSize.toString());
  };

  // Handle serving size quick button selection
  const handleServingSizeButtonClick = (value: string) => {
    setActiveServingEdit(value);
    setServingSize(parseFloat(value));
  };

  // Commit the name change
  const commitNameChange = () => {
    if (!activeNameEdit) return;

    const { itemIndex, value } = activeNameEdit;
    const newName = value.trim() || 'Unnamed Item';

    onUpdateItemName(itemIndex, newName);

    // Update in our local reference
    setOriginalItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[itemIndex]) {
        newItems[itemIndex].item = newName;
      }
      return newItems;
    });

    setActiveNameEdit(null);
  };

  // Commit the nutrition value change and update related values if needed
  const commitChange = () => {
    if (!activeChange) return;

    const { itemIndex, field, value } = activeChange;

    // Convert to number only when committing, if empty string use 0
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;

    // If we're updating grams, scale all other nutrition values
    if (field === ('grams' as keyof NutritionData) && initialNutritionPerGram.current[itemIndex]) {
      const perGramValues = initialNutritionPerGram.current[itemIndex];
      if (perGramValues) {
        // Update all nutrition values based on grams
        (Object.keys(perGramValues) as Array<keyof ExtendedNutritionData>).forEach(nutrientKey => {
          if (nutrientKey !== 'grams') {
            const scaledValue = parseFloat((perGramValues[nutrientKey] * numericValue).toFixed(2));
            onUpdateItem(itemIndex, nutrientKey, scaledValue);

            // Also update in our original items reference
            setOriginalItems(prevItems => {
              const newItems = [...prevItems];
              if (newItems[itemIndex]) {
                newItems[itemIndex].nutrition[nutrientKey] = scaledValue;
              }
              return newItems;
            });
          }
        });
      }
    }

    // Update the requested field in the parent component
    onUpdateItem(itemIndex, field, numericValue);

    // Update in our original items reference
    setOriginalItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[itemIndex]) {
        newItems[itemIndex].nutrition[field] = numericValue;
      }
      return newItems;
    });

    // Clear the active change
    setActiveChange(null);
  };

  // Calculate display value with serving size adjustment
  const getDisplayValue = (
    itemIndex: number,
    field: keyof NutritionData,
    value: number
  ): string => {
    // If we're actively editing this field, return the active change value
    if (activeChange && activeChange.itemIndex === itemIndex && activeChange.field === field) {
      return activeChange.value;
    }

    // If we don't have original items initialized yet, use the actual value
    if (!isInitialized.current || originalItems.length === 0) {
      return value.toString();
    }

    // If this item doesn't exist in original items, use the actual value
    if (!originalItems[itemIndex] || originalItems[itemIndex].nutrition[field] === undefined) {
      return value.toString();
    }

    // Get the original value and apply serving size multiplier
    const originalValue = originalItems[itemIndex].nutrition[field];
    const displayValue = parseFloat((originalValue * servingSize).toFixed(2));

    return displayValue.toString();
  };

  // Handle confirmation - apply serving size to all items before confirming
  const handleConfirm = () => {
    // If serving size is 1, we can just pass the original items
    if (servingSize === 1) {
      onConfirm([...items]);
      return;
    }

    // Create a deep copy of the items with adjusted values for serving size
    const adjustedItems = items.map((item, itemIndex) => {
      // Skip if original item doesn't exist
      if (!originalItems[itemIndex]) return item;

      // Copy the item and create new nutrition object with scaled values
      const newItem = { ...item };
      const scaledNutrition = { ...item.nutrition };

      // Apply scaling to each nutrition field
      (Object.keys(originalItems[itemIndex].nutrition) as Array<keyof NutritionData>).forEach(
        key => {
          const originalValue = originalItems[itemIndex].nutrition[key];
          scaledNutrition[key] = parseFloat((originalValue * servingSize).toFixed(2));
        }
      );

      newItem.nutrition = scaledNutrition;
      return newItem;
    });

    // Call onConfirm with the adjusted items
    onConfirm(adjustedItems);
  };

  // Render a nutrition input field with proper handlers
  const renderNutritionInput = (itemIndex: number, field: keyof NutritionData, value: number) => (
    <div key={field} className="flex flex-col">
      <label className="mb-0.5 text-gray-400 text-xs">
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <input
        type="number"
        value={getDisplayValue(itemIndex, field, value)}
        onChange={e => handleInputChange(itemIndex, field, e.target.value)}
        onBlur={commitChange}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            commitChange();
          }
        }}
        className="bg-gray-600 px-2 py-1 border border-gray-500 rounded w-full text-gray-100 text-sm"
      />
    </div>
  );

  return (
    <div className="bg-gray-800 p-3 border border-gray-700 rounded">
      <h2 className="mb-2 font-semibold text-sm">Verify Nutrition Information</h2>

      {/* List of food items with editable fields */}
      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="bg-gray-700 p-2.5 rounded">
            <div className="flex justify-between items-center mb-2">
              {activeNameEdit && activeNameEdit.itemIndex === itemIndex ? (
                <input
                  type="text"
                  value={activeNameEdit.value}
                  onChange={e => handleNameChange(itemIndex, e.target.value)}
                  onBlur={commitNameChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      commitNameChange();
                    }
                  }}
                  className="bg-gray-600 px-2 py-1 border border-gray-500 rounded w-full font-medium text-gray-100 text-sm"
                  autoFocus
                />
              ) : (
                <div className="flex items-center">
                  <p className="font-medium text-sm">{item.item}</p>
                  <button
                    onClick={() => setActiveNameEdit({ itemIndex, value: item.item })}
                    className="ml-2 p-0.5 text-gray-400 hover:text-white"
                    title="Edit item name"
                  >
                    <FaPen className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemoveItem(itemIndex)}
                className="p-1 text-red-400 hover:text-red-300"
                title="Remove item"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            {/* Nutrition input fields grid */}
            <div className="gap-2 grid grid-cols-3 md:grid-cols-5">
              {Object.entries(item.nutrition).map(([key, value]) =>
                renderNutritionInput(itemIndex, key as keyof NutritionData, value)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nutrition totals summary (only shown when multiple items exist) */}
      {items.length > 1 ? (
        <div className="mt-2.5 pt-2 border-gray-600 border-t">
          <div className="gap-2 grid grid-cols-3 md:grid-cols-5 text-xs">
            {Object.keys(items[0]?.nutrition || {}).map(key => {
              // Calculate totals with serving size adjustments
              const total = !isInitialized.current
                ? items.reduce(
                    (sum, item) => sum + (item.nutrition[key as keyof NutritionData] || 0),
                    0
                  )
                : originalItems.reduce((sum, item, index) => {
                    if (index < items.length) {
                      // Only include items that still exist
                      return sum + (item.nutrition[key as keyof NutritionData] * servingSize || 0);
                    }
                    return sum;
                  }, 0);

              return (
                <div
                  key={key}
                  className="flex flex-col items-center bg-gray-900 px-2 py-1.5 rounded"
                >
                  <span className="text-gray-400">
                    Total {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="font-bold text-green-400 text-sm">{total.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Serving Size Adjustment Section */}
      <div className="mt-4 pt-4 border-gray-700 border-t">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Serving:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={activeServingEdit}
                onChange={e => handleServingSizeChange(e.target.value)}
                onBlur={commitServingSizeChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    commitServingSizeChange();
                  }
                }}
                className="bg-gray-700 px-2 py-1 border border-gray-600 rounded w-16 text-gray-100 text-sm text-center"
              />
              <span className="text-gray-400">serving(s)</span>
            </div>
          </div>

          {/* Serving size quick selection buttons */}
          <div className="flex justify-center gap-2 mt-1">
            {SERVING_SIZE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleServingSizeButtonClick(option.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  Math.abs(parseFloat(activeServingEdit) - parseFloat(option.value)) < 0.01
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="text-gray-400 text-xs text-center">
            Adjust serving size to scale all nutrition values
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-2 mt-3">
        <button
          onClick={handleConfirm}
          className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded font-medium text-sm transition-colors"
        >
          Confirm & Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
