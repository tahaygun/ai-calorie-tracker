'use client';

import { useCallback } from 'react';
import type { WeightEntry } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useWeights() {
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('weight_entries', []);
  const isLoading = false;

  // Add a new weight entry
  const addWeight = useCallback((weight: number, note?: string, date?: string) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date: date || new Date().toISOString(),
      note,
    };

    setWeights(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  // Update an existing weight entry
  const updateWeight = useCallback((id: string, updates: Partial<Omit<WeightEntry, 'id'>>) => {
    setWeights(prev => prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry)));
  }, []);

  // Delete a weight entry
  const deleteWeight = useCallback((id: string) => {
    setWeights(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Get weights sorted by date (newest first)
  const getSortedWeights = useCallback(() => {
    return [...weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [weights]);

  return {
    weights,
    getSortedWeights,
    addWeight,
    updateWeight,
    deleteWeight,
    isLoading,
  };
}
