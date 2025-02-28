'use client';
import type { FoodItemNutrition } from '@/lib/openai';
import { useEffect, useState } from 'react';
import DayMealsModal from '../components/DayMealsModal';

interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface StoredMeal {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  timestamp: string;
}

export default function History() {
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<StoredMeal[]>([]);

  useEffect(() => {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    const mealKeys = keys.filter((key) => key.startsWith('meals_'));

    const totals = mealKeys.map((key) => {
      const date = key.replace('meals_', '');
      const meals = JSON.parse(localStorage.getItem(key) || '[]') as StoredMeal[];

      const dailyTotal = meals.reduce(
        (total: DailyTotal, meal: StoredMeal) => {
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
    const meals = JSON.parse(localStorage.getItem(`meals_${date}`) || '[]') as StoredMeal[];
    setSelectedDate(date);
    setSelectedMeals(meals);
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <main className='max-w-2xl mx-auto p-4'>
        <div className='space-y-4'>
          <h1 className='text-xl font-semibold mb-4'>Nutrition History</h1>
          {dailyTotals.length === 0 ? (
            <p className='text-gray-400'>No history available</p>
          ) : (
            <div className='grid gap-3'>
              {dailyTotals.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day.date)}
                  className='bg-gray-800 rounded-lg p-4 flex justify-between items-center w-full hover:bg-gray-750 transition-colors text-left'
                >
                  <div>
                    <p className='font-medium'>{new Date(day.date).toLocaleDateString()}</p>
                    <p className='text-sm text-gray-400'>
                      P: {Math.round(day.protein)}g • C: {Math.round(day.carbs)}g • F: {Math.round(day.fat)}g
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold'>{Math.round(day.calories)}</p>
                    <p className='text-sm text-gray-400'>calories</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <DayMealsModal isOpen={selectedDate !== null} onClose={() => setSelectedDate(null)} date={selectedDate || ''} meals={selectedMeals} />
    </div>
  );
}
