import { adminAuth } from '@/lib/firebase/admin';
import { OpenAIService } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const model = request.headers.get('X-OpenAI-Model') || 'gpt-4o-mini';
    const debug = request.headers.get('X-Debug-Mode') === 'true';
    const imageAnalysisPrompt = request.headers.get('X-Image-Analysis-Prompt');

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const description = formData.get('description') as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const openAIService = new OpenAIService({
      apiKey,
      model,
      debug,
      imageAnalysisPrompt: imageAnalysisPrompt || undefined,
    });

    const result = await openAIService.analyzeImageData(base64Image, description || undefined);
    
    return NextResponse.json({
      message: 'Image analyzed successfully',
      nutritionData: result.data,
      debugInfo: result.debugInfo,
      userId: decodedToken.uid, // Include user ID for logging if needed
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}