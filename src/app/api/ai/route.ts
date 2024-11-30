import { NextResponse } from 'next/server';
import { generateCommitMessage, explainGitCommand, reviewCode } from '@/lib/ai/anthropic';

export async function POST(request: Request) {
  try {
    const { action, content } = await request.json();

    let response = '';
    
    switch (action) {
      case 'commit-message':
        response = await generateCommitMessage(content);
        break;
      case 'explain-command':
        response = await explainGitCommand(content);
        break;
      case 'review-code':
        response = await reviewCode(content);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
