import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../config'
import { gitBasicsTutorial } from '@/lib/tutorials/git-basics'
import { Logger } from '@/lib/utils/logger'
import { Timestamp } from 'firebase/firestore'

const TUTORIALS_COLLECTION = 'tutorials'

const tutorials = [
  {
    ...gitBasicsTutorial,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'branching-basics',
    title: 'Git Branching',
    description: 'Learn how to work with branches in Git',
    difficulty: 'intermediate',
    estimatedTime: 45,
    isPremium: false,
    steps: [
      {
        id: 'create-branch',
        title: 'Creating a Branch',
        content: `
# Working with Git Branches

Branches allow you to develop features, fix bugs, or experiment with new ideas in isolation.

## Create a New Branch

To create and switch to a new branch:

\`\`\`bash
git checkout -b feature/new-feature
\`\`\`
        `,
        type: 'interactive',
        gitVisualization: {
          type: 'branch',
          nodes: [
            {
              id: 'main',
              type: 'branch',
              label: 'main',
              position: { x: 100, y: 100 }
            },
            {
              id: 'feature',
              type: 'branch',
              label: 'feature',
              position: { x: 250, y: 50 }
            }
          ],
          edges: [
            {
              source: 'main',
              target: 'feature',
              type: 'branch'
            }
          ]
        }
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
]

export async function initializeTutorials() {
  try {
    const tutorialsRef = collection(db, TUTORIALS_COLLECTION)
    
    for (const tutorial of tutorials) {
      await setDoc(doc(tutorialsRef, tutorial.id), tutorial)
    }
    
    Logger.info('Tutorials initialized successfully', 'TutorialService')
  } catch (error) {
    Logger.error('Failed to initialize tutorials', 'TutorialService', error)
    throw error
  }
}