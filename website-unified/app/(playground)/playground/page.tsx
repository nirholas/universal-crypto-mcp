'use client'

import React, { useState } from 'react'
import { CodeEditor } from './components/code-editor'
import { OutputPanel } from './components/output-panel'
import { ToolSelector } from './components/tool-selector'
import { ChainSelector } from './components/chain-selector'
import { ExampleTemplates } from './components/example-templates'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw, Share2 } from 'lucide-react'

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [chain, setChain] = useState('base')
  
  const executeCode = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/playground/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, chain }),
      })
      const result = await response.json()
      setOutput(result)
    } catch (error: any) {
      setOutput({ error: error.message })
    } finally {
      setLoading(false)
    }
  }
  
  const sharePlayground = async () => {
    try {
      // Create a simple share mechanism using URL hash
      const encoded = btoa(code)
      const url = `${window.location.origin}/playground#${encoded}`
      await navigator.clipboard.writeText(url)
      // TODO: Show toast notification
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display-sm font-bold mb-4">
            API Playground
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Test blockchain tools in real-time. No wallet required for read operations.
          </p>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <ChainSelector value={chain} onChange={setChain} />
            <ToolSelector onSelect={(tool) => setCode(tool.template)} />
            <ExampleTemplates onSelect={(template) => setCode(template)} />
            
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCode(DEFAULT_CODE)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={sharePlayground}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={executeCode}
                disabled={loading}
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Editor & Output */}
        <div className="grid lg:grid-cols-2 gap-6">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
          />
          <OutputPanel
            output={output}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

const DEFAULT_CODE = `// Check ETH balance across multiple chains
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

const chains = ["ethereum", "base", "arbitrum", "polygon"];

for (const chain of chains) {
  const balance = await getBalance(address, chain);
  console.log(\`\${chain}: \${balance} ETH\`);
}

// Get current ETH price
const price = await getTokenPrice("ETH", "USD");
console.log(\`ETH Price: $\${price}\`);
`
