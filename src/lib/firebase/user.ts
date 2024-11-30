import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { auth, db } from './config'
import { Logger } from '../utils/logger'

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
    const subscriptionRef = doc(collection(db, 'subscriptions'), userId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    if (!subscriptionDoc.exists()) {
      return false;
    }

    const subscription = subscriptionDoc.data();
    return subscription.status === 'active';
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
      const userData = {
        id: uid,
        email,
        displayName: email.split('@')[0], // Default display name
        subscription: {
          tier: 'free',
          stripeCustomerId: customerId
        },
        progress: {
          completedTutorials: [],
          totalTimeSpent: 0
        },
        preferences: {
          emailNotifications: true,
          theme: 'system',
          difficulty: 'beginner',
          language: 'en'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(userRef, userData);
      Logger.info(`New user document created for: ${uid}`, 'UserCreate');
      return { success: true, userData };
    }

    return { success: true, userData: userDoc.data() };
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
    
    const userData = {
      displayName,
      email: user.email,
      updatedAt: new Date(),
      subscription: {
        tier: 'free'
      },
      progress: {
        completedTutorials: []
      }
    }

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date()
      })
    } else {
      // Update existing document
      await updateDoc(userRef, userData)
    }

    Logger.info(`Display name updated for user: ${user.uid}`, 'UserUpdate')
    return { success: true }
  } catch (error) {
    Logger.error('Failed to update display name', 'UserUpdate', error)
    return { success: false, error }
  }
}
