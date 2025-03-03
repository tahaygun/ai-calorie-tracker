import { OpenAIService } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-OpenAI-Key');
    const model = request.headers.get('X-OpenAI-Model') || 'gpt-4o-mini';
    const debug = request.headers.get('X-Debug-Mode') === 'true';
    const textAnalysisPrompt = request.headers.get('X-Text-Analysis-Prompt');

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is required' }, { status: 401 });
    }

    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    const openAIService = new OpenAIService({
      apiKey,
      model,
      debug,
      textAnalysisPrompt: textAnalysisPrompt || undefined,
    });
    const result = await openAIService.analyzeFoodData(description);

    return NextResponse.json({
      message: 'Meal analyzed successfully',
      nutritionData: result.data,
      debugInfo: result.debugInfo,
    });
  } catch (error) {
    console.error('Error processing meal:', error);
    return NextResponse.json({ error: 'Failed to process meal' }, { status: 500 });
  }
}
