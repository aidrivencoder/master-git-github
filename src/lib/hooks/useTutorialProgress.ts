import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/components/providers/AuthProvider'

export function useTutorialProgress(tutorialId: string) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const progressRef = doc(db, 'progress', `${user.uid}_${tutorialId}`)
    
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setCompletedSteps(data.completedSteps || [])
        setCurrentStep(data.currentStep || 0)
      }
    })

    return () => unsubscribe()
  }, [user, tutorialId])

  const updateProgress = async (step: number) => {
    if (!user) return

    setLoading(true)
    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${tutorialId}`)
      await updateDoc(progressRef, {
        currentStep: step,
        lastAccessed: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const markStepComplete = async (stepId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${tutorialId}`)
      await updateDoc(progressRef, {
        completedSteps: arrayUnion(stepId),
        lastAccessed: serverTimestamp()
      })
    } catch (error) {
      console.error('Error marking step complete:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    currentStep,
    setCurrentStep: (step: number) => {
      setCurrentStep(step)
      updateProgress(step)
    },
    markStepComplete,
    loading,
    completedSteps
  }
}