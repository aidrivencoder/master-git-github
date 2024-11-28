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
  type QueryConstraint
} from 'firebase/firestore'
import { db } from './config'
import type { FirebaseUser } from './schema/users'
import type { Tutorial } from './schema/tutorials'
import type { UserProgress } from './schema/progress'
import type { Subscription } from './schema/subscriptions'

// Users
export const getUserRef = (userId: string) => doc(db, 'users', userId)
export const getUserData = async (userId: string) => {
  const userDoc = await getDoc(getUserRef(userId))
  return userDoc.data() as FirebaseUser | undefined
}

// Tutorials
export const getTutorialRef = (tutorialId: string) => doc(db, 'tutorials', tutorialId)
export const getTutorialData = async (tutorialId: string) => {
  const tutorialDoc = await getDoc(getTutorialRef(tutorialId))
  return tutorialDoc.data() as Tutorial | undefined
}

// Progress
export const getProgressRef = (progressId: string) => doc(db, 'progress', progressId)
export const getUserProgress = async (userId: string, tutorialId: string) => {
  const progressQuery = query(
    collection(db, 'progress'),
    where('userId', '==', userId),
    where('tutorialId', '==', tutorialId)
  )
  const snapshot = await getDocs(progressQuery)
  return snapshot.docs[0]?.data() as UserProgress | undefined
}

// Subscriptions
export const getSubscriptionRef = (subscriptionId: string) => doc(db, 'subscriptions', subscriptionId)
export const getUserSubscription = async (userId: string) => {
  const subQuery = query(
    collection(db, 'subscriptions'),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(subQuery)
  return snapshot.docs[0]?.data() as Subscription | undefined
}