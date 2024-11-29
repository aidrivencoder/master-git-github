'use client'

import { Tutorial, TutorialStep } from '@/types/tutorial'
import { StepNavigation } from './StepNavigation'
import { ProgressBar } from './ProgressBar'
import { MarkdownContent } from './MarkdownContent'
import { GitVisualizer } from './GitVisualizer'
import { Quiz } from './Quiz'
import { useTutorialProgress } from '@/lib/hooks/useTutorialProgress'

interface TutorialViewerProps {
  tutorial: Tutorial
}

export function TutorialViewer({ tutorial }: TutorialViewerProps) {
  const { 
    currentStep, 
    setCurrentStep, 
    markStepComplete,
    loading 
  } = useTutorialProgress(tutorial.id)
  
  const step = tutorial.steps[currentStep]

  const handleStepComplete = async () => {
    if (step) {
      await markStepComplete(step.id)
      if (currentStep < tutorial.steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{tutorial.title}</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        <ProgressBar
          currentStep={currentStep}
          totalSteps={tutorial.steps.length} 
          onStepClick={setCurrentStep}
        />
        
        <StepContent 
          step={step}
          onComplete={handleStepComplete}
        />
        
        <StepNavigation
          currentStep={currentStep}
          totalSteps={tutorial.steps.length}
          onNext={() => setCurrentStep(currentStep + 1)}
          onPrevious={() => setCurrentStep(currentStep - 1)}
        />
      </div>
    </div>
  )
}

interface StepContentProps {
  step: TutorialStep
  onComplete: () => void
}

function StepContent({ step, onComplete }: StepContentProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{step.title}</h2>
      
      <MarkdownContent content={step.content} />
      
      {step.gitVisualization && (
        <GitVisualizer visualization={step.gitVisualization} />
      )}
      
      {step.quiz && (
        <Quiz 
          quiz={step.quiz}
          onComplete={onComplete}
        />
      )}
    </div>
  )
}