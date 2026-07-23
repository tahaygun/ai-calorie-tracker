import { OpenAIService } from '@/lib/openai';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  };
});

describe('OpenAIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze food text description correctly', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              items: [
                {
                  item: 'Chicken Breast',
                  nutrition: { calories: 200, protein: 30, carbs: 0, fat: 5, fiber: 0 },
                },
              ],
            }),
          },
        },
      ],
      usage: { total_tokens: 100, prompt_tokens: 70, completion_tokens: 30 },
    });

    const service = new OpenAIService({
      apiKey: 'test-key',
      model: 'gpt-5.6-terra',
      debug: true,
    });

    const result = await service.analyzeFoodData('200g chicken breast');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].item).toBe('Chicken Breast');
    expect(result.debugInfo).toBeDefined();
    expect(result.debugInfo?.totalTokens).toBe(100);
  });

  it('should analyze base64 image data correctly', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              meal: [
                {
                  item: 'Apple',
                  nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
                },
              ],
            }),
          },
        },
      ],
      usage: { total_tokens: 150, prompt_tokens: 110, completion_tokens: 40 },
    });

    const service = new OpenAIService({
      apiKey: 'test-key',
      model: 'gpt-5.6-terra',
      debug: false,
    });

    const result = await service.analyzeImageData('base64StringSample', 'an apple');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].item).toBe('Apple');
    expect(result.debugInfo).toBeUndefined();
  });

  it('should throw error when OpenAI API returns empty content', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    const service = new OpenAIService({
      apiKey: 'test-key',
      model: 'gpt-5.6-terra',
    });

    await expect(service.analyzeFoodData('banana')).rejects.toThrow('No content in response');
  });
});
