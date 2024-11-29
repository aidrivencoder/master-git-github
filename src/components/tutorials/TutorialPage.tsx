'use client'

import { Tutorial } from '@/types/tutorial'
import { TutorialViewer } from './TutorialViewer'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/error/ErrorFallback'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Suspense } from 'react'

interface TutorialPageProps {
  tutorial: Tutorial | null
}

export function TutorialPage({ tutorial }: TutorialPageProps) {
  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tutorial not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later or choose a different tutorial.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <TutorialViewer tutorial={tutorial} />
      </Suspense>
    </ErrorBoundary>
  )
}