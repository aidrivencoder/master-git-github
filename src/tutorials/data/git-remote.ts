import { Tutorial } from '../../types/tutorial'

export const gitRemoteTutorial: Tutorial = {
  id: 'git-remote',
  title: 'Git Remote: Collaborating with Others',
  description: 'Learn how to work with remote repositories and collaborate with other developers using Git.',
  difficulty: 'intermediate',
  estimatedTime: 30,
  isPremium: false,
  prerequisites: ['git-basics', 'git-branching'],
  steps: [
    {
      id: 'remote-intro',
      title: 'Understanding Remote Repositories',
      type: 'text',
      content: `
# Working with Remote Repositories

Remote repositories are versions of your project hosted on the internet or network. They enable:
- Collaboration with other developers
- Backup of your code
- Code sharing and open source contributions
- Deployment and continuous integration

The most common remote repository hosting services are GitHub, GitLab, and Bitbucket.`,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'local',
            type: 'commit',
            label: 'Local Repository',
            position: { x: 100, y: 100 }
          },
          {
            id: 'remote',
            type: 'commit',
            label: 'Remote Repository',
            position: { x: 300, y: 100 }
          }
        ],
        edges: [
          {
            source: 'local',
            target: 'remote',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'adding-remote',
      title: 'Adding a Remote Repository',
      type: 'interactive',
      content: `
# Connecting to a Remote

To add a remote repository to your local project:
\`\`\`
git remote add origin https://github.com/username/repository.git
\`\`\`

'origin' is the conventional name for your primary remote repository.

You can list your remotes with:
\`\`\`
git remote -v
\`\`\`

Try adding a remote in the command simulator.`,
      gitVisualization: {
        type: 'commit',
        nodes: [
          {
            id: 'local1',
            type: 'commit',
            label: 'Local',
            position: { x: 100, y: 100 }
          },
          {
            id: 'origin',
            type: 'commit',
            label: 'Origin',
            position: { x: 300, y: 100 }
          }
        ],
        edges: [
          {
            source: 'local1',
            target: 'origin',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'pushing-pulling',
      title: 'Pushing and Pulling Changes',
      type: 'interactive',
      content: `
# Sharing Your Changes

To push your local changes to the remote:
\`\`\`
git push origin branch-name
\`\`\`

To get changes from the remote:
\`\`\`
git pull origin branch-name
\`\`\`

For first-time push of a branch:
\`\`\`
git push -u origin branch-name
\`\`\`

The -u flag sets up tracking, letting you use \`git push\` and \`git pull\` without arguments in the future.`,
      gitVisualization: {
        type: 'merge',
        nodes: [
          {
            id: 'local2',
            type: 'commit',
            label: 'Local',
            position: { x: 100, y: 100 }
          },
          {
            id: 'remote2',
            type: 'commit',
            label: 'Remote',
            position: { x: 300, y: 100 }
          },
          {
            id: 'sync',
            type: 'commit',
            label: 'Synchronized',
            position: { x: 200, y: 50 }
          }
        ],
        edges: [
          {
            source: 'local2',
            target: 'sync',
            type: 'commit'
          },
          {
            source: 'remote2',
            target: 'sync',
            type: 'commit'
          }
        ]
      }
    },
    {
      id: 'handling-conflicts',
      title: 'Handling Merge Conflicts',
      type: 'text',
      content: `
# Resolving Merge Conflicts

Merge conflicts occur when:
- Different developers modify the same lines of code
- Changes are made both locally and remotely to the same file
- Git can't automatically determine which changes to keep

To resolve conflicts:
1. Git will mark the conflicting areas in your files
2. Manually edit the files to resolve conflicts
3. Remove the conflict markers
4. Add and commit the resolved files

Example of conflict markers:
\`\`\`
<<<<<<< HEAD
Your local changes
=======
Remote changes
>>>>>>> branch-name
\`\`\`

Choose which changes to keep or combine them, then remove the markers.`,
      gitVisualization: {
        type: 'merge',
        nodes: [
          {
            id: 'main',
            type: 'commit',
            label: 'Main Branch',
            position: { x: 100, y: 100 }
          },
          {
            id: 'feature',
            type: 'commit',
            label: 'Feature Branch',
            position: { x: 300, y: 100 }
          },
          {
            id: 'conflict',
            type: 'tag',
            label: 'Conflict',
            position: { x: 200, y: 50 }
          }
        ],
        edges: [
          {
            source: 'main',
            target: 'conflict',
            type: 'branch'
          },
          {
            source: 'feature',
            target: 'conflict',
            type: 'branch'
          }
        ]
      }
    },
    {
      id: 'remote-quiz',
      title: 'Test Your Remote Repository Knowledge',
      type: 'text',
      content: 'Let\'s test what you\'ve learned about working with remote repositories!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'What command adds a new remote repository?',
            options: [
              'git add remote',
              'git remote add origin [URL]',
              'git push origin',
              'git remote new'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'Which command fetches and merges changes from a remote branch?',
            options: [
              'git fetch',
              'git merge',
              'git pull',
              'git sync'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3',
            text: 'What does the -u flag do in git push -u origin main?',
            options: [
              'Updates the remote repository',
              'Sets up tracking for the branch',
              'Uploads all branches',
              'Undoes the last push'
            ],
            correctAnswer: 1
          }
        ],
        passingScore: 2
      }
    }
  ]
}
