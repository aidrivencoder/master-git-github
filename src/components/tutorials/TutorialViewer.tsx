'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tutorial, GitVisualization } from '../../types/tutorial'
import { GitVisualizerV2 } from './GitVisualizerV2'
import { GitCommandSimulator } from './GitCommandSimulator'
import { GitCommandButtons } from './GitCommandButtons'
import { MarkdownContent } from './MarkdownContent'
import { ProgressBar } from './ProgressBar'
import { Quiz } from './Quiz'

interface TutorialViewerProps {
  tutorial: Tutorial
}

export function TutorialViewer({ tutorial }: TutorialViewerProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentVisualization, setCurrentVisualization] = useState<GitVisualization | null>(null)

  const step = tutorial.steps[currentStep]
  const isVisualTutorial = tutorial.id === 'git-visual'

  // Initialize visualization when step changes
  useEffect(() => {
    if (step.gitVisualization) {
      setCurrentVisualization(step.gitVisualization)
    } else {
      setCurrentVisualization(null)
    }
  }, [step])

  const handleStepComplete = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id])
    }

    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/tutorials')
    }
  }

  const handleVisualizationUpdate = (newVisualization: GitVisualization) => {
    setCurrentVisualization(newVisualization)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {tutorial.title}
        </h1>
        
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={tutorial.steps.length}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 sm:p-8 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownContent content={step.content} />
            </div>
            
            {currentVisualization && (
              <div className="my-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <GitVisualizerV2
                  visualization={currentVisualization}
                  interactive={isVisualTutorial}
                  onNodeClick={(nodeId) => {
                    console.log('Node clicked:', nodeId)
                  }}
                />
                {isVisualTutorial && step.type === 'interactive' && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <GitCommandButtons
                      visualization={currentVisualization}
                      onVisualizationUpdate={handleVisualizationUpdate}
                    />
                  </div>
                )}
              </div>
            )}
            
            {step.type === 'interactive' && !isVisualTutorial && (
              <div className="my-8">
                <GitCommandSimulator
                  expectedCommand="git init"
                  onSuccess={handleStepComplete}
                />
              </div>
            )}
            
            {step.quiz && (
              <div className="my-8">
                <Quiz
                  quiz={step.quiz}
                  onComplete={handleStepComplete}
                />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
                disabled={currentStep === tutorial.steps.length - 1}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
