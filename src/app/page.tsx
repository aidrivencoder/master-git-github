'use client'

import { useEffect, useState } from 'react'
import { TutorialHero } from '@/components/home/TutorialHero'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { Logger } from '@/lib/utils/logger'

export default function HomePage() {
  const [dbStatus, setDbStatus] = useState<{ success: boolean; message?: string; error?: string }>()

  useEffect(() => {
    const initDb = async () => {
      try {
        const response = await fetch('/api/init-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          console.log('Database initialized:', data.message)
          // Check Firebase status after initialization
          const statusResponse = await fetch('/api/firebase-status')
          const statusData = await statusResponse.json()
          setDbStatus(statusData)
        } else {
          console.error('Database initialization failed:', data.error)
          setDbStatus({ success: false, error: data.error })
        }
      } catch (error) {
        console.error('Error during database initialization:', error)
        setDbStatus({ success: false, error: 'Failed to initialize database' })
      }
    }

    initDb()
  }, [])

  return (
    <div className="space-y-20">
      {dbStatus && (
        <div className={`p-4 ${dbStatus.success ? 'bg-green-100' : 'bg-red-100'} rounded-md mx-auto max-w-7xl mt-4`}>
          <p className="text-sm">
            {dbStatus.success ? (
              <>Database Status: Connected (Collections: {dbStatus.collections?.join(', ') || 'none'})</>
            ) : (
              <>Database Error: {dbStatus.error}</>
            )}
          </p>
        </div>
      )}
      <TutorialHero />
      <FeatureGrid />
    </div>
  )
}