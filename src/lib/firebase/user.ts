import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './config'
import { Logger } from '@/lib/utils/logger'

export async function updateUserDisplayName(displayName: string) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Update auth profile
    await updateProfile(user, { displayName })

    // Get user document reference
    const userRef = doc(db, 'users', user.uid)
    
    // Check if user document exists
    const userDoc = await getDoc(userRef)
    
    const userData = {
      displayName,
      email: user.email,
      updatedAt: new Date(),
      subscription: {
        tier: 'free'
      },
      progress: {
        completedTutorials: []
      }
    }

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date()
      })
    } else {
      // Update existing document
      await updateDoc(userRef, userData)
    }

    Logger.info(`Display name updated for user: ${user.uid}`, 'UserUpdate')
    return { success: true }
  } catch (error) {
    Logger.error('Failed to update display name', 'UserUpdate', error)
    return { success: false, error }
  }
}