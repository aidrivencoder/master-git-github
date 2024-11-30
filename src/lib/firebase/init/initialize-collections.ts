import { adminDb, adminAuth } from '../config/firebase-admin'
import { Logger } from '@/lib/utils/logger'
import { sampleUser, sampleTutorial, sampleProgress, sampleSubscription } from './sampleData'
import { adminUser } from './adminData'
import { Timestamp, WriteResult } from 'firebase-admin/firestore'

export async function initializeCollections() {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized')
  }

  const batch = adminDb.batch()

  try {
    // Create admin user in Authentication
    try {
      await adminAuth.createUser({
        uid: adminUser.id,
        email: adminUser.email,
        password: 'admin123', // Default password
        displayName: adminUser.displayName,
      });
      Logger.info('Admin user created in Authentication', 'DatabaseInitialization');
    } catch (error: any) {
      // If user already exists, just log it
      if (error.code !== 'auth/email-already-exists') {
        throw error;
      }
      Logger.info('Admin user already exists in Authentication', 'DatabaseInitialization');
    }

    // Admin User in Firestore
    const adminRef = adminDb.collection('users').doc(adminUser.id)
    batch.set(adminRef, adminUser)

    // Sample Users Collection
    const userRef = adminDb.collection('users').doc(sampleUser.id)
    batch.set(userRef, sampleUser)

    // Tutorials Collection
    const tutorialRef = adminDb.collection('tutorials').doc(sampleTutorial.id)
    batch.set(tutorialRef, sampleTutorial)

    // Progress Collection
    const progressRef = adminDb.collection('progress').doc(`${sampleProgress.userId}_${sampleProgress.tutorialId}`)
    batch.set(progressRef, sampleProgress)

    // Subscriptions Collection
    const subscriptionRef = adminDb.collection('subscriptions').doc(sampleSubscription.userId)
    batch.set(subscriptionRef, sampleSubscription)

    // Commit the batch
    const result: WriteResult[] = await batch.commit()
    
    Logger.info(`Collections initialized successfully: ${result.length} operations completed`, 'DatabaseInitialization')
    return result
  } catch (error) {
    Logger.error('Failed to initialize collections', 'DatabaseInitialization', error)
    throw error
  }
}
