import { OpenAIService } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-OpenAI-Key');
    const model = request.headers.get('X-OpenAI-Model') || 'gpt-4o-mini';
    const debug = request.headers.get('X-Debug-Mode') === 'true';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const description = formData.get('description') as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const openAIService = new OpenAIService({
      apiKey,
      model,
      debug,
    });

    const result = await openAIService.analyzeImageData(
      base64Image,
      description || undefined
    );
    console.log(result, 'result');
    return NextResponse.json({
      message: 'Image analyzed successfully',
      nutritionData: result.data,
      debugInfo: result.debugInfo,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
