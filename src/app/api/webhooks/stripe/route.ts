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

    console.log('Processing webhook event:', event.type, 'event id:', event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (!userId) {
          console.error('No userId in session metadata:', session.id);
          throw new Error('No userId in session metadata');
        }

        console.log('Processing checkout session completed:', {
          sessionId: session.id,
          userId,
          customerId: session.customer,
          subscriptionId: session.subscription
        });

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Get subscription details from Stripe
        console.log('Fetching subscription details from Stripe:', subscriptionId);
        let subscription: Stripe.Subscription;
        try {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.log('Retrieved subscription:', {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            priceId: subscription.items.data[0].price.id
          });
        } catch (error) {
          console.error('Error retrieving subscription from Stripe:', error);
          throw error;
        }

        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

        // Batch write to ensure atomicity
        const batch = adminDb.batch();

        try {
          console.log('Preparing Firestore updates for user:', userId);
          
          // Get user document to verify it exists
          const userRef = adminDb.collection('users').doc(userId);
          const userDoc = await userRef.get();
          if (!userDoc.exists) {
            console.error('User document not found:', userId);
            throw new Error('User document not found');
          }

          // Update user document
          console.log('Updating user subscription data');
          batch.update(userRef, {
            subscription: {
              tier: 'premium',
              status: 'active',
              stripeCustomerId: customerId,
              subscriptionId: subscriptionId,
              validUntil: Timestamp.fromDate(currentPeriodEnd)
            },
            updatedAt: Timestamp.now(),
          });

          // Create/Update subscription document
          console.log('Creating subscription document');
          const subscriptionRef = adminDb.collection('subscriptions').doc(userId);
          batch.set(subscriptionRef, {
            userId,
            customerId,
            subscriptionId,
            status: 'active',
            currentPeriod: {
              start: Timestamp.fromMillis(subscription.current_period_start * 1000),
              end: Timestamp.fromMillis(subscription.current_period_end * 1000)
            },
            plan: {
              id: subscription.items.data[0].price.id,
              name: 'Premium Plan',
              interval: subscription.items.data[0].price.recurring?.interval || 'month',
              status: 'active'
            },
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }, { merge: true });

          // Update checkout session status
          console.log('Updating checkout session status');
          const checkoutRef = adminDb.collection('checkoutSessions').doc(session.id);
          batch.update(checkoutRef, {
            status: 'completed',
            updatedAt: Timestamp.now(),
          });

          // Commit the batch
          console.log('Committing batch write...');
          await batch.commit();
          console.log('Batch write successful');

        } catch (error) {
          console.error('Error in Firestore operations:', error);
          throw error;
        }

        break;
      }

      // ... other event handlers remain the same ...
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

async function getUserIdFromCustomerId(customerId: string): Promise<string> {
  try {
    console.log('Looking up user for customer:', customerId);
    const userSnapshot = await adminDb
      .collection('users')
      .where('subscription.stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      throw new Error(`No user found for customer ${customerId}`);
    }

    const userId = userSnapshot.docs[0].id;
    console.log('Found user:', userId);
    return userId;
  } catch (error) {
    console.error('Error in getUserIdFromCustomerId:', error);
    throw error;
  }
}
