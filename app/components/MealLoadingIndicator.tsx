import React from 'react';
import { FaMagic, FaSpinner } from 'react-icons/fa';

export default function MealLoadingIndicator() {
  return (
    <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-md space-y-6 text-center animate-pulse">
      <div className="relative flex justify-center items-center py-4">
        <div className="absolute w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-ping" />
        <div className="relative p-5 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-400 shadow-inner">
          <FaMagic className="w-8 h-8 animate-bounce text-blue-300" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-slate-100 flex items-center justify-center gap-2">
          <FaSpinner className="w-4 h-4 animate-spin text-blue-400" />
          <span>Analyzing Meal with AI...</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Extracting food items, calculating calories, and estimating macronutrient breakdown.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span>Please wait a moment</span>
      </div>
    </div>
  );
}
