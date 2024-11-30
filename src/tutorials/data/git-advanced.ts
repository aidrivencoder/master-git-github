import { Tutorial } from '../../types/tutorial'

export const gitAdvancedTutorial: Tutorial = {
  id: 'git-advanced',
  title: 'Advanced Git Operations',
  description: 'Master advanced Git commands and workflows with hands-on practice.',
  difficulty: 'advanced',
  estimatedTime: 45,
  isPremium: true,
  prerequisites: ['git-basics', 'git-branching'],
  steps: [
    {
      id: 'interactive-rebase',
      title: 'Interactive Rebase',
      type: 'interactive',
      content: `
# Interactive Rebase: Rewriting History

Interactive rebase is a powerful tool that allows you to modify your commit history. You can:
- Reorder commits
- Edit commit messages
- Combine multiple commits
- Split commits

Let's practice using interactive rebase. Type \`git rebase -i HEAD~3\` to start an interactive rebase of the last 3 commits.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'commit1',
            type: 'commit',
            label: 'Initial commit',
            position: { x: 100, y: 100 }
          },
          {
            id: 'commit2',
            type: 'commit',
            label: 'Feature commit',
            position: { x: 200, y: 100 }
          },
          {
            id: 'commit3',
            type: 'commit',
            label: 'Bug fix commit',
            position: { x: 300, y: 100 }
          }
        ],
        edges: [
          {
            source: 'commit1',
            target: 'commit2',
            type: 'commit'
          },
          {
            source: 'commit2',
            target: 'commit3',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'cherry-pick',
      title: 'Cherry Picking',
      type: 'interactive',
      content: `
# Cherry Pick: Selecting Specific Commits

Cherry picking allows you to apply specific commits from one branch to another. This is useful when you want to:
- Apply a bug fix to multiple branches
- Selectively apply features
- Port changes between branches

Try cherry picking a commit. Use \`git cherry-pick abc123\` to apply a specific commit.
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
            id: 'feature1',
            type: 'commit',
            label: 'Feature branch',
            position: { x: 100, y: 200 }
          },
          {
            id: 'cherry',
            type: 'commit',
            label: 'Cherry picked commit',
            position: { x: 200, y: 150 }
          }
        ],
        edges: [
          {
            source: 'main1',
            target: 'cherry',
            type: 'branch'
          },
          {
            source: 'feature1',
            target: 'cherry',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'git-reflog',
      title: 'Git Reflog',
      type: 'interactive',
      content: `
# Git Reflog: Your Safety Net

The reflog is a log of all reference updates in your repository. It's like a super history that can help you:
- Recover deleted commits
- Fix bad rebases
- Find lost work

Let's explore the reflog. Type \`git reflog\` to see the reference history.
      `,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'head1',
            type: 'commit',
            label: 'HEAD@{0}',
            position: { x: 300, y: 100 }
          },
          {
            id: 'head2',
            type: 'commit',
            label: 'HEAD@{1}',
            position: { x: 200, y: 100 }
          },
          {
            id: 'head3',
            type: 'commit',
            label: 'HEAD@{2}',
            position: { x: 100, y: 100 }
          }
        ],
        edges: [
          {
            source: 'head2',
            target: 'head1',
            type: 'commit'
          },
          {
            source: 'head3',
            target: 'head2',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'advanced-quiz',
      title: 'Test Your Advanced Knowledge',
      type: 'text',
      content: 'Let\'s verify your understanding of these advanced Git concepts!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'What command starts an interactive rebase?',
            options: [
              'git rebase --interactive',
              'git rebase -i HEAD~3',
              'git interactive-rebase',
              'git rebase --start'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'What is the purpose of git cherry-pick?',
            options: [
              'To delete commits',
              'To merge branches',
              'To apply specific commits from one branch to another',
              'To create new branches'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3',
            text: 'What can you recover using git reflog?',
            options: [
              'Only merged commits',
              'Only committed files',
              'Lost commits and reset changes',
              'Only staged changes'
            ],
            correctAnswer: 2
          }
        ],
        passingScore: 2
      }
    }
  ]
}
