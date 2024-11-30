import { Tutorial } from '../../types/tutorial'

export const gitAIAssistanceTutorial: Tutorial = {
  id: 'git-ai-assistance',
  title: 'AI-Powered Git: Leveraging Claude 3.5 Haiku',
  description: 'Learn how to enhance your Git workflow with AI assistance using Anthropic\'s Claude 3.5 Haiku model.',
  difficulty: 'intermediate',
  estimatedTime: 25,
  isPremium: true,
  prerequisites: ['git-basics'],
  steps: [
    {
      id: 'intro-ai-assistance',
      title: 'Introduction to AI-Assisted Git',
      type: 'text',
      content: `
# Enhancing Git with AI Assistance

AI models like Claude 3.5 Haiku can significantly improve your Git workflow by helping you:

- Generate meaningful commit messages
- Explain complex Git commands
- Debug Git-related issues
- Review code changes effectively
- Suggest best practices for repository management

In this tutorial, we'll explore how to leverage AI assistance to become more productive with Git. You'll interact with Claude directly through our integrated AI assistant to get real-time help with your Git workflows.
`
    },
    {
      id: 'commit-messages',
      title: 'Writing Better Commit Messages',
      type: 'interactive',
      content: `
# AI-Powered Commit Messages

Good commit messages are crucial for maintaining a clear project history. Let's use Claude to help write more descriptive and meaningful commit messages by analyzing your changes.

Try it yourself! Paste your changes below and Claude will help you craft a clear, concise commit message following best practices.

:::ai-assistant[commit-message]:::

Example changes you can try:
\`\`\`
- Added email validation to signup form
- Fixed password reset link in forgot password email
- Updated error messages to be more user-friendly
- Refactored authentication middleware for better error handling
\`\`\`

The AI will analyze your changes and generate a commit message that:
- Starts with a clear summary line
- Uses the imperative mood
- Explains the what and why
- Follows Git commit message best practices
`
    },
    {
      id: 'git-explanations',
      title: 'Understanding Complex Git Commands',
      type: 'interactive',
      content: `
# Getting AI Explanations for Git Commands

When encountering complex Git scenarios, Claude can help explain commands and their implications. Try it out with any Git command you'd like to understand better.

:::ai-assistant[explain-command]:::

Try these examples:
\`\`\`
git rebase -i HEAD~3
git cherry-pick --no-commit origin/feature
git reflog expire --expire=now --all
\`\`\`

Claude will provide:
- A clear explanation of what the command does
- Common use cases and scenarios
- Potential risks and precautions
- Related commands you might find useful
`
    },
    {
      id: 'code-review',
      title: 'AI-Assisted Code Review',
      type: 'interactive',
      content: `
# Leveraging AI for Code Review

Let's use Claude to help review code changes before committing. The AI can provide insights about potential issues, improvements, and best practices.

:::ai-assistant[review-code]:::

To get a code review:
1. Run \`git diff\` to see your changes
2. Copy the diff output into the AI assistant
3. Claude will analyze the changes and provide feedback

Example diff to try:
\`\`\`diff
diff --git a/src/auth.js b/src/auth.js
index 1234567..89abcdef 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -15,7 +15,7 @@ async function validateUser(req) {
-  const user = await db.findUser(userId);
+  const user = await db.findUser(userId).catch(() => null);
   
   if (!user) {
-    throw new Error('User not found');
+    return { error: 'Invalid credentials' };
   }
  
  return user;
}
\`\`\`

The AI will review:
- Security implications
- Error handling
- Code style and best practices
- Potential bugs or issues
- Suggestions for improvement
`
    },
    {
      id: 'ai-assistance-quiz',
      title: 'Test Your Knowledge',
      type: 'text',
      content: 'Let\'s verify your understanding of AI-assisted Git workflows!',
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'What type of information should you provide to get the best commit message suggestions?',
            options: [
              'Only the file names that changed',
              'A detailed list of changes and their purpose',
              'The entire project history',
              'Just the branch name'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            text: 'When asking Claude to explain a Git command, what should you include?',
            options: [
              'Only the command itself',
              'The command and your experience level',
              'Your entire Git configuration',
              'The command and your specific use case'
            ],
            correctAnswer: 3
          },
          {
            id: 'q3',
            text: 'How should you use AI suggestions in code review?',
            options: [
              'Accept all suggestions automatically',
              'Ignore them if they\'re too complex',
              'Verify them against project requirements',
              'Only use them for formatting issues'
            ],
            correctAnswer: 2
          }
        ],
        passingScore: 2
      }
    }
  ]
}
