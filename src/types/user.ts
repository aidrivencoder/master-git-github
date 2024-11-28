export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  subscription: SubscriptionStatus
  progress: UserProgress
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionStatus {
  tier: 'free' | 'premium'
  validUntil?: Date
  stripeCustomerId?: string
}

export interface UserProgress {
  completedTutorials: string[]
  currentTutorial?: {
    id: string
    currentStep: number
    startedAt: Date
  }
  achievements: Achievement[]
}