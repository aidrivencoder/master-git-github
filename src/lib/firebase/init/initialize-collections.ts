import { adminDb } from '../config/firebase-admin'
import { Logger } from '@/lib/utils/logger'
import { sampleUser, sampleTutorial, sampleProgress, sampleSubscription } from './sampleData'
import { Timestamp, WriteResult } from 'firebase-admin/firestore'

export async function initializeCollections() {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized')
  }

  const batch = adminDb.batch()

  try {
    // Users Collection
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