import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import { OpenAIService } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting and subscription checks
const checkUserQuota = async (uid: string) => {
  const userDoc = await adminDb.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data()!;
  const subscription = userData.subscription;
  const apiUsage = userData.apiUsage || { currentMonth: 0, lastReset: new Date() };

  // Check if we need to reset monthly usage
  const now = new Date();
  const lastReset = apiUsage.lastReset.toDate();
  
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    // Reset monthly usage
    await adminDb.collection('users').doc(uid).update({
      'apiUsage.currentMonth': 0,
      'apiUsage.lastReset': now,
    });
    apiUsage.currentMonth = 0;
  }

  // Check quota based on subscription tier
  let monthlyLimit = 10; // Free tier
  if (subscription.tier === 'basic') monthlyLimit = 500;
  if (subscription.tier === 'pro') monthlyLimit = -1; // Unlimited

  if (monthlyLimit !== -1 && apiUsage.currentMonth >= monthlyLimit) {
    throw new Error('Monthly API quota exceeded. Please upgrade your subscription.');
  }

  return { currentUsage: apiUsage.currentMonth, monthlyLimit };
};

const incrementUsage = async (uid: string) => {
  const userRef = adminDb.collection('users').doc(uid);
  const userDoc = await userRef.get();
  const currentUsage = userDoc.data()?.apiUsage?.currentMonth || 0;
  
  await userRef.update({
    'apiUsage.currentMonth': currentUsage + 1,
  });
};

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    // Check user quota
    await checkUserQuota(uid);

    const { description } = await request.json();
    if (!description) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    // Get user settings
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data()!;
    const settings = userData.settings || {};

    const openAIService = new OpenAIService({
      apiKey: process.env.OPENAI_API_KEY!,
      model: settings.selectedModel || 'gpt-4o-mini',
      debug: settings.debugMode || false,
      textAnalysisPrompt: settings.textAnalysisPrompt,
    });

    const result = await openAIService.analyzeFoodData(description);

    // Increment usage after successful API call
    await incrementUsage(uid);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.message.includes('quota exceeded')) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    
    if (error.message.includes('token') || error.message.includes('authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
