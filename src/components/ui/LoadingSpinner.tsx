'use client'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  className?: string
  color?: 'primary' | 'secondary' | 'accent'
}

export function LoadingSpinner({ 
  size = 'md', 
  label,
  className = '',
  color = 'primary'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400',
    secondary: 'border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300',
    accent: 'border-yellow-200 border-t-yellow-600 dark:border-yellow-800 dark:border-t-yellow-400'
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  )
}
