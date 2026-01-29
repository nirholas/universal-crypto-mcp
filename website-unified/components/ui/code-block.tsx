'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className={cn('group relative rounded-xl bg-gray-950 overflow-hidden', className)}>
      {filename && (
        <div className="px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-mono">
          {filename}
        </div>
      )}
      <button
        onClick={copyCode}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="p-6 overflow-x-auto">
        <code className={cn('text-sm font-mono', `language-${language}`)}>
          {code}
        </code>
      </pre>
    </div>
  )
}

