'use client'

import Link from 'next/link'
import { Tutorial } from '@/types/tutorial'

interface TutorialCardProps {
  tutorial: Tutorial
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Link href={`/tutorials/${tutorial.id}`}>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tutorial.title}
          </h2>
          {tutorial.isPremium && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Premium
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {tutorial.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {tutorial.estimatedTime} min
          </span>
          <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium
            ${tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {tutorial.difficulty}
          </span>
        </div>
      </div>
    </Link>
  )
}
