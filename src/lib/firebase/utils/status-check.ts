import { adminDb } from '../config/firebase-admin'
import { Logger } from '@/lib/utils/logger'

export async function checkFirebaseStatus() {
  try {
    // Check if admin is initialized
    if (!adminDb) {
      throw new Error('Firebase Admin SDK not initialized')
    }

    // Try to list collections to verify database access
    const collections = await adminDb.listCollections()
    const collectionIds = (await Promise.all(collections.map(col => col.id)))
      .sort((a, b) => a.localeCompare(b))

    Logger.info(`Connected collections: ${collectionIds.join(', ') || 'none'}`, 'FirebaseStatus')
    
    return {
      success: true,
      collections: collectionIds,
      message: 'Firebase connection successful'
    }
  } catch (error) {
    Logger.error('Firebase status check failed', 'FirebaseStatus', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}