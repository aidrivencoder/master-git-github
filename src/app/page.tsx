'use client'

import { useEffect } from 'react'
import { TutorialHero } from '@/components/home/TutorialHero'
import { FeatureGrid } from '@/components/home/FeatureGrid'

export default function HomePage() {
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
        } else {
          console.error('Database initialization failed:', data.error)
        }
      } catch (error) {
        console.error('Error during database initialization:', error)
      }
    }

    initDb()
  }, [])

  return (
    <div className="space-y-20">
      <TutorialHero />
      <FeatureGrid />
    </div>
  )
}