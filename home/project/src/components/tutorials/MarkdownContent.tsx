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

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none p-6">
      <MarkdownPreview
        source={content}
        wrapperElement={{
          "data-color-mode": "auto"
        }}
        components={{
          code: ({ inline, children = '', className }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              )
            }
            
            const language = className?.replace(/language-/, '') || 'text'
            const code = Array.isArray(children) ? children.join('') : children.toString()
            
            return (
              <CodeBlock
                code={code.replace(/\n$/, '')}
                language={language}
              />
            )
          }
        }}
        style={{
          backgroundColor: 'transparent',
          padding: '1.5rem'
        }}
      />
    </div>
  )
}