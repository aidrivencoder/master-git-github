import { Timestamp } from 'firebase-admin/firestore'

export const sampleUser = {
  id: 'sample-user-1',
  email: 'demo@example.com',
  displayName: 'Demo User',
  githubIntegration: {
    connected: false
  },
  subscription: {
    tier: 'free'
  },
  progress: {
    completedTutorials: [],
    totalTimeSpent: 0,
    lastActive: new Date()
  },
  preferences: {
    emailNotifications: true,
    theme: 'light',
    difficulty: 'beginner',
    language: 'en'
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

export const sampleTutorial = {
  id: 'git-basics-101',
  title: 'Git Basics: Getting Started',
  description: 'Learn the fundamental concepts of Git version control',
  difficulty: 'beginner',
  isPremium: false,
  prerequisites: [],
  estimatedTime: 30,
  tags: ['git', 'basics', 'beginner'],
  steps: [
    {
      id: 'step-1',
      title: 'What is Git?',
      content: 'Git is a distributed version control system...',
      type: 'text',
      estimatedTime: 5
    }
  ],
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const sampleProgress = {
  userId: 'sample-user-1',
  tutorialId: 'git-basics-101',
  completedSteps: [],
  quizScores: {},
  timeSpent: 0,
  startedAt: new Date(),
  lastAccessed: new Date(),
  completed: false,
  metrics: {
    averageQuizScore: 0,
    totalAttempts: 0,
    successRate: 0
  }
}

export const sampleSubscription = {
  userId: 'sample-user-1',
  stripeCustomerId: 'cus_sample123',
  status: 'active',
  plan: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    interval: 'month',
    features: ['Access to basic tutorials']
  },
  currentPeriod: {
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  cancelAtPeriodEnd: false,
  paymentHistory: [],
  usage: {
    premiumTutorialsAccessed: 0,
    totalTimeSpent: 0,
    lastUsed: new Date()
  }
}