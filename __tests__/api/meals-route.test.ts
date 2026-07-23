import { POST } from '@/app/api/meals/route';
import { describe, expect, it, vi } from 'vitest';

const mockAnalyzeFoodData = vi.fn();

vi.mock('@/lib/openai', () => {
  return {
    OpenAIService: class MockOpenAIService {
      analyzeFoodData = mockAnalyzeFoodData;
    },
  };
});

describe('/api/meals POST route handler', () => {
  it('should return 401 if X-OpenAI-Key header is missing', async () => {
    const req = new Request('http://localhost:3000/api/meals', {
      method: 'POST',
      body: JSON.stringify({ description: 'Apple' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('OpenAI API key is required');
  });

  it('should return 400 if description is missing in request body', async () => {
    const req = new Request('http://localhost:3000/api/meals', {
      method: 'POST',
      headers: {
        'X-OpenAI-Key': 'sk-test',
      },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Meal description is required');
  });

  it('should process meal and return 200 with nutrition data', async () => {
    mockAnalyzeFoodData.mockResolvedValueOnce({
      data: [{ item: 'Apple', nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 } }],
    });

    const req = new Request('http://localhost:3000/api/meals', {
      method: 'POST',
      headers: {
        'X-OpenAI-Key': 'sk-test',
        'X-OpenAI-Model': 'gpt-5.6-terra',
      },
      body: JSON.stringify({ description: '1 fresh apple' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('Meal analyzed successfully');
    expect(json.nutritionData).toHaveLength(1);
    expect(json.nutritionData[0].item).toBe('Apple');
  });
});
