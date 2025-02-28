import type { FoodItemNutrition } from '@/lib/openai';

export interface MealEntry {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  timestamp: string;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}
