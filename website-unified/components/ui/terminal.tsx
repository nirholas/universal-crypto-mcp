'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TerminalProps {
  lines: Array<{
    type: 'input' | 'output' | 'success' | 'error'
    content: string
    delay?: number
  }>
  className?: string
}

export function Terminal({ lines, className }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  
  useEffect(() => {
    if (visibleLines >= lines.length) return
    
    const delay = lines[visibleLines]?.delay || 500
    const timer = setTimeout(() => {
      setVisibleLines(v => v + 1)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [visibleLines, lines])
  
  return (
    <div className={cn('rounded-2xl bg-black overflow-hidden shadow-2xl', className)}>
      <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="p-6 font-mono text-sm">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={cn(
              'mb-2 animate-fade-in',
              line.type === 'input' && 'text-white',
              line.type === 'output' && 'text-gray-400',
              line.type === 'success' && 'text-green-400',
              line.type === 'error' && 'text-red-400'
            )}
          >
            {line.type === 'input' && <span className="text-green-400">$ </span>}
            {line.content}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-white animate-pulse" />
        )}
      </div>
    </div>
  )
}

