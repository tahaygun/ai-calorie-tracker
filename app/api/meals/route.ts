import { OpenAIService } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-OpenAI-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is required' }, { status: 401 });
    }

    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    const openAIService = new OpenAIService(apiKey);
    const nutritionData = await openAIService.analyzeFoodData({
      foodDescription: description,
    });

    return NextResponse.json({
      message: 'Meal analyzed successfully',
      nutritionData,
    });
  } catch (error) {
    console.error('Error processing meal:', error);
    return NextResponse.json({ error: 'Failed to process meal' }, { status: 500 });
  }
}
