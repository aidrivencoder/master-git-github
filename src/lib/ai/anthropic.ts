import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIAssistanceRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export async function getAIAssistance({ 
  prompt, 
  maxTokens = 1000, 
  temperature = 0.7 
}: AIAssistanceRequest): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens,
      temperature: temperature,
      messages: [{ 
        role: 'user', 
        content: prompt 
      }]
    });

    // Handle different content block types
    const content = message.content[0];
    if ('type' in content && content.type === 'text') {
      return content.text;
    }
    
    throw new Error('Unexpected response format from Claude API');
  } catch (error) {
    console.error('AI assistance error:', error);
    throw new Error('Failed to get AI assistance');
  }
}

export async function generateCommitMessage(changes: string): Promise<string> {
  const prompt = `
    As a Git commit message expert, please help me write a clear and concise commit message for these changes:
    
    ${changes}
    
    Follow these commit message best practices:
    - Start with a short summary line (50 chars or less)
    - Use the imperative mood ("Add feature" not "Added feature")
    - Explain what and why, not how
    - Keep it clear and concise
  `;

  return getAIAssistance({ prompt, maxTokens: 200 });
}

export async function explainGitCommand(command: string): Promise<string> {
  const prompt = `
    Please explain this Git command in detail:
    
    ${command}
    
    Include:
    - What the command does
    - When to use it
    - Common use cases
    - Potential risks or warnings
    - Any relevant examples
  `;

  return getAIAssistance({ prompt });
}

export async function reviewCode(diff: string): Promise<string> {
  const prompt = `
    As a code reviewer, please analyze this Git diff and provide feedback:
    
    ${diff}
    
    Consider:
    - Potential bugs or issues
    - Security concerns
    - Performance implications
    - Code style and best practices
    - Suggestions for improvement
  `;

  return getAIAssistance({ prompt });
}
