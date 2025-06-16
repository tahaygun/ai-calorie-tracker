'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { WeightEntry } from '../types';

export function useWeights() {
  const { user } = useAuth();
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load weights from API on component mount
  useEffect(() => {
    if (!user) return;

    const loadWeights = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/user/weights', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setWeights(data.weights || []);
        }
      } catch (error) {
        console.error('Error loading weight entries:', error);
        setWeights([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeights();
  }, [user]);

  // Save weights to API whenever they change
  useEffect(() => {
    if (!isLoading && user && weights.length >= 0) {
      const saveWeights = async () => {
        try {
          const token = await user.getIdToken();
          await fetch('/api/user/weights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ weights }),
          });
        } catch (error) {
          console.error('Error saving weight entries:', error);
        }
      };

      const timeoutId = setTimeout(saveWeights, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [weights, isLoading, user]);

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
