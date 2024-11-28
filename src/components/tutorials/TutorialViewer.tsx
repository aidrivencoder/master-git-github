'use client'

import { useState } from 'react'
import { Tutorial, TutorialStep } from '@/types/tutorial'
import { GitVisualizer } from './GitVisualizer'
import { StepNavigation } from './StepNavigation'
import { Quiz } from './Quiz'

interface TutorialViewerProps {
  tutorial: Tutorial
}

export function TutorialViewer({ tutorial }: TutorialViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = tutorial.steps[currentStepIndex]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{tutorial.title}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <StepProgress 
          currentStep={currentStepIndex + 1} 
          totalSteps={tutorial.steps.length} 
        />
        
        <StepContent step={currentStep} />
        
        <StepNavigation
          currentStep={currentStepIndex}
          totalSteps={tutorial.steps.length}
          onNext={() => setCurrentStepIndex(i => i + 1)}
          onPrevious={() => setCurrentStepIndex(i => i - 1)}
        />
      </div>
    </div>
  )
}

function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-6">
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  )
}

function StepContent({ step }: { step: TutorialStep }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{step.title}</h2>
      
      <div className="prose max-w-none">
        {step.content}
      </div>
      
      {step.gitVisualization && (
        <GitVisualizer visualization={step.gitVisualization} />
      )}
      
      {step.quiz && (
        <Quiz quiz={step.quiz} />
      )}
    </div>
  )
}