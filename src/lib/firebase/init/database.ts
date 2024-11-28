import { Timestamp, DocumentReference } from 'firebase-admin/firestore'
import { adminDb } from '../config/firebase-admin'
import { Logger } from '@/lib/utils/logger'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function testConnection(testRef: DocumentReference) {
  await testRef.set({ timestamp: Timestamp.now() })
  await testRef.delete()
}

export async function verifyDatabaseConnection() {
  if (!adminDb) {
    Logger.error('Firebase Admin not initialized', 'DatabaseVerification')
    throw new Error('Firebase Admin not initialized')
  }

  const testRef = adminDb.collection('_test').doc('connection')
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await testConnection(testRef)
      Logger.info(`Database connection verified successfully on attempt ${attempt}`, 'DatabaseVerification')
      return true
    } catch (error) {
      Logger.warn(
        `Database connection attempt ${attempt} failed`,
        'DatabaseVerification',
        error
      )
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }

  Logger.error(`Database connection failed after ${MAX_RETRIES} attempts`, 'DatabaseVerification')
  throw new Error('Failed to establish database connection')
}