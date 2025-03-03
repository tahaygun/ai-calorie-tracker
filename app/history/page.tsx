'use client';
import type { FoodItemNutrition } from '@/lib/openai';
import type { MealEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import DayMealsModal from '../components/DayMealsModal';

interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function History() {
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    // Get all localStorage keys
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

    // Sort by date descending
    totals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDailyTotals(totals);
  }, []);

  const handleDayClick = (date: string) => {
    const meals = JSON.parse(localStorage.getItem(`meals_${date}`) || '[]') as MealEntry[];
    setSelectedDate(date);
    setSelectedMeals(meals);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <main className="mx-auto p-4 max-w-2xl">
        <div className="space-y-4">
          <h1 className="mb-4 font-semibold text-xl">Nutrition History</h1>
          {dailyTotals.length === 0 ? (
            <p className="text-gray-400">No history available</p>
          ) : (
            <div className="gap-3 grid">
              {dailyTotals.map(day => (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day.date)}
                  className="flex justify-between items-center bg-gray-800 hover:bg-gray-750 p-4 rounded-lg w-full text-left transition-colors"
                >
                  <div>
                    <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-sm">
                      P: {Math.round(day.protein)}g • C: {Math.round(day.carbs)}g • F:{' '}
                      {Math.round(day.fat)}g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{Math.round(day.calories)}</p>
                    <p className="text-gray-400 text-sm">calories</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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
