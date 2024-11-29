import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

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
