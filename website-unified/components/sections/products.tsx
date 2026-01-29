'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Server, Zap, Rocket, ArrowRight } from 'lucide-react'

const products = [
  {
    icon: Server,
    name: 'MCP Server',
    tagline: 'Blockchain tools for AI',
    description: '380+ tools across 20+ chains. Check balances, swap tokens, interact with DeFi, analyze NFTs. Works with Claude, ChatGPT, and any MCP client.',
    features: [
      'Multi-chain queries (Ethereum, Base, Arbitrum, Polygon...)',
      'DeFi protocols (Uniswap, Aave, Compound, Curve...)',
      'Real-time market data and analytics',
      'NFT metadata and ownership tracking',
    ],
    cta: 'Explore Tools',
    href: '/mcp-server',
    color: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: Zap,
    name: 'x402 Protocol',
    tagline: 'AI agent payments',
    description: 'HTTP 402 Payment Required for the AI era. Autonomous payments with crypto. AI agents discover, negotiate, and pay for services automatically.',
    features: [
      'HTTP 402-based payment protocol',
      'On-chain verification (Base, Arbitrum, Polygon)',
      'Service discovery network for AI agents',
      'Automatic escrow and settlement',
    ],
    cta: 'Learn Protocol',
    href: '/x402-protocol',
    color: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: Rocket,
    name: 'x402-deploy',
    tagline: 'Monetize any API',
    description: 'Turn any API into a paid service in one command. No code changes. Deploy to Railway, Fly.io, Vercel, or Docker. Start earning in 5 minutes.',
    features: [
      'One-command deployment to 8+ platforms',
      'Automatic payment gateway integration',
      'Real-time analytics dashboard',
      'Auto-listing on x402scan marketplace',
    ],
    cta: 'Start Deploying',
    href: '/x402-deploy',
    color: 'from-green-500/10 to-emerald-500/10',
  },
]

export function Products() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display-md font-bold mb-6"
          >
            Three products. One ecosystem.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to build, deploy, and monetize AI-powered blockchain applications.
          </motion.p>
        </div>
        
        {/* Product Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="text-base">
                      {product.tagline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href={product.href}>
                        {product.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
