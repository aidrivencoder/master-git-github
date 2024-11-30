import { Achievement } from './achievement'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role?: 'user' | 'admin'  // Added role field
  subscription: {
    tier: 'free' | 'premium'
    status?: 'active' | 'past_due' | 'canceled' | 'none'
    stripeCustomerId?: string
    subscriptionId?: string
    validUntil?: Date
  }
  progress: UserProgress
  paymentHistory?: PaymentHistory[]
  createdAt: Date
  updatedAt: Date
}

export interface PaymentHistory {
  id: string
  amount: number
  status: string
  created: number
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
