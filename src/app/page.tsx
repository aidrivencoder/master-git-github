import { TutorialHero } from '@/components/home/TutorialHero'
import { FeatureGrid } from '@/components/home/FeatureGrid'

export default function HomePage() {
  return (
    <div className="space-y-20">
      <TutorialHero />
      <FeatureGrid />
    </div>
  )
}