'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

const chains = [
  { name: 'Ethereum', logo: '⟠', color: 'from-blue-500 to-purple-500', supported: ['Mainnet', 'Sepolia'] },
  { name: 'Base', logo: '🔵', color: 'from-blue-600 to-blue-400', supported: ['Mainnet', 'Sepolia'] },
  { name: 'Arbitrum', logo: '◆', color: 'from-blue-400 to-cyan-400', supported: ['One', 'Nova'] },
  { name: 'Optimism', logo: '🔴', color: 'from-red-500 to-orange-500', supported: ['Mainnet', 'Sepolia'] },
  { name: 'Polygon', logo: '◇', color: 'from-purple-600 to-purple-400', supported: ['PoS', 'zkEVM'] },
  { name: 'Avalanche', logo: '🔺', color: 'from-red-600 to-red-400', supported: ['C-Chain'] },
  { name: 'BSC', logo: '◈', color: 'from-yellow-500 to-yellow-600', supported: ['Mainnet', 'Testnet'] },
  { name: 'Gnosis', logo: '◉', color: 'from-teal-500 to-green-500', supported: ['Chain'] },
  { name: 'Celo', logo: '●', color: 'from-yellow-400 to-green-400', supported: ['Mainnet'] },
  { name: 'Fantom', logo: '◐', color: 'from-blue-600 to-blue-500', supported: ['Opera'] },
  { name: 'Linea', logo: '▲', color: 'from-gray-800 to-gray-600', supported: ['Mainnet'] },
  { name: 'Scroll', logo: '〰️', color: 'from-orange-400 to-orange-600', supported: ['Mainnet'] },
  { name: 'zkSync', logo: '⚡', color: 'from-purple-500 to-blue-500', supported: ['Era'] },
  { name: 'Blast', logo: '💥', color: 'from-yellow-400 to-orange-500', supported: ['Mainnet'] },
  { name: 'Zora', logo: '◯', color: 'from-gray-900 to-gray-700', supported: ['Network'] },
  { name: 'Mode', logo: '▣', color: 'from-green-500 to-green-600', supported: ['Network'] },
  { name: 'Solana', logo: '◎', color: 'from-purple-500 to-green-400', supported: ['Mainnet', 'Devnet'] },
]

const features = [
  'Full RPC access',
  'Native token operations',
  'ERC-20/SPL tokens',
  'NFT support',
  'Smart contract calls',
  'Transaction history',
]

export function Chains() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Multi-Chain Support
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            20+ Chains. One Interface.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Work across all major EVM chains and Solana with a unified API. 
            No need to learn different interfaces for each chain.
          </p>
        </div>
        
        {/* Chains Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {chains.map((chain, index) => (
            <motion.div
              key={chain.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-2xl w-10 h-10 rounded-lg bg-gradient-to-br ${chain.color} flex items-center justify-center`}>
                    {chain.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold">{chain.name}</h3>
                    <p className="text-xs text-gray-600">
                      {chain.supported.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Fully Supported</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Features */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Every chain includes:
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
