import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import stripe from '@/lib/stripe/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;

    // Get user's Stripe customer ID
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data()!;
    const customerId = userData.subscription?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get('origin')}/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
