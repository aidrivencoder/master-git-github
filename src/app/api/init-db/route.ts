import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/config/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
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
    return NextResponse.json({
      success: false,
      error: 'Admin database not initialized'
    }, { status: 500 })
  }

  try {
    const batch = adminDb.batch()

    // Convert and set sample data
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

    await batch.commit()

    return NextResponse.json({
      success: true,
      message: 'Collections initialized successfully'
    })
  } catch (error: any) {
    console.error('Failed to initialize collections:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}