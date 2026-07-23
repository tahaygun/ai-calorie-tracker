import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import MacroInput from './MacroInput';

interface NutritionItemCardProps {
  itemIndex: number;
  item: FoodItemNutrition;
  activeNameEdit: { itemIndex: number; value: string } | null;
  handleNameChange: (_itemIndex: number, _value: string) => void;
  commitNameChange: () => void;
  setActiveNameEdit: (_val: { itemIndex: number; value: string } | null) => void;
  onRemoveItem: (_itemIndex: number) => void;
  getDisplayValue: (_itemIndex: number, _field: keyof NutritionData, _value: number) => string;
  handleInputChange: (_itemIndex: number, _field: keyof NutritionData, _value: string) => void;
  commitChange: () => void;
}

export default function NutritionItemCard({
  itemIndex,
  item,
  activeNameEdit,
  handleNameChange,
  commitNameChange,
  setActiveNameEdit,
  onRemoveItem,
  getDisplayValue,
  handleInputChange,
  commitChange,
}: NutritionItemCardProps) {
  const isEditingName = activeNameEdit && activeNameEdit.itemIndex === itemIndex;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl space-y-3 shadow-md shadow-black/20">
      <div className="flex justify-between items-center gap-2">
        {isEditingName ? (
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
            className="bg-slate-950/80 px-3 py-1.5 border border-blue-500/80 rounded-xl w-full font-semibold text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveNameEdit({ itemIndex, value: item.item })}>
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-blue-400 transition-colors">
              {item.item}
            </h3>
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-blue-400 transition-colors opacity-80 group-hover:opacity-100"
              title="Edit item name"
            >
              <FaPen className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemoveItem(itemIndex)}
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all"
          title="Remove item"
          aria-label="Remove food item"
        >
          <FaTrash className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Nutrition input fields grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(Object.keys(item.nutrition) as Array<keyof NutritionData>).map(field => (
          <MacroInput
            key={field}
            field={field}
            value={getDisplayValue(itemIndex, field, item.nutrition[field])}
            onChange={(f, val) => handleInputChange(itemIndex, f, val)}
            onBlur={commitChange}
          />
        ))}
      </div>
    </div>
  );
}
