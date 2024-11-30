export interface SubscriptionStatus {
  tier: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'past_due' | 'canceled' | 'none'
  customerId?: string
  subscriptionId?: string
  currentPeriodEnd?: number
}

export interface PaymentHistory {
  id: string
  amount: number
  status: string
  created: number
}

// Extend the existing User type
declare module '@/components/providers/AuthProvider' {
  interface User {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    subscription?: SubscriptionStatus
    paymentHistory?: PaymentHistory[]
    getIdToken(): Promise<string>
  }
}
