import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useState } from 'react';
import type { MealEntry, NutritionTotals } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useMeals() {
  const [currentDate] = useState(() => (typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : ''));
  const [mealDescription, setMealDescription] = useState('');
  const [dailyMeals, setDailyMeals] = useLocalStorage<MealEntry[]>(
    currentDate ? `meals_${currentDate}` : 'meals_today',
    []
  );
  const [editableItems, setEditableItems] = useState<FoodItemNutrition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for date changes
  useEffect(() => {
    const todayAtMount = new Date().toISOString().split('T')[0];
    const checkDate = () => {
      const today = new Date().toISOString().split('T')[0];
      if (today !== todayAtMount) {
        // If date has changed, reload the page to reset the state
        window.location.reload();
      }
    };

    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateDailyTotals = (): NutritionTotals => {
    return dailyMeals.reduce(
      (totals, meal) => {
        const mealTotals = meal.items.reduce(
          (itemTotals: NutritionTotals, item: FoodItemNutrition) => ({
            calories: itemTotals.calories + item.nutrition.calories,
            protein: itemTotals.protein + item.nutrition.protein,
            carbs: itemTotals.carbs + item.nutrition.carbs,
            fat: itemTotals.fat + item.nutrition.fat,
            fiber: itemTotals.fiber + item.nutrition.fiber,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );
        return {
          calories: totals.calories + mealTotals.calories,
          protein: totals.protein + mealTotals.protein,
          carbs: totals.carbs + mealTotals.carbs,
          fat: totals.fat + mealTotals.fat,
          fiber: totals.fiber + mealTotals.fiber,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const addMeal = (meal: MealEntry) => {
    setDailyMeals(prev => [...prev, meal]);
  };

  const deleteMeal = (id: string) => {
    setDailyMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const updateMeal = (id: string, updatedMeal: Partial<MealEntry>) => {
    setDailyMeals(prev => prev.map(meal => (meal.id === id ? { ...meal, ...updatedMeal } : meal)));
  };

  const updateItemNutrition = (itemIndex: number, field: keyof NutritionData, value: number) => {
    setEditableItems(items =>
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              nutrition: {
                ...item.nutrition,
                [field]: value,
              },
            }
          : item
      )
    );
  };

  const updateItemName = (itemIndex: number, newName: string) => {
    setEditableItems(items =>
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              item: newName,
            }
          : item
      )
    );
  };

  const removeItem = (itemIndex: number) => {
    setEditableItems(items => items.filter((_, index) => index !== itemIndex));
  };

  return {
    mealDescription,
    setMealDescription,
    dailyMeals,
    editableItems,
    setEditableItems,
    isEditing,
    setIsEditing,
    isLoading,
    setIsLoading,
    calculateDailyTotals,
    addMeal,
    deleteMeal,
    updateMeal,
    updateItemNutrition,
    updateItemName,
    removeItem,
  };
}
