import React from 'react';
import MacroProgressBadge from './MacroProgressBadge';

interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CalorieProgressProps {
  totals: NutritionTotals;
  targetCalories: number;
}

export default function CalorieProgress({ totals, targetCalories }: CalorieProgressProps) {
  const calories = Math.round(totals.calories);
  const percentage = Math.min(Math.max((calories / targetCalories) * 100, 0), 100);
  const remaining = targetCalories - calories;
  const isOver = remaining < 0;

  let barGradient = 'from-emerald-500 to-teal-400 shadow-emerald-500/25';
  let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (isOver) {
    barGradient = 'from-rose-500 to-pink-500 shadow-rose-500/25';
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (remaining < targetCalories * 0.1) {
    barGradient = 'from-amber-500 to-yellow-400 shadow-amber-500/25';
    badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl shadow-black/30 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Daily Calorie Goal</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-extrabold text-xl text-slate-100 font-mono tracking-tight">{calories}</span>
            <span className="text-sm font-semibold text-slate-400 font-mono">/ {targetCalories} kcal</span>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono tracking-wide ${badgeStyle}`}>
          {isOver ? `${Math.abs(remaining)} over goal` : `${remaining} kcal left`}
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full bg-slate-950/80 rounded-full h-3.5 p-0.5 border border-slate-800/80 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-md transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Macro Breakdown */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {Object.entries(totals)
          .filter(([key]) => key !== 'calories')
          .map(([key, value]) => (
            <MacroProgressBadge key={key} label={key} value={value} />
          ))}
      </div>
    </div>
  );
}
