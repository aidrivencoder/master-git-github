'use client'

import { useEffect } from 'react'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HeroSection } from '@/components/home/HeroSection'
import { initializeDatabase } from '@/lib/firebase/init/initialize-db'
import { Logger } from '@/lib/utils/logger'

export default function HomePage() {
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase()
      } catch (error) {
        Logger.error('Database initialization failed:', 'HomePage', error)
      }
    }
    init()
  }, [])

  return (
    <div>
      <HeroSection />
      <FeatureGrid />
    </div>
  )
}