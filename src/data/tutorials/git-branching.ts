import { Tutorial } from '@/types/tutorial'

export const gitBranchingTutorial: Tutorial = {
  id: 'git-branching',
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

To create a new branch:

\`\`\`bash
git branch feature-branch
git checkout feature-branch

# Or use the shorthand:
git checkout -b feature-branch
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
            label: 'feature-branch',
            position: { x: 200, y: 150 }
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
  ]
}
