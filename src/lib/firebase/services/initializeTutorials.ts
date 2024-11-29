import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../config'
import { Logger } from '@/lib/utils/logger'
import { Timestamp } from 'firebase/firestore'

const TUTORIALS_COLLECTION = 'tutorials'

const tutorials = [
  {
    id: 'git-basics',
    title: 'Git Basics',
    description: 'Learn the fundamental concepts of Git version control',
    difficulty: 'beginner',
    estimatedTime: 30,
    isPremium: false,
    steps: [
      {
        id: 'init',
        title: 'Initializing a Git Repository',
        content: `# Creating Your First Git Repository

Git is a distributed version control system that helps you track changes in your code. Let's start with the basics.

## Initialize a Repository

To start tracking your project with Git, you need to initialize a repository:

\`\`\`bash
git init
\`\`\`

This command creates a new Git repository in your current directory.`,
        type: 'interactive',
        gitVisualization: {
          type: 'commit',
          nodes: [
            {
              id: 'init',
              type: 'commit',
              label: 'Initial commit',
              position: { x: 100, y: 100 }
            }
          ],
          edges: []
        }
      },
      {
        id: 'staging',
        title: 'Staging Changes',
        content: `# Understanding the Staging Area

Git uses a staging area (also called the index) to track which changes will be included in the next commit.

## Add Files to Staging

To stage files:

\`\`\`bash
git add <filename>    # Stage a specific file
git add .            # Stage all changes
\`\`\``,
        type: 'interactive',
        gitVisualization: {
          type: 'commit',
          nodes: [
            {
              id: 'working',
              type: 'branch',
              label: 'Working Directory',
              position: { x: 100, y: 100 }
            },
            {
              id: 'staging',
              type: 'branch',
              label: 'Staging Area',
              position: { x: 250, y: 100 }
            }
          ],
          edges: [
            {
              source: 'working',
              target: 'staging',
              type: 'branch'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              text: 'Which command stages all changes in the current directory?',
              options: [
                'git stage all',
                'git add .',
                'git commit',
                'git push'
              ],
              correctAnswer: 1
            }
          ],
          passingScore: 1
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
      // Process the tutorial content to ensure proper string handling
      const processedTutorial = {
        ...tutorial,
        steps: tutorial.steps.map(step => ({
          ...step,
          content: step.content.trim()
        }))
      }
      await setDoc(doc(tutorialsRef, tutorial.id), processedTutorial)
    }
    
    Logger.info('Tutorials initialized successfully', 'TutorialService')
  } catch (error) {
    Logger.error('Failed to initialize tutorials', 'TutorialService', error)
    throw error
  }
}
