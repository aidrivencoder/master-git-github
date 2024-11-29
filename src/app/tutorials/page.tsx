'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Tutorial } from '@/types/tutorial'
import { TutorialCard } from '@/components/tutorials/TutorialCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTutorials() {
      try {
        const tutorialsCollection = collection(db, 'tutorials')
        const snapshot = await getDocs(tutorialsCollection)
        const tutorialsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tutorial[]
        
        setTutorials(tutorialsList)
      } catch (err) {
        setError('Failed to load tutorials')
        console.error('Error fetching tutorials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])

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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tutorials
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>

        {tutorials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tutorials available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}