'use client'

import { useEffect, useState } from 'react'
import { TutorialPage as ClientTutorialPage } from '@/components/tutorials/TutorialPage'
import { getTutorialById } from '@/lib/firebase/services/tutorials'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface TutorialPageProps {
  params: { id: string }
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTutorial() {
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

    fetchTutorial()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return <ClientTutorialPage tutorial={tutorial} />
}