import { Timestamp, DocumentReference } from 'firebase-admin/firestore'
import { adminDb } from '../config/firebase-admin'
import { Logger } from '@/lib/utils/logger'
import { initializeCollections } from './initialize-collections'

const MAX_RETRIES = 5
const BASE_DELAY = 1000

const INIT_DOC_PATH = '_system/initialization'

async function wait(attempt: number) {
  const delay = Math.min(BASE_DELAY * Math.pow(2, attempt - 1), 10000)
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function checkInitializationStatus(): Promise<boolean> {
  try {
    const initDoc = await adminDb.doc(INIT_DOC_PATH).get()
    return initDoc.exists
  } catch (error) {
    Logger.error('Failed to check initialization status', 'DatabaseInit', error)
    return false
  }
}

async function markInitialized() {
  try {
    await adminDb.doc(INIT_DOC_PATH).set({
      timestamp: Timestamp.now(),
      version: '1.0'
    }, { merge: true })
  } catch (error) {
    Logger.error('Failed to mark as initialized', 'DatabaseInit', error)
    throw error
  }
}

async function testConnection(testRef: DocumentReference) {
  await testRef.set({ timestamp: Timestamp.now() })
  await testRef.delete()
}

export async function verifyDatabaseConnection() {
  if (!adminDb) {
    Logger.error('Firebase Admin not initialized', 'DatabaseInit')
    throw new Error('Firebase Admin not initialized')
  }

  const testRef = adminDb.collection('_test').doc('connection')
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await testConnection(testRef)
      Logger.info(`Database connection verified successfully on attempt ${attempt}`, 'DatabaseInit')
      await initializeCollections()      
      return true
    } catch (error) {
      lastError = error as Error
      Logger.warn(
        `Database connection attempt ${attempt} failed`,
        'DatabaseInit',
        error
      )
      
      if (attempt < MAX_RETRIES) {
        await wait(attempt)
      }
    }
  }

  const errorMessage = `Database connection failed after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
  Logger.error(errorMessage, 'DatabaseInit')
  throw new Error(errorMessage)
}
