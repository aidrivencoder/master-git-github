import { loadStripe } from '@stripe/stripe-js';
import { getAuth } from 'firebase/auth';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createCheckoutSession(priceId: string): Promise<void> {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // Get the user's auth token
    const token = await getAuthToken();

    // Create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    });

    const { url, error } = await response.json();

    if (error) throw new Error(error);
    if (!url) throw new Error('No checkout URL returned');

    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

async function getAuthToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in');
  
  const token = await user.getIdToken();
  return token;
}
