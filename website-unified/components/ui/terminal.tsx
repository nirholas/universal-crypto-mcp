'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TerminalLine = {
  type: 'input' | 'output' | 'success' | 'error'
  content: string
  delay: number
}

interface TerminalProps {
  lines: TerminalLine[]
}

export function Terminal({ lines }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  
  useEffect(() => {
    setVisibleLines(0)
    let currentDelay = 0
    
    lines.forEach((line, index) => {
      currentDelay += line.delay
      const timer = setTimeout(() => {
        setVisibleLines(index + 1)
      }, currentDelay)
      
      return () => clearTimeout(timer)
    })
  }, [lines])
  
  return (
    <div className="rounded-2xl border-2 border-gray-900 bg-gray-950 shadow-2xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 text-center text-sm text-gray-500 font-mono">
          terminal
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-6 font-mono text-sm min-h-[400px]">
        <AnimatePresence>
          {lines.slice(0, visibleLines).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              {line.type === 'input' && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">{line.content}</span>
                </div>
              )}
              {line.type === 'output' && (
                <div className="text-gray-400 ml-4">{line.content}</div>
              )}
              {line.type === 'success' && (
                <div className="text-green-400 ml-4">{line.content}</div>
              )}
              {line.type === 'error' && (
                <div className="text-red-400 ml-4">{line.content}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Cursor */}
        {visibleLines === lines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-green-400 ml-1"
          />
        )}
      </div>
    </div>
  )
}
