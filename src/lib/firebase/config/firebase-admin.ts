import { initializeApp, getApps, cert, getApp, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { Logger } from '@/lib/utils/logger'
import { validateEnvironmentVariables } from './validate-env'

function initializeFirebaseAdmin() {
  try {
    // If already initialized, return existing instances
    if (getApps().length > 0) {
      const app = getApp()
      return {
        db: getFirestore(app),
        auth: getAuth(app)
      }
    }

    const { isValid, error } = validateEnvironmentVariables()
    if (!isValid) {
      throw new Error(`Firebase Admin initialization failed: ${error}`)
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing required Firebase Admin configuration')
    }

    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n')
    }

    const app = initializeApp({
      credential: cert(serviceAccount)
    })

    Logger.info('Firebase Admin initialized successfully', 'FirebaseAdmin')
    return {
      db: getFirestore(app),
      auth: getAuth(app)
    }
  } catch (error) {
    Logger.error('Failed to initialize Firebase Admin', 'FirebaseAdmin', error)
    throw error
  }
}

const { db: adminDb, auth: adminAuth } = initializeFirebaseAdmin()

export { adminDb, adminAuth }
