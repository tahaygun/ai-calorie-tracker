import { verifyAuthToken } from '@/lib/auth/middleware';
import { adminDb } from '@/lib/firebase/admin';
import stripe from '@/lib/stripe/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    const uid = decodedToken.uid;
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get or create Stripe customer
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data()!;
    
    let customerId = userData.subscription?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          firebaseUID: uid,
        },
      });
      customerId = customer.id;
      
      // Update user with customer ID
      await adminDb.collection('users').doc(uid).update({
        'subscription.stripeCustomerId': customerId,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/subscription?success=true`,
      cancel_url: `${request.headers.get('origin')}/subscription?canceled=true`,
      metadata: {
        firebaseUID: uid,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
