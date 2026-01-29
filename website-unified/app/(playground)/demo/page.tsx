'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const demos = [
  {
    id: 'portfolio',
    title: 'Multi-Chain Portfolio',
    description: 'See token balances across all chains in real-time',
    action: 'Check Portfolio',
  },
  {
    id: 'swap-quote',
    title: 'Best Swap Price',
    description: 'Compare DEX prices for best execution',
    action: 'Get Quote',
  },
  {
    id: 'nft-gallery',
    title: 'NFT Gallery',
    description: 'View NFTs from any wallet across multiple chains',
    action: 'View NFTs',
  },
  {
    id: 'defi-apy',
    title: 'DeFi APY Finder',
    description: 'Find highest yield opportunities across protocols',
    action: 'Find Yield',
  },
]

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})
  
  const runDemo = async (demoId: string) => {
    setActiveDemo(demoId)
    
    try {
      const response = await fetch(`/api/demo/${demoId}`)
      const data = await response.json()
      
      setResults(prev => ({
        ...prev,
        [demoId]: data,
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [demoId]: { error: 'Failed to load demo' },
      }))
    } finally {
      setActiveDemo(null)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-display-sm font-bold mb-4">Live Demos</h1>
        <p className="text-xl text-gray-600 mb-12">
          See Universal Crypto MCP in action with real blockchain data
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {demos.map((demo) => (
            <Card key={demo.id}>
              <CardHeader>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runDemo(demo.id)}
                  disabled={activeDemo === demo.id}
                  className="w-full"
                >
                  {activeDemo === demo.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    demo.action
                  )}
                </Button>
                
                {results[demo.id] && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {results[demo.id].error ? (
                      <p className="text-red-600 text-sm">{results[demo.id].error}</p>
                    ) : (
                      <pre className="text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        {JSON.stringify(results[demo.id], null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
