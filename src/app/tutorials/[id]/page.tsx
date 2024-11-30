'use client'

import { useEffect, useState } from 'react'
import { TutorialPage as ClientTutorialPage } from '@/components/tutorials/TutorialPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PremiumContent } from '@/components/premium/PremiumContent'
import Link from 'next/link'
import { Tutorial } from '@/types/tutorial'
import { getTutorialById } from '@/tutorials/data'

interface TutorialPageProps {
  params: { id: string }
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">Loading tutorial content...</p>
        </div>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tutorial Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The tutorial you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/tutorials"
            className="inline-block px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchedTutorial = getTutorialById(params.id)
    setTutorial(fetchedTutorial || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <LoadingState />
  }

  if (!tutorial) {
    return <NotFoundState />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tutorial.isPremium ? (
          <PremiumContent>
            <ClientTutorialPage tutorial={tutorial} />
          </PremiumContent>
        ) : (
          <ClientTutorialPage tutorial={tutorial} />
        )}
      </div>
    </div>
  )
}
