interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  onStepClick?: (step: number) => void
}

export function ProgressBar({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick
}: ProgressBarProps) {
  const progress = Math.min((completedSteps.length / totalSteps) * 100, 100)

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200 dark:text-primary-200 dark:bg-primary-900">
            Progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-400">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <div className="flex h-2 mb-4 overflow-hidden bg-primary-200 rounded dark:bg-primary-900 transition-all duration-300">
        <div
          style={{ width: `${progress}%` }}
          className="flex flex-col justify-center overflow-hidden bg-primary-500 dark:bg-primary-600 transition-all duration-300"
        />
      </div>
      
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = completedSteps.includes(`step-${index + 1}`)
          const isCurrent = index === currentStep
          
          return (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              disabled={!isCompleted && index > currentStep}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-primary-500 dark:bg-primary-600'
                  : isCurrent
                  ? 'bg-primary-400 dark:bg-primary-500'
                  : 'bg-primary-200 dark:bg-primary-900'
              } ${
                !isCompleted && index > currentStep
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:ring-2 hover:ring-primary-400 dark:hover:ring-primary-500'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}