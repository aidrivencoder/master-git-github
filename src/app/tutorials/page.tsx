'use client'

import { useEffect, useState } from 'react'
import { Tutorial } from '@/types/tutorial'
import { TutorialCard } from '@/components/tutorials/TutorialCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { tutorials } from '@/tutorials/data'

export default function TutorialsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading to prevent UI flash
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Git & GitHub Tutorials
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
