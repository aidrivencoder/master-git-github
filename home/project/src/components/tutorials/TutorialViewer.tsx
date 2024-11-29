'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tutorial } from '@/types/tutorial'
import { GitVisualizerV2 } from './GitVisualizerV2'
import { GitCommandSimulator } from './GitCommandSimulator'
import { MarkdownContent } from './MarkdownContent'
import { ProgressBar } from './ProgressBar'
import { Quiz } from './Quiz'
import { StepNavigation } from './StepNavigation'
import { useTutorialProgress } from '@/lib/hooks/useTutorialProgress'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface TutorialViewerProps {
  tutorial: Tutorial
}

export function TutorialViewer({ tutorial }: TutorialViewerProps) {
  const router = useRouter()
  const {
    currentStep,
    setCurrentStep,
    markStepComplete,
    loading: progressLoading,
    completedSteps,
    error: progressError
  } = useTutorialProgress(tutorial.id)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const step = tutorial.steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tutorial.steps.length - 1
  const isStepCompleted = completedSteps.includes(step.id)

  const handleStepComplete = async () => {
    setSaving(true)
    setError(null)
    
    try {
      await markStepComplete(step.id)
      
      if (!isLastStep) {
        setCurrentStep(currentStep + 1)
      } else {
        router.push('/tutorials')
      }
    } catch (err) {
      setError('Failed to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1)
    }
  }

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {tutorial.title}
      </h1>
      
      <div className="mb-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={tutorial.steps.length}
          completedSteps={completedSteps}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {step.title}
          </h2>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          {progressError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md">
              Failed to load progress. Your progress may not be saved.
            </div>
          )}
          
          <MarkdownContent content={step.content} />
          
          {step.gitVisualization && (
            <div className="my-8">
              <GitVisualizerV2
                visualization={step.gitVisualization}
                interactive
                onNodeClick={(nodeId) => {
                  console.log('Node clicked:', nodeId)
                }}
              />
            </div>
          )}
          
          {step.type === 'interactive' && (
            <GitCommandSimulator
              expectedCommand={step.expectedCommand || "git init"}
              onSuccess={handleStepComplete}
              disabled={saving}
            />
          )}
          
          {step.quiz && (
            <Quiz
              quiz={step.quiz}
              onComplete={handleStepComplete}
              disabled={saving}
            />
          )}

          {isStepCompleted && !isLastStep && (
            <div className="p-4 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-md">
              Step completed! You can move on to the next step.
            </div>
          )}
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={tutorial.steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          loading={saving}
          isStepCompleted={isStepCompleted}
        />
      </div>
    </div>
  )
}