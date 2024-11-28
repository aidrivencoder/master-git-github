import { Timestamp } from 'firebase/firestore';

export interface FirebaseUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  githubIntegration?: {
    connected: boolean;
    username?: string;
    accessToken?: string;
    lastSynced?: Timestamp;
  };
  subscription: {
    tier: 'free' | 'premium';
    validUntil?: Timestamp;
    stripeCustomerId?: string;
    cancelAtPeriodEnd?: boolean;
  };
  progress: {
    completedTutorials: string[];
    currentTutorial?: {
      id: string;
      currentStep: number;
      startedAt: Timestamp;
    };
    totalTimeSpent: number; // in minutes
    lastActive: Timestamp;
  };
  preferences: {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    language: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}