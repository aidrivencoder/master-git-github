import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="rounded-lg overflow-hidden my-4 bg-gray-900 dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-700">
        <span className="text-xs font-mono text-gray-400">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          backgroundColor: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}