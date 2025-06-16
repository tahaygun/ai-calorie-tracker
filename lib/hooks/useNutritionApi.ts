'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import type { FoodItemNutrition } from '../openai';

interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export function useNutritionApi() {
  const { user } = useAuth();
  const { selectedModel, debugMode, textAnalysisPrompt, imageAnalysisPrompt } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);

  const getAuthToken = async () => {
    if (!user) throw new Error('User not authenticated');
    return await user.getIdToken();
  };

  const analyzeMealDescription = async (description: string) => {
    if (!user) {
      throw new Error('Please sign in to analyze meals');
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-OpenAI-Model': selectedModel,
          'X-Debug-Mode': debugMode ? 'true' : 'false',
          'X-Text-Analysis-Prompt': textAnalysisPrompt,
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        if (data.debugInfo) {
          setTokenUsage({
            totalTokens: data.debugInfo.totalTokens,
            promptTokens: data.debugInfo.promptTokens,
            completionTokens: data.debugInfo.completionTokens,
          });
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
    if (!user) {
      throw new Error('Please sign in to analyze images');
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('image', file);
      if (description) formData.append('description', description);

      const response = await fetch('/api/meals/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-OpenAI-Model': selectedModel,
          'X-Debug-Mode': debugMode ? 'true' : 'false',
          'X-Image-Analysis-Prompt': imageAnalysisPrompt,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        if (data.debugInfo) {
          setTokenUsage({
            totalTokens: data.debugInfo.totalTokens,
            promptTokens: data.debugInfo.promptTokens,
            completionTokens: data.debugInfo.completionTokens,
          });
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