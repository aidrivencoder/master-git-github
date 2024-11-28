'use client'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config'

function initializeFirebaseClient() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  const auth = getAuth(app)
  const db = getFirestore(app)

  if (process.env.NODE_ENV === 'development') {
    if (window.location.hostname === 'localhost') {
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
  }

  return { app, auth, db }
}

export const { app, auth, db } = initializeFirebaseClient()