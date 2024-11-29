import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../config'
import { Tutorial } from '@/types/tutorial'
import { Logger } from '@/lib/utils/logger'
import { tutorialsList } from '@/lib/tutorials'

const TUTORIALS_COLLECTION = 'tutorials'

async function ensureInitialized() {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    
    if (snapshot.empty) {
      Logger.info('Initializing tutorials collection', 'TutorialService')
      await Promise.all(
        tutorialsList.map(tutorial => 
          setDoc(doc(tutorialsRef, tutorial.id), {
            ...tutorial,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        )
      )
    }
  } catch (error) {
    Logger.error('Failed to initialize tutorials', 'TutorialService', error)
  }
}

export async function initializeTutorials() {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    
    if (snapshot.empty) {
      Logger.info('Initializing tutorials collection', 'TutorialService')
      const initPromises = tutorialsList.map(tutorial => 
        setDoc(doc(tutorialsRef, tutorial.id), {
          ...tutorial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      )
      await Promise.all(initPromises)
    }
  } catch (error) {
    Logger.error('Failed to initialize tutorials', 'TutorialService', error)
    throw error
  }
}

export async function getTutorials(): Promise<Tutorial[]> {
  try {
    await ensureInitialized()
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  } catch (error) {
    Logger.error('Failed to fetch tutorials', 'TutorialService', error)
    return []
  }
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  try {
    await ensureInitialized()
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const q = query(tutorialsRef, where('isPremium', '==', false))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  } catch (error) {
    Logger.error('Failed to fetch public tutorials', 'TutorialService', error)
    return []
  }
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
  try {
    await ensureInitialized()
    const tutorialRef = doc(db, TUTORIALS_COLLECTION, id)
    const tutorialDoc = await getDoc(tutorialRef)
    
    if (!tutorialDoc.exists()) {
      return null
    }
    
    return { id: tutorialDoc.id, ...tutorialDoc.data() } as Tutorial
  } catch (error) {
    Logger.error('Failed to fetch tutorial', 'TutorialService', error)
    return null
  }
}