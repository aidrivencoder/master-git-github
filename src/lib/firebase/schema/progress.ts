import { Timestamp } from 'firebase/firestore';

export interface UserProgress {
  userId: string;
  tutorialId: string;
  completedSteps: string[];
  quizScores: {
    [stepId: string]: {
      score: number;
      attempts: number;
      lastAttempt: Timestamp;
    };
  };
  timeSpent: number; // in minutes
  startedAt: Timestamp;
  lastAccessed: Timestamp;
  completed: boolean;
  completedAt?: Timestamp;
  metrics: {
    averageQuizScore: number;
    totalAttempts: number;
    successRate: number;
  };
}