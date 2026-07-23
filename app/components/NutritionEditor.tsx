import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import NutritionItemCard from './NutritionItemCard';
import ServingSizeSelector from './ServingSizeSelector';

// Extended type to include grams in nutrition data
type ExtendedNutritionData = NutritionData & {
  grams: number;
};

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (_itemIndex: number, _field: keyof NutritionData, _value: number) => void;
  onUpdateItemName: (_itemIndex: number, _newName: string) => void;
  onRemoveItem: (_itemIndex: number) => void;
  onConfirm: (_adjustedItems: FoodItemNutrition[]) => void;
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

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl shadow-black/40 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <span>✨</span> Verify Nutrition Information
          </h2>
          <p className="text-xs text-slate-400">Review AI-estimated nutrients and adjust portions</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* List of food items with editable fields */}
      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <NutritionItemCard
            key={itemIndex}
            itemIndex={itemIndex}
            item={item}
            activeNameEdit={activeNameEdit}
            handleNameChange={handleNameChange}
            commitNameChange={commitNameChange}
            setActiveNameEdit={setActiveNameEdit}
            onRemoveItem={onRemoveItem}
            getDisplayValue={getDisplayValue}
            handleInputChange={handleInputChange}
            commitChange={commitChange}
          />
        ))}
      </div>

      {/* Nutrition totals summary (only shown when multiple items exist) */}
      {items.length > 1 ? (
        <div className="pt-3 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Combined Meal Totals
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                  className="flex flex-col items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/80"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {key}
                  </span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">{total.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Serving Size Adjustment Section */}
      <ServingSizeSelector
        activeServingEdit={activeServingEdit}
        onServingChange={handleServingSizeChange}
        onCommit={commitServingSizeChange}
        onButtonClick={handleServingSizeButtonClick}
      />

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
        >
          <FaArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Back to Form</span>
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
        >
          <FaCheck className="w-3.5 h-3.5" />
          <span>Confirm & Save</span>
        </button>
      </div>
    </div>
  );
}
