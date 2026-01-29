'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Wallet, ArrowLeftRight, LineChart, Image, Coins, Lock } from 'lucide-react'

const categories = [
  {
    id: 'balance',
    name: 'Balance Queries',
    icon: Wallet,
    description: 'Check balances across all chains',
    tools: [
      { name: 'get_balance', chains: 20, description: 'Native token balance' },
      { name: 'get_token_balance', chains: 20, description: 'ERC-20 token balance' },
      { name: 'get_portfolio_value', chains: 20, description: 'Total portfolio worth' },
    ],
    example: `// Ask Claude:
"What's my USDC balance on Base and Arbitrum?"

// Claude uses:
await mcp.get_token_balance({
  address: "0x...",
  token: "USDC",
  chains: ["base", "arbitrum"]
})

// Response:
{
  base: "1,234.56 USDC",
  arbitrum: "2,345.67 USDC",
  total: "$3,580.23"
}`,
  },
  {
    id: 'swap',
    name: 'Token Swaps',
    icon: ArrowLeftRight,
    description: 'Trade on DEXes with best prices',
    tools: [
      { name: 'swap_tokens', chains: 15, description: 'Execute swap on Uniswap' },
      { name: 'get_swap_quote', chains: 15, description: 'Get best price quote' },
      { name: 'get_pool_info', chains: 15, description: 'Liquidity pool data' },
    ],
    example: `// Ask Claude:
"Swap 1 ETH to USDC on Base, show me the best price"

// Claude uses:
const quote = await mcp.get_swap_quote({
  from: "ETH",
  to: "USDC",
  amount: "1",
  chain: "base"
})

// Then executes:
await mcp.swap_tokens({
  from: "ETH",
  to: "USDC",
  amount: "1",
  chain: "base",
  slippage: 0.5
})`,
  },
  {
    id: 'defi',
    name: 'DeFi Protocols',
    icon: LineChart,
    description: 'Lending, borrowing, yield farming',
    tools: [
      { name: 'supply_aave', chains: 8, description: 'Supply to Aave' },
      { name: 'borrow_aave', chains: 8, description: 'Borrow from Aave' },
      { name: 'stake_tokens', chains: 12, description: 'Stake for yield' },
    ],
    example: `// Ask Claude:
"Supply 1000 USDC to Aave on Arbitrum and show me the APY"

// Claude uses:
const apy = await mcp.get_aave_apy({
  token: "USDC",
  chain: "arbitrum"
})

await mcp.supply_aave({
  token: "USDC",
  amount: "1000",
  chain: "arbitrum"
})

// Response: "Supplied 1000 USDC at 4.2% APY"`,
  },
  {
    id: 'nft',
    name: 'NFT Operations',
    icon: Image,
    description: 'Query, transfer, and analyze NFTs',
    tools: [
      { name: 'get_nfts', chains: 18, description: 'List owned NFTs' },
      { name: 'get_nft_metadata', chains: 18, description: 'NFT details' },
      { name: 'transfer_nft', chains: 18, description: 'Send NFT' },
    ],
    example: `// Ask Claude:
"Show me all NFTs in my wallet across all chains"

// Claude uses:
await mcp.get_nfts({
  address: "0x...",
  chains: ["ethereum", "base", "polygon"]
})

// Returns NFT collection with images, metadata, floor prices`,
  },
  {
    id: 'market',
    name: 'Market Data',
    icon: LineChart,
    description: 'Real-time prices and analytics',
    tools: [
      { name: 'get_token_price', chains: 'all', description: 'Current price' },
      { name: 'get_price_chart', chains: 'all', description: 'Historical data' },
      { name: 'get_market_stats', chains: 'all', description: 'Market overview' },
    ],
    example: `// Ask Claude:
"What's ETH price and show me the 7-day chart"

// Claude uses:
const price = await mcp.get_token_price({ symbol: "ETH" })
const chart = await mcp.get_price_chart({
  symbol: "ETH",
  timeframe: "7d"
})

// Returns: "$2,145.32 (+3.4%)" with sparkline chart`,
  },
]

export function ToolShowcase() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  
  const category = categories.find(c => c.id === activeCategory)!
  const Icon = category.icon
  
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-md font-bold mb-6">
            380+ tools. Infinite possibilities.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive blockchain operations accessible through natural language.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Navigation */}
          <div className="space-y-2">
            {categories.map((cat) => {
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeCategory === cat.id
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CatIcon className="w-5 h-5" />
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                  <p className={`text-sm ${
                    activeCategory === cat.id ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {cat.description}
                  </p>
                </button>
              )
            })}
          </div>
          
          {/* Category Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-black">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Tools List */}
                  <div className="space-y-3 mb-6">
                    {category.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <code className="text-sm font-mono font-semibold">
                            {tool.name}
                          </code>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                          {tool.chains} chains
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Code Example */}
                <CodeBlock
                  code={category.example}
                  language="typescript"
                  filename="example.ts"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
