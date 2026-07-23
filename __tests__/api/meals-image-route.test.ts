import { POST } from '@/app/api/meals/image/route';
import { describe, expect, it, vi } from 'vitest';

const mockAnalyzeImageData = vi.fn();

vi.mock('@/lib/openai', () => {
  return {
    OpenAIService: class MockOpenAIService {
      analyzeImageData = mockAnalyzeImageData;
    },
  };
});

describe('/api/meals/image POST route handler', () => {
  it('should return 401 if X-OpenAI-Key header is missing', async () => {
    const mockFile = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
    const req = {
      headers: new Headers(),
      formData: async () => {
        const formData = new FormData();
        formData.append('image', mockFile);
        return formData;
      },
    } as unknown as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('OpenAI API key is required');
  });

  it('should return 400 if image file is missing', async () => {
    const req = {
      headers: new Headers({
        'X-OpenAI-Key': 'sk-test',
      }),
      formData: async () => {
        const formData = new FormData();
        formData.append('description', 'some food description');
        return formData;
      },
    } as unknown as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Image file is required');
  });

  it('should process image file and return 200 with nutrition data', async () => {
    mockAnalyzeImageData.mockResolvedValueOnce({
      data: [{ item: 'Banana', nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 } }],
    });

    const mockFile = new File(['dummy-image-bytes'], 'banana.jpg', { type: 'image/jpeg' });
    const req = {
      headers: new Headers({
        'X-OpenAI-Key': 'sk-test',
        'X-OpenAI-Model': 'gpt-5.6-terra',
      }),
      formData: async () => {
        const formData = new FormData();
        formData.append('image', mockFile);
        formData.append('description', 'Yellow ripe banana');
        return formData;
      },
    } as unknown as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('Image analyzed successfully');
    expect(json.nutritionData).toHaveLength(1);
    expect(json.nutritionData[0].item).toBe('Banana');
  });
});
