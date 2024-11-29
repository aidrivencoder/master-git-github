import { Tutorial } from '@/types/tutorial'

export const gitBranchingTutorial: Tutorial = {
  id: 'git-branching',
  title: 'Git Branching: Working with Features',
  description: 'Master Git branches to work on multiple features simultaneously and manage your codebase effectively.',
  difficulty: 'intermediate',
  estimatedTime: 25,
  isPremium: false,
  prerequisites: ['git-basics'],
  steps: [
    {
      id: 'what-are-branches',
      title: 'Understanding Branches',
      type: 'text',
      content: `
# Git Branches: Your Parallel Universes

Branches in Git are like parallel universes for your code. They allow you to:
- Work on new features without affecting the main code
- Experiment with changes safely
- Collaborate with others without conflicts
- Maintain multiple versions of your project

The main branch (often called \`main\` or \`master\`) contains your primary, stable code.
      `,
      gitVisualization: {
        type: 'branch',
        nodes: [
          {
            id: 'main1',
            type: 'commit',
            label: 'Main branch',
            position: { x: 100, y: 100 }
          },
          {
            id: 'feature',
            type: 'branch',
            label: 'Feature branch',
            position: { x: 200, y: 50 }
          }
        ],
        edges: [
          {
            source: 'main1',
            target: 'feature',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'creating-branch',
      title: 'Creating a New Branch',
      type: 'interactive',
      content: `
# Creating Your First Branch

To create a new branch, use:
\`\`\`
git branch branch-name
\`\`\`

To create and switch to the new branch in one command:
\`\`\`
git checkout -b branch-name
\`\`\`

Try creating a new branch called "feature" in the command simulator.
      `,
      gitVisualization: {
        type: 'branch',
        nodes: [
          {
            id: 'main2',
            type: 'commit',
            label: 'Main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'feature1',
            type: 'commit',
            label: 'Feature',
            position: { x: 200, y: 50 }
          }
        ],
        edges: [
          {
            source: 'main2',
            target: 'feature1',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'switching-branches',
      title: 'Switching Between Branches',
      type: 'interactive',
      content: `
# Moving Between Branches

To switch between branches, use:
\`\`\`
git checkout branch-name
\`\`\`

Or with newer Git versions:
\`\`\`
git switch branch-name
\`\`\`

This moves your working directory to the selected branch.

Try switching to your new feature branch in the command simulator.
      `,
      gitVisualization: {
        type: 'branch',
        nodes: [
          {
            id: 'main3',
            type: 'commit',
            label: 'Main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'feature2',
            type: 'commit',
            label: 'Feature',
            position: { x: 200, y: 50 }
          },
          {
            id: 'head',
            type: 'tag',
            label: 'HEAD',
            position: { x: 200, y: 25 }
          }
        ],
        edges: [
          {
            source: 'main3',
            target: 'feature2',
            type: 'branch'
          },
          {
            source: 'head',
            target: 'feature2',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'merging-branches',
      title: 'Merging Changes',
      type: 'interactive',
      content: `
# Bringing Changes Together

When your feature is complete, you'll want to merge it back into the main branch:

1. First, switch to the target branch (usually main):
   \`git checkout main\`

2. Then merge your feature branch:
   \`git merge feature\`

Try merging your feature branch into main in the command simulator.
      `,
      gitVisualization: {
        type: 'merge',
        nodes: [
          {
            id: 'main4',
            type: 'commit',
            label: 'Main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'feature3',
            type: 'commit',
            label: 'Feature',
            position: { x: 200, y: 50 }
          },
          {
            id: 'merge1',
            type: 'commit',
            label: 'Merge',
            position: { x: 300, y: 100 }
          }
        ],
        edges: [
          {
            source: 'main4',
            target: 'feature3',
            type: 'branch'
          },
          {
            source: 'feature3',
            target: 'merge1',
            type: 'commit'
          },
          {
            source: 'main4',
            target: 'merge1',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'branching-quiz',
      title: 'Test Your Branching Knowledge',
      type: 'text',
      content: 'Let\'s verify your understanding of Git branching!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'Which command creates and switches to a new branch?',
            options: [
              'git branch new-branch',
              'git checkout -b new-branch',
              'git switch new-branch',
              'git create new-branch'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'What should you do before merging a feature branch?',
            options: [
              'Delete the feature branch',
              'Create a new branch',
              'Switch to the target branch',
              'Push the changes'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3',
            text: 'What is the purpose of branching?',
            options: [
              'To permanently separate code',
              'To work on features in isolation',
              'To delete old code',
              'To push to GitHub'
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 2
      }
    }
  ]
}
