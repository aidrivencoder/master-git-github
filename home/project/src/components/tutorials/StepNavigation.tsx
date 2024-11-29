'use client'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  loading?: boolean
  isStepCompleted?: boolean
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious,
  loading = false,
  isStepCompleted = false
}: StepNavigationProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={isFirstStep || loading}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center space-x-2">
        {!isLastStep && (
          <button
            onClick={onNext}
            disabled={loading || !isStepCompleted}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 border border-transparent rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Step
          </button>
        )}

        {isLastStep && isStepCompleted && (
          <button
            onClick={onNext}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 border border-transparent rounded-md hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Complete Tutorial
          </button>
        )}
      </div>
    </div>
  )
}