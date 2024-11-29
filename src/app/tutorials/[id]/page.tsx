'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTutorialById } from '@/lib/firebase/services/tutorials'
import { Tutorial } from '@/types/tutorial'
import { InteractiveTutorial } from '@/components/tutorials/InteractiveTutorial'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { tutorialsList } from '@/lib/tutorials'

interface TutorialPageProps {
  params: { id: string }
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const router = useRouter()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTutorial() {
      try {
        const fetchedTutorial = await getTutorialById(params.id as string)
        if (fetchedTutorial) {
          setTutorial(fetchedTutorial)
        } else {
          setError('Tutorial not found')
        }
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

  if (error || !tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Tutorial not found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later or choose a different tutorial.
          </p>
        </div>
      </div>
    )
  }

  return (
    <InteractiveTutorial 
      tutorial={tutorial} 
      onComplete={() => router.push('/tutorials')}
    />
  )
}

export async function generateStaticParams() {
  return tutorialsList.map((tutorial) => ({
    id: tutorial.id,
  }))
}