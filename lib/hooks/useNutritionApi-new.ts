'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { FoodItemNutrition } from '../openai';

interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export function useNutritionApi() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);

  const analyzeMealDescription = async (description: string) => {
    if (!user) {
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        if (data.debugInfo) {
          setTokenUsage({
            totalTokens: data.debugInfo.totalTokens,
            promptTokens: data.debugInfo.promptTokens,
            completionTokens: data.debugInfo.completionTokens,
          });
        }
        return data.data as FoodItemNutrition[];
      } else {
        throw new Error(data.error || 'Failed to analyze meal description');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMealImage = async (file: File, description?: string) => {
    if (!user) {
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1]; // Remove data:image/...;base64, prefix
          resolve(base64Data);
        };
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          image: base64,
          description 
        }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        if (data.debugInfo) {
          setTokenUsage({
            totalTokens: data.debugInfo.totalTokens,
            promptTokens: data.debugInfo.promptTokens,
            completionTokens: data.debugInfo.completionTokens,
          });
        }
        return data.data as FoodItemNutrition[];
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
