import { adminDb } from '@/lib/firebase/admin';
import stripe from '@/lib/stripe/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const firebaseUID = session.metadata?.firebaseUID;
        
        if (firebaseUID && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await adminDb.collection('users').doc(firebaseUID).update({
            'subscription.stripeSubscriptionId': subscription.id,
            'subscription.stripeCustomerId': subscription.customer,
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date((subscription as any).current_period_end * 1000),
            'subscription.tier': getPlanFromPriceId((subscription as any).items.data[0]?.price.id),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata?.firebaseUID) {
          const firebaseUID = customer.metadata.firebaseUID;
          
          await adminDb.collection('users').doc(firebaseUID).update({
            'subscription.status': subscription.status,
            'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
            'subscription.tier': getPlanFromPriceId(subscription.items.data[0]?.price.id),
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata?.firebaseUID) {
          const firebaseUID = customer.metadata.firebaseUID;
          
          await adminDb.collection('users').doc(firebaseUID).update({
            'subscription.status': 'canceled',
            'subscription.tier': 'free',
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const customer = await stripe.customers.retrieve((subscription as any).customer as string);
          
          if (customer && !customer.deleted && customer.metadata?.firebaseUID) {
            const firebaseUID = customer.metadata.firebaseUID;
            
            await adminDb.collection('users').doc(firebaseUID).update({
              'subscription.status': 'past_due',
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

function getPlanFromPriceId(priceId: string): 'free' | 'basic' | 'pro' {
  // You'll need to configure these with your actual Stripe price IDs
  const priceMapping: Record<string, 'basic' | 'pro'> = {
    'price_basic_monthly': 'basic',
    'price_pro_monthly': 'pro',
    // Add your actual Stripe price IDs here
  };
  
  return priceMapping[priceId] || 'free';
}
