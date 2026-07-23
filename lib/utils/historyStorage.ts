import type { FoodItemNutrition } from '@/lib/openai';
import type { MealEntry } from '@/lib/types';

export interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

let lastCacheKey = '';
let cachedTotals: DailyTotal[] = [];

export function getDailyTotalsFromStorage(): DailyTotal[] {
  if (typeof window === 'undefined') return [];

  const keys = Object.keys(localStorage);
  const mealKeys = keys.filter(key => key.startsWith('meals_')).sort();

  // Create cache key based on meal keys and raw storage contents
  const currentCacheKey = mealKeys
    .map(key => `${key}:${localStorage.getItem(key) || ''}`)
    .join('|');

  if (currentCacheKey === lastCacheKey) {
    return cachedTotals;
  }

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
  lastCacheKey = currentCacheKey;
  cachedTotals = totals;

  return totals;
}
