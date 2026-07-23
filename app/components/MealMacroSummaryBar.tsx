import React from 'react';

interface MealMacroSummaryBarProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export default function MealMacroSummaryBar({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  totalFiber,
}: MealMacroSummaryBarProps) {
  return (
    <div className="bg-slate-950/60 p-2.5 border-t border-slate-800/80">
      <div className="grid grid-cols-5 gap-1.5 text-xs text-center font-mono">
        <div className="bg-amber-500/10 border border-amber-500/20 py-1 px-1.5 rounded-lg">
          <span className="text-amber-400 font-semibold block text-[10px]">CAL</span>
          <span className="font-bold text-slate-100">{totalCalories}</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 py-1 px-1.5 rounded-lg">
          <span className="text-blue-400 font-semibold block text-[10px]">P</span>
          <span className="font-bold text-slate-100">{totalProtein}g</span>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 py-1 px-1.5 rounded-lg">
          <span className="text-yellow-400 font-semibold block text-[10px]">C</span>
          <span className="font-bold text-slate-100">{totalCarbs}g</span>
        </div>
        <div className="bg-pink-500/10 border border-pink-500/20 py-1 px-1.5 rounded-lg">
          <span className="text-pink-400 font-semibold block text-[10px]">F</span>
          <span className="font-bold text-slate-100">{totalFat}g</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 py-1 px-1.5 rounded-lg">
          <span className="text-emerald-400 font-semibold block text-[10px]">FB</span>
          <span className="font-bold text-slate-100">{totalFiber}g</span>
        </div>
      </div>
    </div>
  );
}
