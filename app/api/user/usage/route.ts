import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data()!;
    const subscription = userData.subscription;
    const apiUsage = userData.apiUsage || { currentMonth: 0, lastReset: new Date() };

    // Determine monthly limit based on subscription
    let monthlyLimit = 10; // Free tier
    if (subscription.tier === 'basic') monthlyLimit = 500;
    if (subscription.tier === 'pro') monthlyLimit = -1; // Unlimited

    return NextResponse.json({
      currentUsage: apiUsage.currentMonth,
      monthlyLimit,
      subscription: subscription.tier,
      lastReset: apiUsage.lastReset,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.message.includes('token') || error.message.includes('authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
