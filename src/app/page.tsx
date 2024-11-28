'use client'

import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HeroSection } from '@/components/home/HeroSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeatureGrid />
    </div>
  )
}