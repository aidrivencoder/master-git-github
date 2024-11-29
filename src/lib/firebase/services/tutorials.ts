import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { setDoc } from 'firebase/firestore'
import { initializeFirebase } from '../config'
import { Tutorial } from '@/types/tutorial'
import { Logger } from '@/lib/utils/logger'
import { tutorialsList } from '@/lib/tutorials'

const TUTORIALS_COLLECTION = 'tutorials'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

async function initializeTutorialsIfNeeded() {
  try {
    const { db } = initializeFirebase()
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    
    if (snapshot.empty) {
      Logger.info('Initializing tutorials collection', 'TutorialService')
      for (const tutorial of tutorialsList) {
        await setDoc(doc(tutorialsRef, tutorial.id), {
          ...tutorial,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
  } catch (error) {
    Logger.error('Failed to initialize tutorials', 'TutorialService', error)
  }
}

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('offline')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return retryOperation(operation, retries - 1)
    }
    throw error
  }
}

export async function getTutorials(): Promise<Tutorial[]> {
  await initializeTutorialsIfNeeded()
  
  const { db } = initializeFirebase()
  return retryOperation(async () => {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  })
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
  await initializeTutorialsIfNeeded()
  
  const { db } = initializeFirebase()
  return retryOperation(async () => {
    const tutorialRef = doc(db, TUTORIALS_COLLECTION, id)
    const tutorialDoc = await getDoc(tutorialRef)
    
    if (!tutorialDoc.exists()) {
      return null
    }
    
    return { id: tutorialDoc.id, ...tutorialDoc.data() } as Tutorial
  })
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  await initializeTutorialsIfNeeded()
  
  const { db } = initializeFirebase()
  return retryOperation(async () => {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const q = query(tutorialsRef, where('isPremium', '==', false))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  })
}