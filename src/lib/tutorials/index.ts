import { gitBasicsTutorial } from './git-basics'

export const tutorialsList = [
  gitBasicsTutorial,
  {
    id: 'branching-basics',
    title: 'Git Branching',
    description: 'Learn how to work with branches in Git',
    difficulty: 'intermediate',
    estimatedTime: 45,
    isPremium: false,
    steps: []
  },
  {
    id: 'github-workflow',
    title: 'GitHub Workflow',
    description: 'Master the GitHub Flow and collaboration basics',
    difficulty: 'beginner',
    estimatedTime: 60,
    isPremium: true,
    steps: []
  }
]