'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { WeightEntry } from '../types';

export function useWeights() {
  const { user } = useAuth();
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load weights from localStorage on component mount
  useEffect(() => {
    if (!user) {
      setWeights([]);
      setIsLoading(false);
      return;
    }

    try {
      const userId = user.uid;
      const storedWeights = localStorage.getItem(`weight_entries_${userId}`);
      setWeights(storedWeights ? JSON.parse(storedWeights) : []);
    } catch (error) {
      console.error('Error loading weight entries:', error);
      setWeights([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save weights to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && user) {
      const userId = user.uid;
      localStorage.setItem(`weight_entries_${userId}`, JSON.stringify(weights));
    }
  }, [weights, isLoading, user]);

  // Add a new weight entry
  const addWeight = useCallback(
    (weight: number, note?: string, date?: string) => {
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight,
        date: date || new Date().toISOString(),
        note,
      };

      setWeights(prev => [...prev, newEntry]);
      return newEntry;
    },
    []
  );

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