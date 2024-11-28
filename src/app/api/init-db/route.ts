import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/config/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { verifyDatabaseConnection } from '@/lib/firebase/init/database'
import { Logger } from '@/lib/utils/logger'
import { 
  sampleUser, 
  sampleTutorial, 
  sampleProgress, 
  sampleSubscription 
} from '@/lib/firebase/init/sampleData'

function convertTimestamps(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return Timestamp.fromDate(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps)
  }

  const converted: any = {}
  for (const key in obj) {
    if (obj[key] && typeof obj[key].toDate === 'function') {
      converted[key] = Timestamp.fromDate(obj[key].toDate())
    } else if (typeof obj[key] === 'object') {
      converted[key] = convertTimestamps(obj[key])
    } else {
      converted[key] = obj[key]
    }
  }
  return converted
}

export async function POST() {
  if (!adminDb) {
    Logger.error('Firebase Admin initialization failed', 'InitDB')
    return NextResponse.json({
      success: false, 
      error: 'Firebase Admin initialization failed. Please check your environment variables and Firebase configuration.'
    }, { status: 500 })
  }

  try {
    try {
      await verifyDatabaseConnection()
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Firestore database. Please verify your Firebase configuration and network connection.'
      }, { status: 500 })
    }

    const batch = adminDb.batch()
    
    // Ensure all data is properly converted before batch operations
    try {
      const convertedUser = convertTimestamps(sampleUser)
      const convertedTutorial = convertTimestamps(sampleTutorial)
      const convertedProgress = convertTimestamps(sampleProgress)
      const convertedSubscription = convertTimestamps(sampleSubscription)

      // Users Collection
      const userRef = adminDb.collection('users').doc(convertedUser.id)
      batch.set(userRef, convertedUser)

      // Tutorials Collection
      const tutorialRef = adminDb.collection('tutorials').doc(convertedTutorial.id)
      batch.set(tutorialRef, convertedTutorial)

      // Progress Collection
      const progressRef = adminDb.collection('progress').doc(`${convertedProgress.userId}_${convertedProgress.tutorialId}`)
      batch.set(progressRef, convertedProgress)

      // Subscriptions Collection
      const subscriptionRef = adminDb.collection('subscriptions').doc(convertedSubscription.userId)
      batch.set(subscriptionRef, convertedSubscription)
    } catch (error) {
      Logger.error('Error preparing batch operations', 'InitDB', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to prepare database operations'
      }, { status: 500 })
    }

    await batch.commit()
    Logger.info('Database collections initialized successfully', 'InitDB')

    return NextResponse.json({
      success: true,
      message: 'Database collections initialized successfully'
    })
  } catch (error: any) {
    Logger.error('Failed to initialize collections', 'InitDB', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred while initializing the database'
    }, { status: 500 })
  }
}