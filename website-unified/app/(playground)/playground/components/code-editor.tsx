'use client'

import React, { useRef, useEffect } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    
    // Add custom snippets
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      MCP_TYPE_DEFINITIONS,
      'ts:mcp.d.ts'
    )
    
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
    })
  }
  
  return (
    <div className="h-[600px] rounded-xl overflow-hidden border-2 border-gray-200 bg-white">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      />
    </div>
  )
}

const MCP_TYPE_DEFINITIONS = `
declare function getBalance(address: string, chain: string): Promise<string>;
declare function getTokenBalance(address: string, token: string, chain: string): Promise<string>;
declare function getTokenPrice(symbol: string, currency: string): Promise<number>;
declare function swapTokens(params: {
  from: string;
  to: string;
  amount: string;
  chain: string;
}): Promise<{ txHash: string; amountOut: string }>;
declare function getGasPrice(chain: string): Promise<{ standard: string; fast: string; instant: string }>;
declare function getTransactionStatus(txHash: string, chain: string): Promise<{ status: string; confirmations: number }>;
declare function getNFTs(address: string, chain: string): Promise<Array<{ tokenId: string; contract: string; metadata: any }>>;
declare function getTokenInfo(address: string, chain: string): Promise<{ name: string; symbol: string; decimals: number; totalSupply: string }>;
declare function estimateGas(transaction: any, chain: string): Promise<string>;
declare function getBlock(blockNumber: number | string, chain: string): Promise<{ number: number; hash: string; timestamp: number; transactions: string[] }>;
`
