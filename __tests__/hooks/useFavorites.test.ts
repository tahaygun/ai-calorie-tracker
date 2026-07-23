import { useFavorites } from '@/lib/hooks/useFavorites';
import type { MealEntry } from '@/lib/types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useFavorites hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should toggle favorite meals correctly', () => {
    const { result } = renderHook(() => useFavorites());

    const meal: MealEntry = {
      id: 'fav-meal-1',
      description: 'Protein Shake',
      items: [],
      timestamp: '2026-07-24T10:00:00.000Z',
    };

    expect(result.current.isMealFavorite('fav-meal-1')).toBe(false);

    // Toggle on
    act(() => {
      result.current.toggleFavorite(meal);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isMealFavorite('fav-meal-1')).toBe(true);

    // Toggle off
    act(() => {
      result.current.toggleFavorite(meal);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isMealFavorite('fav-meal-1')).toBe(false);
  });

  it('should delete favorite meal by id', () => {
    const { result } = renderHook(() => useFavorites());

    const meal: MealEntry = {
      id: 'fav-meal-2',
      description: 'Salad Bowl',
      items: [],
      timestamp: '2026-07-24T12:00:00.000Z',
    };

    act(() => {
      result.current.toggleFavorite(meal);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.deleteFavorite('fav-meal-2');
    });

    expect(result.current.favorites).toHaveLength(0);
  });
});
