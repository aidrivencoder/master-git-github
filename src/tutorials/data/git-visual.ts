import { Tutorial } from '../../types/tutorial'

export const gitVisualTutorial: Tutorial = {
  id: 'git-visual',
  title: 'Visual Git: Interactive Command Simulation',
  description: 'Learn Git concepts through interactive visualizations. Click buttons to simulate Git commands and see how they affect your repository in real-time.',
  difficulty: 'beginner',
  estimatedTime: 30,
  isPremium: true,
  steps: [
    {
      id: 'visual-intro',
      title: 'Welcome to Visual Git',
      type: 'text',
      content: `
# Visual Git Learning

Welcome to a unique way of learning Git! Instead of typing commands, you'll use interactive buttons to perform Git operations and see their effects immediately through visualizations.

This tutorial will help you understand:
- How Git tracks your changes
- How branches work and when to use them
- How merging brings changes together
- How remote repositories connect with your local work

Click the buttons below each visualization to simulate Git commands and watch how they transform your repository.
      `
    },
    {
      id: 'visual-commits',
      title: 'Making Commits Visually',
      type: 'interactive',
      content: `
# Understanding Commits Visually

Let's start by making some commits to track our changes. Each commit represents a snapshot of your project at a specific point in time.

**Available Actions:**
- Click "Add Changes" to stage your modifications
- Click "Commit Changes" to create a new commit
- Watch how the visualization updates with each action!

Try creating multiple commits to see how Git builds a history of your project.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'main',
            type: 'branch',
            label: 'main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'commit1',
            type: 'commit',
            label: 'Initial commit',
            position: { x: 200, y: 100 }
          }
        ],
        edges: [
          {
            source: 'main',
            target: 'commit1',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'visual-branching',
      title: 'Visual Branching',
      type: 'interactive',
      content: `
# Branching Made Visual

Branches allow you to work on different features or fixes without affecting your main codebase.

**Available Actions:**
- Click "Create Branch" to start a new line of development
- Click "Switch Branch" to move between branches
- Click "Add Changes" and "Commit Changes" to work on your current branch
- Watch how branches grow independently!

Try creating a feature branch and making some commits to see how parallel development works.
      `,
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
            id: 'commit1',
            type: 'commit',
            label: 'Initial commit',
            position: { x: 200, y: 100 }
          },
          {
            id: 'feature',
            type: 'branch',
            label: 'feature',
            position: { x: 200, y: 200 }
          }
        ],
        edges: [
          {
            source: 'main',
            target: 'commit1',
            type: 'branch'
          },
          {
            source: 'feature',
            target: 'commit1',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'visual-merging',
      title: 'Merging Visually',
      type: 'interactive',
      content: `
# Understanding Merges Through Visualization

When you're ready to combine work from different branches, you'll use merging.

**Available Actions:**
- Click "Switch Branch" to move to your target branch
- Click "Merge Branch" to combine changes
- Watch how commits come together in the visualization!

Try merging your feature branch back into main to see how Git combines different lines of development.
      `,
      gitVisualization: {
        type: 'merge',
        nodes: [
          {
            id: 'main',
            type: 'branch',
            label: 'main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'commit1',
            type: 'commit',
            label: 'Main commit',
            position: { x: 200, y: 100 }
          },
          {
            id: 'feature',
            type: 'branch',
            label: 'feature',
            position: { x: 200, y: 200 }
          },
          {
            id: 'commit2',
            type: 'commit',
            label: 'Feature commit',
            position: { x: 300, y: 200 }
          }
        ],
        edges: [
          {
            source: 'main',
            target: 'commit1',
            type: 'branch'
          },
          {
            source: 'feature',
            target: 'commit1',
            type: 'branch'
          },
          {
            source: 'commit2',
            target: 'commit1',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'visual-remote',
      title: 'Remote Operations Visualized',
      type: 'interactive',
      content: `
# Visualizing Remote Repository Operations

Remote repositories let you share your code and collaborate with others.

**Available Actions:**
- Click "Push Changes" to send your commits to the remote
- Click "Pull Changes" to get updates from the remote
- Watch how local and remote repositories stay in sync!

Try pushing and pulling changes to understand how Git facilitates collaboration.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'local',
            type: 'branch',
            label: 'local/main',
            position: { x: 100, y: 100 }
          },
          {
            id: 'remote',
            type: 'branch',
            label: 'origin/main',
            position: { x: 100, y: 200 }
          },
          {
            id: 'commit1',
            type: 'commit',
            label: 'Shared commit',
            position: { x: 200, y: 150 }
          }
        ],
        edges: [
          {
            source: 'local',
            target: 'commit1',
            type: 'branch'
          },
          {
            source: 'remote',
            target: 'commit1',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'visual-quiz',
      title: 'Test Your Visual Understanding',
      type: 'text',
      content: 'Let\'s test what you\'ve learned about Git operations!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'What happens when you create a new branch?',
            options: [
              'It creates a copy of all your files',
              'It creates a new pointer to the current commit',
              'It deletes the main branch',
              'It automatically pushes to remote'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'When you merge branches, what happens to the original branches?',
            options: [
              'Both branches are deleted',
              'The source branch is deleted',
              'Both branches remain intact',
              'The target branch is deleted'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3',
            text: 'What does pushing to a remote repository do?',
            options: [
              'Deletes your local repository',
              'Copies your commits to the remote repository',
              'Creates a new branch',
              'Merges all branches automatically'
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 2
      }
    }
  ]
}
