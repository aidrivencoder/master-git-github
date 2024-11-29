import { useState } from 'react'
import { Tutorial, TutorialStep } from '@/types/tutorial'
import { GitVisualizerV2 } from './GitVisualizerV2'
import { GitCommandSimulator } from './GitCommandSimulator'
import { MarkdownContent } from './MarkdownContent'
import { ProgressBar } from './ProgressBar'
import { Quiz } from './Quiz'

interface InteractiveTutorialProps {
  tutorial: Tutorial
  onComplete?: () => void
}

export function InteractiveTutorial({ tutorial, onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const step = tutorial.steps[currentStep]

  const handleStepComplete = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id])
    }

    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (onComplete) {
      onComplete()
    }
  }

  const progress = (completedSteps.length / tutorial.steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{tutorial.title}</h1>
      
      <div className="mb-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={tutorial.steps.length}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <StepContent
          step={step}
          onComplete={handleStepComplete}
        />

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
            disabled={currentStep === tutorial.steps.length - 1}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
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
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">{step.title}</h2>
      
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
          expectedCommand="git init"
          onSuccess={onComplete}
        />
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