'use client';

import type { FoodItemNutrition } from '@/lib/openai';
import type { MealEntry } from '@/lib/types';
import React, { useState, useSyncExternalStore } from 'react';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import DayMealsModal from '../components/DayMealsModal';

interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const emptySubscribe = () => () => {};

function getDailyTotalsFromStorage(): DailyTotal[] {
  if (typeof window === 'undefined') return [];

  const keys = Object.keys(localStorage);
  const mealKeys = keys.filter(key => key.startsWith('meals_'));

  const totals = mealKeys.map(key => {
    const date = key.replace('meals_', '');
    const meals = JSON.parse(localStorage.getItem(key) || '[]') as MealEntry[];

    const dailyTotal = meals.reduce(
      (total: DailyTotal, meal: MealEntry) => {
        const mealTotal = meal.items.reduce(
          (itemTotal: Omit<DailyTotal, 'date'>, item: FoodItemNutrition) => ({
            calories: itemTotal.calories + item.nutrition.calories,
            protein: itemTotal.protein + item.nutrition.protein,
            carbs: itemTotal.carbs + item.nutrition.carbs,
            fat: itemTotal.fat + item.nutrition.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        return {
          date,
          calories: total.calories + mealTotal.calories,
          protein: total.protein + mealTotal.protein,
          carbs: total.carbs + mealTotal.carbs,
          fat: total.fat + mealTotal.fat,
        };
      },
      { date, calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return dailyTotal;
  });

  totals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return totals;
}

export default function History() {
  const dailyTotals = useSyncExternalStore(emptySubscribe, getDailyTotalsFromStorage, () => []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<MealEntry[]>([]);

  const handleDayClick = (date: string) => {
    const meals = JSON.parse(localStorage.getItem(`meals_${date}`) || '[]') as MealEntry[];
    setSelectedDate(date);
    setSelectedMeals(meals);
  };

  return (
    <div className="min-h-screen text-slate-100 pb-12">
      <main className="mx-auto p-4 sm:p-6 max-w-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="font-bold text-2xl text-slate-100 flex items-center gap-2.5">
              <FaCalendarAlt className="w-5 h-5 text-blue-400" />
              <span>Nutrition History</span>
            </h1>
            <p className="text-xs text-slate-400">View daily calorie and macronutrient summaries</p>
          </div>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-full font-mono">
            {dailyTotals.length} {dailyTotals.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        {dailyTotals.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2 backdrop-blur-md">
            <p className="text-sm font-semibold">No logged history available yet</p>
            <p className="text-xs text-slate-500">Log meals on the Today tab to build your nutrition log</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {dailyTotals.map(day => (
              <button
                key={day.date}
                type="button"
                onClick={() => handleDayClick(day.date)}
                className="flex justify-between items-center bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl w-full text-left transition-all shadow-md shadow-black/20 group active:scale-[0.99]"
              >
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-100 text-base group-hover:text-blue-400 transition-colors">
                    {new Date(day.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      P: {Math.round(day.protein)}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                      C: {Math.round(day.carbs)}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      F: {Math.round(day.fat)}g
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="font-extrabold text-xl text-amber-400 font-mono block">
                      {Math.round(day.calories)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono uppercase">calories</span>
                  </div>
                  <FaChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <DayMealsModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || ''}
        meals={selectedMeals}
      />
    </div>
  );
}
