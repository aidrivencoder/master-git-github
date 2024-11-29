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
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading tutorial content...</p>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Error Loading Tutorial
          </h2>
          <p className="text-red-600 dark:text-red-400 text-lg">{message}</p>
          <div className="space-x-4">
            <button 
              onClick={onRetry}
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm"
            >
              Try Again
            </button>
            <Link 
              href="/tutorials"
              className="inline-block px-6 py-2.5 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 font-medium shadow-sm"
            >
              Back to Tutorials
            </Link>
          </div>
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
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchTutorial = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching tutorial:', params.id) // Debug log
      const fetchedTutorial = await getTutorialById(params.id)
      console.log('Fetched tutorial:', fetchedTutorial) // Debug log
      
      if (!fetchedTutorial) {
        console.log('Tutorial not found') // Debug log
        setError('Tutorial not found')
        return
      }
      
      setTutorial(fetchedTutorial)
    } catch (err) {
      console.error('Error fetching tutorial:', err)
      setError('Failed to load tutorial')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTutorial()
    }, 1000) // Add a slight delay to allow Firebase to initialize

    return () => clearTimeout(timer)
  }, [params.id, retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error === 'Tutorial not found') {
    return <NotFoundState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />
  }

  if (!tutorial) {
    return <NotFoundState />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientTutorialPage tutorial={tutorial} />
      </div>
    </div>
  )
}
