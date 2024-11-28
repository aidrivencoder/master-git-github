import { create } from 'zustand'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'

interface TutorialProgress {
  currentStep: number
  totalSteps: number
  completed: boolean
  loading: boolean
  setCurrentStep: (step: number) => Promise<void>
  markStepComplete: (stepId: string) => Promise<void>
  initializeTutorial: (tutorialId: string, totalSteps: number) => void
}

export const useTutorialProgress = create<TutorialProgress>((set, get) => ({
  currentStep: 0,
  totalSteps: 0,
  completed: false,
  loading: false,

  initializeTutorial: (tutorialId: string, totalSteps: number) => {
    set({ totalSteps, currentStep: 0, completed: false })
  },

  setCurrentStep: async (step: number) => {
    if (step >= 0 && step < get().totalSteps) {
      set({ currentStep: step })
      
      // Update progress in Firestore
      try {
        const userId = 'current-user-id' // Replace with actual user ID
        const progressRef = doc(db, 'progress', `${userId}_${get().currentStep}`)
        await updateDoc(progressRef, {
          currentStep: step,
          lastAccessed: new Date()
        })
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
  },

  markStepComplete: async (stepId: string) => {
    try {
      set({ loading: true })
      const userId = 'current-user-id' // Replace with actual user ID
      const progressRef = doc(db, 'progress', `${userId}_${stepId}`)
      
      await updateDoc(progressRef, {
        completedSteps: [...get().completed ? [] : [stepId]],
        lastAccessed: new Date()
      })
      
      set({ loading: false })
    } catch (error) {
      console.error('Error marking step complete:', error)
      set({ loading: false })
    }
  }
}))