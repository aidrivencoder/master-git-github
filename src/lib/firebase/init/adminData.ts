import { Timestamp } from 'firebase-admin/firestore'

const now = Timestamp.now()
const futureDate = Timestamp.fromMillis(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

export const adminUser = {
  id: 'admin-user',
  email: 'admin@example.com',
  displayName: 'Admin User',
  photoURL: null,
  githubIntegration: {
    connected: false,
    lastSynced: now
  },
  subscription: {
    tier: 'premium',
    validUntil: futureDate,
    stripeCustomerId: null,
    cancelAtPeriodEnd: false
  },
  progress: {
    completedTutorials: [],
    totalTimeSpent: 0,
    lastActive: now
  },
  preferences: {
    emailNotifications: true,
    theme: 'light',
    difficulty: 'advanced',
    language: 'en'
  },
  role: 'admin', // Special admin role
  createdAt: now,
  updatedAt: now
}
