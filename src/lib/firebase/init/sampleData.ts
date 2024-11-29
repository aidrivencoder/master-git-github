import { Timestamp } from 'firebase-admin/firestore'

const now = Timestamp.now()
const futureDate = Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000)

export const sampleUser = {
  id: 'sample-user-1',
  email: 'demo@example.com',
  displayName: 'Demo User',
  photoURL: null,
  githubIntegration: {
    connected: false,
    lastSynced: now
  },
  subscription: {
    tier: 'free',
    validUntil: futureDate,
    stripeCustomerId: null,
    cancelAtPeriodEnd: false
  },
  progress: {
    completedTutorials: [],
    currentTutorial: {
      id: 'git-basics-101',
      currentStep: 0,
      startedAt: now
    },
    totalTimeSpent: 0,
    lastActive: now
  },
  preferences: {
    emailNotifications: true,
    theme: 'light',
    difficulty: 'beginner',
    language: 'en'
  },
  createdAt: now,
  updatedAt: now
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
      title: 'Introduction to Git',
      content: 'Git is a distributed version control system...',
      type: 'text',
      estimatedTime: 5,
      gitVisualization: {
        type: 'commit',
        data: {
          nodes: [],
          edges: []
        }
      }
    }
  ],
  version: 1,
  createdAt: now,
  updatedAt: now
}

export const sampleProgress = {
  userId: 'sample-user-1',
  tutorialId: 'git-basics-101',
  completedSteps: [],
  quizScores: {
    'step-1': {
      score: 0,
      attempts: 0,
      lastAttempt: now
    }
  },
  timeSpent: 0,
  startedAt: now,
  lastAccessed: now,
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
    start: now,
    end: futureDate
  },
  cancelAtPeriodEnd: false,
  paymentHistory: [],
  usage: {
    premiumTutorialsAccessed: 0,
    totalTimeSpent: 0,
    lastUsed: now
  }
}