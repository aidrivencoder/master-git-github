import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config'
import { Tutorial } from '@/types/tutorial'
import { Logger } from '@/lib/utils/logger'

const TUTORIALS_COLLECTION = 'tutorials'

export async function getTutorials(): Promise<Tutorial[]> {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  } catch (error) {
    Logger.error('Failed to fetch tutorials', 'TutorialService', error)
    throw error
  }
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
  try {
    const tutorialRef = doc(db, TUTORIALS_COLLECTION, id)
    const tutorialDoc = await getDoc(tutorialRef)
    
    if (!tutorialDoc.exists()) {
      return null
    }
    
    return { id: tutorialDoc.id, ...tutorialDoc.data() } as Tutorial
  } catch (error) {
    Logger.error(`Failed to fetch tutorial: ${id}`, 'TutorialService', error)
    throw error
  }
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const q = query(tutorialsRef, where('isPremium', '==', false))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial))
  } catch (error) {
    Logger.error('Failed to fetch public tutorials', 'TutorialService', error)
    throw error
  }
}