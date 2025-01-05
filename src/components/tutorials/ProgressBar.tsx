interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  onStepClick?: (step: number) => void
  tutorial?: {
    steps: Array<{
      title: string
    }>
  }
}

export function ProgressBar({ currentStep, totalSteps, onStepClick, tutorial }: ProgressBarProps) {
  const progress = totalSteps === 1 ? 100 : Math.min((currentStep / (totalSteps - 1)) * 100, 100)

  const stepsArray = tutorial?.steps ?? Array.from({ length: totalSteps }).map((_, i) => ({
    title: tutorial?.steps?.[i]?.title ?? `Step ${i + 1}`
  }))

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
        {stepsArray.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => onStepClick?.(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 mb-2 ${
                index <= currentStep
                  ? 'bg-primary-500 dark:bg-primary-600'
                  : 'bg-primary-200 dark:bg-primary-900'
              }`}
              aria-label={`Go to step ${index + 1}: ${step.title}`}
            />
            <span 
              className={`text-xs text-center cursor-pointer hover:text-primary-500 transition-colors duration-300 ${
                index === currentStep ? 'font-semibold text-primary-500 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => onStepClick?.(index)}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}