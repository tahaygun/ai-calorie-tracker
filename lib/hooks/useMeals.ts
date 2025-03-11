import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useRef, useState } from 'react';
import type { MealEntry, NutritionTotals } from '../types';

export function useMeals() {
  const initialDateRef = useRef(new Date().toISOString().split('T')[0]);
  const [currentDate, setCurrentDate] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [dailyMeals, setDailyMeals] = useState<MealEntry[]>([]);
  const [editableItems, setEditableItems] = useState<FoodItemNutrition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial date on mount
  useEffect(() => {
    setCurrentDate(initialDateRef.current);
  }, []);

  // Load meals from localStorage when currentDate is set
  useEffect(() => {
    if (!currentDate) return;

    const storedMeals = localStorage.getItem(`meals_${currentDate}`);
    if (storedMeals) {
      setDailyMeals(JSON.parse(storedMeals));
    } else {
      setDailyMeals([]);
    }
  }, [currentDate]);

  // Save meals whenever they change
  useEffect(() => {
    if (!currentDate) return;
    localStorage.setItem(`meals_${currentDate}`, JSON.stringify(dailyMeals));
  }, [dailyMeals, currentDate]);

  // Check for date changes
  useEffect(() => {
    if (!currentDate) return;

    const checkDate = () => {
      const today = new Date().toISOString().split('T')[0];
      if (today !== currentDate) {
        // If date has changed, reload the page to reset the state
        window.location.reload();
      }
    };

    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [currentDate]);

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
