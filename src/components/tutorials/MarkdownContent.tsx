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
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MarkdownPreview
        source={content}
        components={{
          code: ({ inline, children, className }) => {
            if (inline) {
              return <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{children}</code>
            }
            const language = className?.replace('language-', '') || 'text'
            return (
              <CodeBlock
                code={String(children).replace(/\n$/, '')}
                language={language}
              />
            )
          }
        }}
      />
    </div>
  )
}