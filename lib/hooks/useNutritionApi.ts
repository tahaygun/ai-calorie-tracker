'use client';

import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import type { FoodItemNutrition } from '../openai';

interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export function useNutritionApi() {
  const { apiKey, selectedModel, customModelName, debugMode } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);

  const analyzeMealDescription = async (description: string) => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-Key': apiKey,
          'X-OpenAI-Model': selectedModel === 'custom' ? customModelName : selectedModel,
          'X-Debug-Mode': debugMode ? 'true' : 'false',
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        if (data.debugInfo) {
          setTokenUsage(data.debugInfo);
        }
        return data.nutritionData as FoodItemNutrition[];
      } else {
        throw new Error(data.error || 'Failed to analyze meal');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMealImage = async (file: File, description?: string) => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', description || 'Food image analysis');

      const response = await fetch('/api/meals/image', {
        method: 'POST',
        headers: {
          'X-OpenAI-Key': apiKey,
          'X-OpenAI-Model': selectedModel === 'custom' ? customModelName : selectedModel,
          'X-Debug-Mode': debugMode ? 'true' : 'false',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        if (data.debugInfo) {
          setTokenUsage(data.debugInfo);
        }
        return data.nutritionData as FoodItemNutrition[];
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearTokenUsage = () => setTokenUsage(null);

  return {
    isLoading,
    tokenUsage,
    analyzeMealDescription,
    analyzeMealImage,
    clearTokenUsage,
  };
}
