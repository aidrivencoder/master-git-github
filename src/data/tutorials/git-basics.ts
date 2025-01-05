import { Tutorial } from '@/types/tutorial'

export const gitBasicsTutorial: Tutorial = {
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
      content: `
# Creating Your First Git Repository

Git is a distributed version control system that helps you track changes in your code. Let's start with the basics.

## Initialize a Repository

To start tracking your project with Git, you need to initialize a repository:

\`\`\`bash
git init
\`\`\`

This command creates a new Git repository in your current directory.
      `,
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
      content: `
# Understanding the Staging Area

Git uses a staging area (also called the index) to track which changes will be included in the next commit.
      `,
      type: 'interactive',
      gitVisualization: {
        type: 'commit',
        nodes: [],
        edges: []
      }
    }
  ]
}
