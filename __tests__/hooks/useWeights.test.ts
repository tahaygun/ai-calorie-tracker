import { useWeights } from '@/lib/hooks/useWeights';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useWeights hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty weights list', () => {
    const { result } = renderHook(() => useWeights());
    expect(result.current.weights).toHaveLength(0);
  });

  it('should add weight entry and get sorted weights', () => {
    const { result } = renderHook(() => useWeights());

    act(() => {
      result.current.addWeight(75.5, 'Morning weight', '2026-07-01T08:00:00.000Z');
    });

    expect(result.current.weights).toHaveLength(1);
    expect(result.current.weights[0].weight).toBe(75.5);
  });

  it('should update and delete weight entries', () => {
    const { result } = renderHook(() => useWeights());

    let entryId = '';
    act(() => {
      const added = result.current.addWeight(75.5, 'Morning weight', '2026-07-01T08:00:00.000Z');
      entryId = added.id;
    });

    // Update weight entry
    act(() => {
      result.current.updateWeight(entryId, { weight: 75.0, note: 'Adjusted morning weight' });
    });

    const updated = result.current.weights.find(w => w.id === entryId);
    expect(updated?.weight).toBe(75.0);
    expect(updated?.note).toBe('Adjusted morning weight');

    // Delete entry
    act(() => {
      result.current.deleteWeight(entryId);
    });

    expect(result.current.weights).toHaveLength(0);
  });
});
