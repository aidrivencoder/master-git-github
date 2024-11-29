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
    steps: [
      {
        id: 'create-branch',
        title: 'Creating a Branch',
        content: `
# Working with Git Branches

Branches allow you to develop features, fix bugs, and experiment safely without affecting the main codebase.

## Creating a New Branch

To create a new branch:

\`\`\`bash
git branch feature-name    # Create a branch
git checkout feature-name  # Switch to the branch

# Or use the shorthand command:
git checkout -b feature-name
\`\`\`

This creates a new branch and switches to it immediately.
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
      },
      {
        id: 'switch-merge',
        title: 'Switching and Merging Branches',
        content: `
# Managing Multiple Branches

Learn how to switch between branches and merge changes.

## Common Branch Commands

\`\`\`bash
git branch              # List all branches
git checkout main      # Switch to main branch
git merge feature-name # Merge a branch into current branch
\`\`\`

Remember to commit your changes before switching branches!
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
            },
            {
              id: 'merge',
              type: 'commit',
              label: 'Merge commit',
              position: { x: 400, y: 100 }
            }
          ],
          edges: [
            {
              source: 'main',
              target: 'feature',
              type: 'branch'
            },
            {
              source: 'feature',
              target: 'merge',
              type: 'merge'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              text: 'Which command creates and switches to a new branch?',
              options: [
                'git branch new-feature',
                'git checkout -b new-feature',
                'git merge new-feature',
                'git switch new-feature'
              ],
              correctAnswer: 1
            }
          ],
          passingScore: 1
        }
      }
    ]
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
