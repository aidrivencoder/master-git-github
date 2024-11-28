interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  onStepClick?: (step: number) => void
}

export function ProgressBar({ currentStep, totalSteps, onStepClick }: ProgressBarProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100

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
      <div className="flex h-2 mb-4 overflow-hidden bg-primary-200 rounded dark:bg-primary-900">
        <div
          style={{ width: `${progress}%` }}
          className="flex flex-col justify-center overflow-hidden bg-primary-500 dark:bg-primary-600 transition-all duration-500"
        />
      </div>
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <button
            key={index}
            onClick={() => onStepClick?.(index)}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              index <= currentStep
                ? 'bg-primary-500 dark:bg-primary-600'
                : 'bg-primary-200 dark:bg-primary-900'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}