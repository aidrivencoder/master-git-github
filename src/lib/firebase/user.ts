import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { auth, db } from './config'
import { Logger } from '../utils/logger'
import { User } from '../../types/user'

async function createStripeCustomer(email: string) {
  try {
    // Using the Firebase Extension endpoint
    const response = await fetch('/api/stripe/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to create Stripe customer');
    }

    const data = await response.json();
    return { customerId: data.customerId, error: null };
  } catch (error) {
    Logger.error('Failed to create Stripe customer', 'StripeCustomer', error);
    return { customerId: null, error };
  }
}

export async function checkPremiumAccess(userId: string): Promise<boolean> {
  try {
    // First check the user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      Logger.info(`User document not found for ID: ${userId}`, 'PremiumAccess');
      return false;
    }

    // Then check the subscriptions collection
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    if (!subscriptionDoc.exists()) {
      Logger.info(`Subscription document not found for user ID: ${userId}`, 'PremiumAccess');
      return false;
    }

    const subscriptionData = subscriptionDoc.data();
    console.log('subscriptionData', subscriptionData)
    const now = new Date();
    
    // Log subscription data for debugging
    const subscriptionInfo = JSON.stringify({
      status: subscriptionData.status,
      planName: subscriptionData.plan?.name,
      currentPeriodEnd: subscriptionData.currentPeriod?.end?.toDate(),
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd
    });
    Logger.info(`Checking subscription data: ${subscriptionInfo}`, 'PremiumAccess');

    // Check if:
    // 1. Subscription is active
    // 2. Plan includes 'premium'
    // 3. Current period hasn't ended
    // 4. Not scheduled for cancellation at period end OR if it is, we're still within the current period
    const hasAccess = (
      subscriptionData.status === 'active' &&
      subscriptionData.plan?.name.toLowerCase().includes('premium') &&
      now <= subscriptionData.currentPeriod?.end?.toDate() &&
      (!subscriptionData.cancelAtPeriodEnd || now <= subscriptionData.currentPeriod?.end?.toDate())
    );

    Logger.info(`Premium access result: ${hasAccess}`, 'PremiumAccess');
    return hasAccess;
  } catch (error) {
    Logger.error('Failed to check premium access', 'PremiumAccess', error);
    return false;
  }
}

export async function createUserDocument(uid: string, email: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create Stripe customer
      const { customerId, error: stripeError } = await createStripeCustomer(email);
      
      if (stripeError) {
        throw stripeError;
      }

      // Create new user document with Stripe customer ID
      const userData: User = {
        uid: uid,
        email,
        displayName: email.split('@')[0], // Default display name
        subscription: {
          tier: 'free',
          stripeCustomerId: customerId
        },
        progress: {
          completedTutorials: [],
          achievements: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(userRef, userData);
      Logger.info(`New user document created for: ${uid}`, 'UserCreate');
      return { success: true, userData };
    }

    return { success: true, userData: userDoc.data() as User };
  } catch (error) {
    Logger.error('Failed to create user document', 'UserCreate', error);
    return { success: false, error };
  }
}

export async function updateUserDisplayName(displayName: string) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Update auth profile
    await updateProfile(user, { displayName })

    // Get user document reference
    const userRef = doc(db, 'users', user.uid)
    
    // Check if user document exists
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData: User = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        subscription: {
          tier: 'free'
        },
        progress: {
          completedTutorials: [],
          achievements: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(userRef, userData)
    } else {
      // Update only the display name and updatedAt
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date()
      })
    }

    Logger.info(`Display name updated for user: ${user.uid}`, 'UserUpdate')
    return { success: true }
  } catch (error) {
    Logger.error('Failed to update display name', 'UserUpdate', error)
    return { success: false, error }
  }
}
