import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { Logger } from '@/lib/utils/logger'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function getFirebaseApp() {
  try {
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase configuration is missing')
    }

    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  } catch (error) {
    Logger.error('Failed to initialize Firebase', 'Firebase', error)
    throw error
  }
}

const app = getFirebaseApp()
const auth = getAuth(app)
const db = getFirestore(app)

Logger.info('Firebase initialized successfully', 'Firebase')

export { app, auth, db }