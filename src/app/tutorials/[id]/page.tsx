'use client'

import { useEffect, useState } from 'react'
import { TutorialPage as ClientTutorialPage } from '@/components/tutorials/TutorialPage'
import { getTutorialById } from '@/lib/firebase/services/tutorials'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { Tutorial } from '@/types/tutorial'

interface TutorialPageProps {
  params: { id: string }
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <LoadingSpinner size="lg" />
    </div>
  )
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Tutorial
            </h2>
            <p className="text-red-600 dark:text-red-400">{message}</p>
            <button 
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tutorial Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The tutorial you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/tutorials"
              className="inline-block px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTutorial = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedTutorial = await getTutorialById(params.id)
      setTutorial(fetchedTutorial)
    } catch (err) {
      setError('Failed to load tutorial')
      console.error('Error fetching tutorial:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorial()
  }, [params.id])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTutorial} />
  }

  if (!tutorial) {
    return <NotFoundState />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientTutorialPage tutorial={tutorial} />
    </div>
  )
}
