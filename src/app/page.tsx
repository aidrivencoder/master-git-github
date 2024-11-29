'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HeroSection } from '@/components/home/HeroSection'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // If user is logged in, return null as we're redirecting
  if (user) {
    return null
  }

  // If not logged in, show landing page
  return (
    <div>
      <HeroSection />
      <FeatureGrid />
    </div>
  )
}
