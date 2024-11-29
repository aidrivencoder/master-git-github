import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  type DocumentReference,
  type QuerySnapshot,
  type DocumentSnapshot
} from 'firebase/firestore'
import { db } from './config'
import { Logger } from '@/lib/utils/logger'
import type { FirebaseUser } from './schema/users'
import type { Tutorial } from './schema/tutorials'
import type { UserProgress } from './schema/progress'
import type { Subscription } from './schema/subscriptions'

// Users
export const getUserRef = (userId: string): DocumentReference => doc(db, 'users', userId)

export async function getUserData(userId: string): Promise<FirebaseUser | null> {
  try {
    const userDoc = await getDoc(getUserRef(userId))
    return userDoc.exists() ? (userDoc.data() as FirebaseUser) : null
  } catch (error) {
    Logger.error(`Failed to get user data for ${userId}`, 'Database', error)
    return null
  }
}

// Tutorials
export const getTutorialRef = (tutorialId: string): DocumentReference => doc(db, 'tutorials', tutorialId)

export async function getTutorialData(tutorialId: string): Promise<Tutorial | null> {
  try {
    const tutorialDoc = await getDoc(getTutorialRef(tutorialId))
    return tutorialDoc.exists() ? (tutorialDoc.data() as Tutorial) : null
  } catch (error) {
    Logger.error(`Failed to get tutorial data for ${tutorialId}`, 'Database', error)
    return null
  }
}

// Progress
export const getProgressRef = (progressId: string): DocumentReference => doc(db, 'progress', progressId)

export async function getUserProgress(userId: string, tutorialId: string): Promise<UserProgress | null> {
  try {
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', userId),
      where('tutorialId', '==', tutorialId)
    )
    const snapshot = await getDocs(progressQuery)
    return !snapshot.empty ? (snapshot.docs[0].data() as UserProgress) : null
  } catch (error) {
    Logger.error(`Failed to get user progress for ${userId} on tutorial ${tutorialId}`, 'Database', error)
    return null
  }
}

// Subscriptions
export const getSubscriptionRef = (subscriptionId: string): DocumentReference => doc(db, 'subscriptions', subscriptionId)

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subQuery = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(subQuery)
    return !snapshot.empty ? (snapshot.docs[0].data() as Subscription) : null
  } catch (error) {
    Logger.error(`Failed to get subscription for user ${userId}`, 'Database', error)
    return null
  }
}
