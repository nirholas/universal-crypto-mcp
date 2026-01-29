'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface OutputPanelProps {
  output: any
  loading: boolean
}

export function OutputPanel({ output, loading }: OutputPanelProps) {
  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-brand-600" />
          <p className="text-gray-600">Executing on blockchain...</p>
        </div>
      </Card>
    )
  }
  
  if (!output) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">Run code to see results</p>
          <p className="text-sm">Press the Run button or Cmd+Enter</p>
        </div>
      </Card>
    )
  }
  
  if (output.error) {
    return (
      <Card className="h-[600px] overflow-auto p-6">
        <div className="flex items-start gap-3 mb-4">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Error</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">
              {output.error}
            </pre>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="h-[600px] overflow-auto p-6">
      <div className="flex items-start gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        <div>
          <h3 className="font-semibold mb-2">Success</h3>
          <p className="text-sm text-gray-600">
            Execution time: {output.executionTime}ms
          </p>
        </div>
      </div>
      
      {/* Console Output */}
      {output.logs && output.logs.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Console</h4>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            {output.logs.map((log: string, i: number) => (
              <div key={i} className="text-gray-300 mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Return Value */}
      {output.result !== undefined && (
        <div>
          <h4 className="font-semibold mb-2 text-sm text-gray-700">Result</h4>
          <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
            {JSON.stringify(output.result, null, 2)}
          </pre>
        </div>
      )}
      
      {/* Transaction Details */}
      {output.txHash && (
        <div className="mt-6 p-4 bg-brand-50 rounded-lg">
          <h4 className="font-semibold mb-2">Transaction</h4>
          <a
            href={getExplorerUrl(output.chain, output.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline font-mono text-sm"
          >
            {output.txHash}
          </a>
        </div>
      )}
    </Card>
  )
}

function getExplorerUrl(chain: string, txHash: string) {
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io/tx/',
    base: 'https://basescan.org/tx/',
    arbitrum: 'https://arbiscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
  }
  return `${explorers[chain] || explorers.ethereum}${txHash}`
}
