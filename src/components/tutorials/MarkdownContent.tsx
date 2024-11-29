import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MarkdownContentProps {
  content: string
}

type CodeComponentProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ inline, className, children }: CodeComponentProps) => {
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                  {String(children)}
                </code>
              )
            }

            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            return (
              <div className="rounded-lg overflow-hidden my-4">
                <SyntaxHighlighter
                  language={language}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '0.5rem'
                  }}
                >
                  {String(children).trim()}
                </SyntaxHighlighter>
              </div>
            )
          },
          p: ({ children }) => (
            <p className="mb-4 text-gray-800 dark:text-gray-200">{children}</p>
          ),
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
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
