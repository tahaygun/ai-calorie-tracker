import type { NutritionData } from '@/lib/openai';
import React from 'react';

interface MacroInputProps {
  field: keyof NutritionData;
  value: string;
  onChange: (_field: keyof NutritionData, _value: string) => void;
  onBlur: () => void;
}

const MACRO_CONFIG: Record<
  string,
  { label: string; unit: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  calories: {
    label: 'Calories',
    unit: 'kcal',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30 focus-within:border-amber-400 focus-within:ring-amber-500/20',
  },
  protein: {
    label: 'Protein',
    unit: 'g',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30 focus-within:border-blue-400 focus-within:ring-blue-500/20',
  },
  carbs: {
    label: 'Carbs',
    unit: 'g',
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/30 focus-within:border-yellow-400 focus-within:ring-yellow-500/20',
  },
  fat: {
    label: 'Fat',
    unit: 'g',
    colorClass: 'text-pink-400',
    bgClass: 'bg-pink-500/10',
    borderClass: 'border-pink-500/30 focus-within:border-pink-400 focus-within:ring-pink-500/20',
  },
  fiber: {
    label: 'Fiber',
    unit: 'g',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30 focus-within:border-emerald-400 focus-within:ring-emerald-500/20',
  },
  grams: {
    label: 'Grams',
    unit: 'g',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30 focus-within:border-purple-400 focus-within:ring-purple-500/20',
  },
};

export default function MacroInput({ field, value, onChange, onBlur }: MacroInputProps) {
  const config = MACRO_CONFIG[field] || {
    label: field.charAt(0).toUpperCase() + field.slice(1),
    unit: '',
    colorClass: 'text-slate-300',
    bgClass: 'bg-slate-800/50',
    borderClass: 'border-slate-700/50 focus-within:border-slate-400',
  };

  return (
    <div
      className={`flex flex-col p-2 rounded-xl border transition-all ${config.bgClass} ${config.borderClass} focus-within:ring-2`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[11px] font-semibold tracking-wide ${config.colorClass}`}>
          {config.label}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">{config.unit}</span>
      </div>
      <input
        type="number"
        step="any"
        value={value}
        onChange={e => onChange(field, e.target.value)}
        onBlur={onBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onBlur();
          }
        }}
        className="w-full bg-transparent text-slate-100 font-semibold text-sm outline-none font-mono"
      />
    </div>
  );
}
