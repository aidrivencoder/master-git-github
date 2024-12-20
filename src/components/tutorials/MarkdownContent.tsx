import ReactMarkdown from 'react-markdown'
import AIAssistant from './AIAssistant'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Replace AIAssistant tags with a custom marker that won't be escaped
  const processedContent = content.replace(
    /<AIAssistant type="(.*?)">/g,
    ':::ai-assistant[$1]:::'
  );

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
      <ReactMarkdown
        components={{
          p: ({ children }) => {
            // Check if this paragraph contains our custom AI assistant marker
            if (typeof children === 'string' && children.startsWith(':::ai-assistant[')) {
              const type = children.match(/\[(.*?)\]/)?.[1];
              if (type) {
                return <AIAssistant type={type as 'commit-message' | 'explain-command' | 'review-code'} />;
              }
            }
            return <p className="mb-4 text-gray-800 dark:text-gray-200">{children}</p>;
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-800 dark:text-gray-200">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-800 dark:text-gray-200">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">{children}</li>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-white">
              {children}
            </pre>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
