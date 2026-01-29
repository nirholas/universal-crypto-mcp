'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import { Button } from './button'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
      {/* Header */}
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm text-gray-400 font-mono">{filename}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 text-gray-400 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}

      {/* Code */}
      <div className="relative">
        {!filename && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 h-7 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}

        <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 overflow-x-auto text-sm`}
              style={style}
            >
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    {showLineNumbers && (
                      <span className="table-cell pr-4 text-gray-600 select-none text-right">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
