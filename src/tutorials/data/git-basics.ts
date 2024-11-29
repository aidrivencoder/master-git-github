import { Tutorial } from '@/types/tutorial'

export const gitBasicsTutorial: Tutorial = {
  id: 'git-basics',
  title: 'Git Basics: Your First Repository',
  description: 'Learn the fundamental concepts of Git by creating and managing your first repository.',
  difficulty: 'beginner',
  estimatedTime: 20,
  isPremium: false,
  steps: [
    {
      id: 'what-is-git',
      title: 'Understanding Git',
      type: 'text',
      content: `
# What is Git?

Git is a distributed version control system that helps you track changes in your code. Think of it as a time machine for your project that lets you:

- Track all changes to your files
- Revert to previous versions if needed
- Collaborate with others effectively
- Work on different features simultaneously

Before we start using Git commands, let's understand what a repository is. A Git repository is like a project folder that Git monitors for changes.
      `
    },
    {
      id: 'git-init',
      title: 'Creating Your First Repository',
      type: 'interactive',
      content: `
# Creating a Git Repository

To start tracking your project with Git, you first need to initialize a repository. This is done using the \`git init\` command.

Try it yourself! Type \`git init\` in the command simulator below to create your first Git repository.
      `,
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
      id: 'staging-changes',
      title: 'Staging Changes',
      type: 'interactive',
      content: `
# Understanding the Staging Area

Git uses a staging area (also called the index) to track which changes you want to commit. Think of it as a preparation area for your next commit.

The \`git add\` command moves changes to the staging area. You can:
- Add specific files: \`git add filename.txt\`
- Add all files: \`git add .\`

Try adding a file to the staging area using the command simulator.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'working',
            type: 'commit',
            label: 'Working Directory',
            position: { x: 50, y: 100 }
          },
          {
            id: 'staging',
            type: 'commit',
            label: 'Staging Area',
            position: { x: 200, y: 100 }
          }
        ],
        edges: [
          {
            source: 'working',
            target: 'staging',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'committing',
      title: 'Making Your First Commit',
      type: 'interactive',
      content: `
# Committing Changes

A commit is like taking a snapshot of your project at a specific point in time. Each commit should represent a logical change or milestone.

To create a commit, use:
\`\`\`
git commit -m "Your commit message"
\`\`\`

The commit message should briefly describe what changes you made.

Try creating your first commit in the command simulator.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'staging',
            type: 'commit',
            label: 'Staging Area',
            position: { x: 100, y: 100 }
          },
          {
            id: 'commit1',
            type: 'commit',
            label: 'First Commit',
            position: { x: 250, y: 100 }
          }
        ],
        edges: [
          {
            source: 'staging',
            target: 'commit1',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'basic-workflow-quiz',
      title: 'Test Your Knowledge',
      type: 'text',
      content: 'Let\'s test what you\'ve learned about the basic Git workflow!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'Which command initializes a new Git repository?',
            options: [
              'git start',
              'git init',
              'git begin',
              'git create'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'What command is used to stage changes?',
            options: [
              'git commit',
              'git stage',
              'git add',
              'git push'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3',
            text: 'What does the staging area do?',
            options: [
              'Permanently stores your changes',
              'Prepares changes for committing',
              'Pushes changes to GitHub',
              'Reverts changes to the last commit'
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 2
      }
    }
  ]
}
