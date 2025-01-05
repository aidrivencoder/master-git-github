import dynamic from 'next/dynamic'
import '@uiw/react-markdown-preview/markdown.css'
import React from 'react'

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
        wrapperElement={{
          "data-color-mode": "dark"
        }}
        className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
      />
    </div>
  )
}