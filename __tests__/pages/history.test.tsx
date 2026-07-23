import History from '@/app/history/page';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('History Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render empty state message when no logged meals exist in history', () => {
    render(<History />);

    expect(screen.getByText('Nutrition History')).toBeInTheDocument();
    expect(screen.getByText('No logged history available yet')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument();
  });

  it('should render historical daily logs from localStorage', () => {
    localStorage.setItem(
      'meals_2026-07-20',
      JSON.stringify([
        {
          id: 'meal-1',
          description: 'Chicken Rice',
          items: [
            { item: 'Chicken', nutrition: { calories: 300, protein: 30, carbs: 0, fat: 5, fiber: 0 } },
            { item: 'Rice', nutrition: { calories: 200, protein: 4, carbs: 45, fat: 1, fiber: 1 } },
          ],
          timestamp: '2026-07-20T12:00:00.000Z',
        },
      ])
    );

    render(<History />);

    expect(screen.getByText('Nutrition History')).toBeInTheDocument();
    expect(screen.getByText('1 day')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument(); // total calories
    expect(screen.getByText('P: 34g')).toBeInTheDocument();
    expect(screen.getByText('C: 45g')).toBeInTheDocument();
    expect(screen.getByText('F: 6g')).toBeInTheDocument();
  });
});
