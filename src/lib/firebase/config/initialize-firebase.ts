import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config'

let app
let auth
let db

export function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (!app && typeof window !== 'undefined') {
      app = getApps().length ? getApp() : initializeApp(firebaseConfig)
      auth = getAuth(app)
      db = getFirestore(app)
      
      console.log('Firebase initialized successfully')
      return { app, auth, db }
    }
    
    return { app, auth, db }
  } catch (error) {
    console.error('Error initializing Firebase:', error)
    throw error
  }
}