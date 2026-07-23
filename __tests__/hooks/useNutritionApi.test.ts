import { useNutritionApi } from '@/lib/hooks/useNutritionApi';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSettings = {
  apiKey: 'sk-test',
  selectedModel: 'gpt-5.6-terra',
  customModelName: '',
  debugMode: true,
  textAnalysisPrompt: 'Test text prompt',
  imageAnalysisPrompt: 'Test image prompt',
};

vi.mock('@/lib/contexts/SettingsContext', () => ({
  useSettings: () => mockSettings,
}));

describe('useNutritionApi hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should analyze meal description successfully', async () => {
    const mockResponse = {
      nutritionData: [
        { item: 'Rice', nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 } },
      ],
      debugInfo: { totalTokens: 100, promptTokens: 60, completionTokens: 40 },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useNutritionApi());

    let data;
    await act(async () => {
      data = await result.current.analyzeMealDescription('1 bowl of rice');
    });

    expect(data).toEqual(mockResponse.nutritionData);
    expect(result.current.tokenUsage).toEqual({
      totalTokens: 100,
      promptTokens: 60,
      completionTokens: 40,
    });

    act(() => {
      result.current.clearTokenUsage();
    });

    expect(result.current.tokenUsage).toBeNull();
  });

  it('should analyze meal image successfully', async () => {
    const mockResponse = {
      nutritionData: [
        { item: 'Salad', nutrition: { calories: 50, protein: 1, carbs: 10, fat: 0, fiber: 3 } },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useNutritionApi());
    const file = new File(['dummy'], 'salad.png', { type: 'image/png' });

    let data;
    await act(async () => {
      data = await result.current.analyzeMealImage(file, 'fresh salad');
    });

    expect(data).toEqual(mockResponse.nutritionData);
  });

  it('should throw error when API key is missing', async () => {
    mockSettings.apiKey = '';

    const { result } = renderHook(() => useNutritionApi());

    await expect(result.current.analyzeMealDescription('pizza')).rejects.toThrow(
      'API key is required'
    );
  });
});
