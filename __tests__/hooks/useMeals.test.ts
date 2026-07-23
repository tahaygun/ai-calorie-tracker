import { useMeals } from '@/lib/hooks/useMeals';
import type { MealEntry } from '@/lib/types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useMeals hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty states', () => {
    const { result } = renderHook(() => useMeals());

    expect(result.current.mealDescription).toBe('');
    expect(result.current.dailyMeals).toEqual([]);
    expect(result.current.editableItems).toEqual([]);
    expect(result.current.isEditing).toBe(false);
  });

  it('should add, update, and delete meals', () => {
    const { result } = renderHook(() => useMeals());

    const meal1: MealEntry = {
      id: 'm1',
      description: 'Oatmeal & Milk',
      items: [
        { item: 'Oats', nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 } },
        { item: 'Milk', nutrition: { calories: 100, protein: 8, carbs: 12, fat: 2, fiber: 0 } },
      ],
      timestamp: '2026-07-24T08:00:00.000Z',
    };

    // Add meal
    act(() => {
      result.current.addMeal(meal1);
    });

    expect(result.current.dailyMeals).toHaveLength(1);
    expect(result.current.dailyMeals[0].description).toBe('Oatmeal & Milk');

    // Calculate totals
    const totals = result.current.calculateDailyTotals();
    expect(totals.calories).toBe(250);
    expect(totals.protein).toBe(13);

    // Update meal
    act(() => {
      result.current.updateMeal('m1', { description: 'Oatmeal & Almond Milk' });
    });

    expect(result.current.dailyMeals[0].description).toBe('Oatmeal & Almond Milk');

    // Delete meal
    act(() => {
      result.current.deleteMeal('m1');
    });

    expect(result.current.dailyMeals).toHaveLength(0);
  });

  it('should manage editable food items during nutrition editing', () => {
    const { result } = renderHook(() => useMeals());

    act(() => {
      result.current.setEditableItems([
        { item: 'Egg', nutrition: { calories: 70, protein: 6, carbs: 0.5, fat: 5, fiber: 0 } },
        { item: 'Toast', nutrition: { calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 2 } },
      ]);
    });

    expect(result.current.editableItems).toHaveLength(2);

    // Update item nutrition
    act(() => {
      result.current.updateItemNutrition(0, 'calories', 80);
    });
    expect(result.current.editableItems[0].nutrition.calories).toBe(80);

    // Update item name
    act(() => {
      result.current.updateItemName(1, 'Whole Wheat Toast');
    });
    expect(result.current.editableItems[1].item).toBe('Whole Wheat Toast');

    // Remove item
    act(() => {
      result.current.removeItem(0);
    });
    expect(result.current.editableItems).toHaveLength(1);
    expect(result.current.editableItems[0].item).toBe('Whole Wheat Toast');
  });
});
