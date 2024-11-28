import { Timestamp } from 'firebase/firestore';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  prerequisites: string[]; // Array of tutorial IDs
  estimatedTime: number; // in minutes
  tags: string[];
  steps: TutorialStep[];
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  gitVisualization?: {
    type: 'commit' | 'branch' | 'merge';
    data: Record<string, unknown>;
  };
  quiz?: {
    questions: {
      id: string;
      text: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
  estimatedTime: number; // in minutes
}