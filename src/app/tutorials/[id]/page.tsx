import { Tutorial } from '@/types/tutorial'
import { getTutorialById } from '@/lib/firebase/services/tutorials'
import { TutorialViewer } from '@/components/tutorials/TutorialViewer'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/error/ErrorFallback'
import { tutorialsList } from '@/lib/tutorials'

interface TutorialPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return tutorialsList.map((tutorial) => ({
    id: tutorial.id,
  }))
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = await getTutorialById(params.id)

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
      <TutorialViewer tutorial={tutorial} />
    </ErrorBoundary>
  )
}