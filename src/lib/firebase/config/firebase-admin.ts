import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Logger } from '@/lib/utils/logger'

const apps = getApps()

if (!apps.length) {
  try {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }

    initializeApp({
      credential: cert(serviceAccount)
    })

    Logger.info('Firebase Admin initialized successfully', 'FirebaseAdmin')
  } catch (error) {
    Logger.error('Failed to initialize Firebase Admin', 'FirebaseAdmin', error)
    throw error
  }
}

export const adminDb = getFirestore()