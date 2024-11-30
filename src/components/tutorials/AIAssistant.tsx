import { useState } from 'react';

interface AIAssistantProps {
  type: 'commit-message' | 'explain-command' | 'review-code';
  placeholder?: string;
}

export default function AIAssistant({ type, placeholder }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAssistance = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: type,
          content: input,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI assistance');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError('Failed to get AI assistance. Please try again.');
      console.error('AI assistance error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'commit-message':
        return 'Enter your code changes here...';
      case 'explain-command':
        return 'Enter a Git command to explain...';
      case 'review-code':
        return 'Paste your Git diff here...';
      default:
        return placeholder || 'Enter your input here...';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={getPlaceholder()}
        className="w-full h-32 p-2 border rounded"
        disabled={loading}
      />
      
      <button
        onClick={getAssistance}
        disabled={loading || !input.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Getting assistance...' : 'Get AI Assistance'}
      </button>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 border rounded bg-white">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}
