'use client'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { Logger } from '../../../lib/utils/logger'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function initializeFirebaseClient() {
  try {
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase configuration is missing. Check your environment variables.')
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const auth = getAuth(app)
    const db = getFirestore(app)

    if (process.env.NODE_ENV === 'development') {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://localhost:9099')
        connectFirestoreEmulator(db, 'localhost', 8080)
      }
    }

    Logger.info('Firebase client initialized successfully', 'FirebaseClient')
    return { app, auth, db }
  } catch (error) {
    Logger.error('Failed to initialize Firebase client', 'FirebaseClient', error)
    throw error
  }
}

export const { app, auth, db } = initializeFirebaseClient()
