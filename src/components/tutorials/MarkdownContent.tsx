import dynamic from 'next/dynamic'
import '@uiw/react-markdown-preview/markdown.css'
import { CodeBlock } from './CodeBlock'

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
)

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
      <MarkdownPreview
        source={content}
        style={{
          backgroundColor: 'transparent',
          padding: 0,
        }}
        components={{
          code: ({ inline, children = '', className }: CodeComponentProps) => {
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              )
            }
            const language = className?.replace('language-', '') || 'text'
            const codeContent = Array.isArray(children) 
              ? children.join('') 
              : String(children).replace(/\n$/, '')
            return (
              <div className="my-6">
                <CodeBlock
                  code={codeContent}
                  language={language}
                />
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
      />
    </div>
  )
}
