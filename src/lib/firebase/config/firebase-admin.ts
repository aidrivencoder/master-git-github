import { initializeApp, getApps, cert, getApp, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Logger } from '@/lib/utils/logger'
import { validateEnvironmentVariables } from './validate-env'

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getFirestore(getApp())
  }

  const { isValid, error } = validateEnvironmentVariables()
  if (!isValid) {
    throw new Error(error)
  }

  const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
  }

  const app = initializeApp({
    credential: cert(serviceAccount)
  })

  Logger.info('Firebase Admin initialized successfully', 'FirebaseAdmin')
  return getFirestore(app)
}

let adminDb: ReturnType<typeof getFirestore>

try {
  adminDb = initializeFirebaseAdmin()
} catch (error) {
  Logger.error('Failed to initialize Firebase Admin', 'FirebaseAdmin', error)
  throw error
}

export { adminDb }
