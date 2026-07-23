import { getDailyTotalsFromStorage } from '@/lib/utils/historyStorage';
import { beforeEach, describe, expect, it } from 'vitest';

describe('historyStorage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array when no meals are stored', () => {
    const totals = getDailyTotalsFromStorage();
    expect(totals).toEqual([]);
  });

  it('should calculate daily totals from stored meals and return consistent reference when unchanged', () => {
    localStorage.setItem(
      'meals_2026-07-24',
      JSON.stringify([
        {
          id: 'meal-1',
          description: 'Oatmeal',
          items: [
            { item: 'Oats', nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 } },
          ],
          timestamp: '2026-07-24T08:00:00.000Z',
        },
      ])
    );

    const totals1 = getDailyTotalsFromStorage();
    expect(totals1).toHaveLength(1);
    expect(totals1[0].calories).toBe(150);

    const totals2 = getDailyTotalsFromStorage();
    expect(totals2).toBe(totals1); // Reference equality for cached snapshot
  });
});
