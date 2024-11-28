import { collection, doc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '../config'
import { 
  sampleUser, 
  sampleTutorial, 
  sampleProgress, 
  sampleSubscription 
} from './sampleData'

export async function initializeCollections() {
  if (!db) {
    throw new Error('Firestore instance not initialized')
  }

  try {
    // First verify we can connect to Firestore
    const testRef = doc(collection(db, '_test_connection'))
    await setDoc(testRef, { timestamp: new Date() })

    // If we get here, connection is working
    const batch = writeBatch(db)

    // Users Collection
    const userRef = doc(db, 'users', sampleUser.id)
    batch.set(userRef, sampleUser)

    // Tutorials Collection
    const tutorialRef = doc(db, 'tutorials', sampleTutorial.id)
    batch.set(tutorialRef, sampleTutorial)

    // Progress Collection
    const progressRef = doc(db, 'progress', `${sampleProgress.userId}_${sampleProgress.tutorialId}`)
    batch.set(progressRef, sampleProgress)

    // Subscriptions Collection
    const subscriptionRef = doc(db, 'subscriptions', sampleSubscription.userId)
    batch.set(subscriptionRef, sampleSubscription)

    // Commit all changes
    await batch.commit()
    
    return {
      success: true,
      message: 'Collections initialized successfully'
    }
  } catch (error) {
    console.error('Failed to initialize collections:', error)
    
    return {
      success: false,
      error: error.message,
      code: error.code
    }
  }
}