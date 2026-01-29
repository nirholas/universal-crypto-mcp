'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ChainSelectorProps {
  value: string
  onChange: (value: string) => void
}

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'base', name: 'Base', icon: '🔵' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'polygon', name: 'Polygon', icon: '💜' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺' },
  { id: 'bsc', name: 'BSC', icon: '🟡' },
]

export function ChainSelector({ value, onChange }: ChainSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select chain" />
      </SelectTrigger>
      <SelectContent>
        {CHAINS.map((chain) => (
          <SelectItem key={chain.id} value={chain.id}>
            <span className="flex items-center gap-2">
              <span>{chain.icon}</span>
              <span>{chain.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
