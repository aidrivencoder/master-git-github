import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore'
import { db } from '../config'
import { Tutorial } from '@/types/tutorial'
import { Logger } from '@/lib/utils/logger'

const TUTORIALS_COLLECTION = 'tutorials'

export async function getTutorials(): Promise<Tutorial[]> {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const snapshot = await getDocs(tutorialsRef)
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        steps: data.steps.map((step: any) => ({
          ...step,
          content: step.content?.toString() || ''
        }))
      } as Tutorial
    })
  } catch (error) {
    Logger.error('Failed to fetch tutorials', 'TutorialService', error)
    return []
  }
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    const q = query(tutorialsRef, where('isPremium', '==', false))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        steps: data.steps.map((step: any) => ({
          ...step,
          content: step.content?.toString() || ''
        }))
      } as Tutorial
    })
  } catch (error) {
    Logger.error('Failed to fetch public tutorials', 'TutorialService', error)
    return []
  }
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
  try {
    const tutorialRef = doc(db, TUTORIALS_COLLECTION, id)
    const tutorialDoc = await getDoc(tutorialRef)
    
    if (!tutorialDoc.exists()) {
      return null
    }
    
    const data = tutorialDoc.data()
    return {
      id: tutorialDoc.id,
      ...data,
      steps: data.steps.map((step: any) => ({
        ...step,
        content: step.content?.toString() || ''
      }))
    } as Tutorial
  } catch (error) {
    Logger.error('Failed to fetch tutorial', 'TutorialService', error)
    return null
  }
}
