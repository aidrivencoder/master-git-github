import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { adminDb } from '@/lib/firebase/config/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (!userId) {
          throw new Error('No userId in session metadata');
        }

        // Update subscription status in Firestore
        await adminDb.collection('users').doc(userId).update({
          subscriptionStatus: 'active',
          subscriptionId: session.subscription as string,
          customerId: session.customer as string,
          updatedAt: Timestamp.now(),
        });

        // Update checkout session status
        await adminDb.collection('checkoutSessions').doc(session.id).update({
          status: 'completed',
          updatedAt: Timestamp.now(),
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomerId(subscription.customer as string);

        await adminDb.collection('users').doc(userId).update({
          subscriptionStatus: subscription.status,
          updatedAt: Timestamp.now(),
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomerId(subscription.customer as string);

        await adminDb.collection('users').doc(userId).update({
          subscriptionStatus: 'canceled',
          updatedAt: Timestamp.now(),
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = await getUserIdFromCustomerId(invoice.customer as string);

        await adminDb.collection('users').doc(userId).update({
          subscriptionStatus: 'past_due',
          updatedAt: Timestamp.now(),
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function getUserIdFromCustomerId(customerId: string): Promise<string> {
  const userSnapshot = await adminDb
    .collection('users')
    .where('customerId', '==', customerId)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    throw new Error(`No user found for customer ${customerId}`);
  }

  return userSnapshot.docs[0].id;
}
