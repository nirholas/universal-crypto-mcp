'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, TrendingUp, Shield, Zap, Brain, Activity } from 'lucide-react'

const useCases = [
  {
    icon: Bot,
    title: 'AI Trading Assistants',
    description: 'Build AI agents that execute trades, monitor portfolios, and provide market insights',
    examples: [
      'Automated trading strategies',
      'Portfolio rebalancing',
      'Risk management alerts',
      'Market sentiment analysis',
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'DeFi Analytics',
    description: 'Analyze DeFi protocols, track yields, and optimize strategies across chains',
    examples: [
      'Yield aggregation',
      'Liquidity pool analysis',
      'Protocol comparison',
      'APY tracking',
    ],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Wallet Management',
    description: 'Create intelligent wallet assistants that help users manage their assets',
    examples: [
      'Multi-chain balance tracking',
      'Transaction history',
      'Gas optimization',
      'Security monitoring',
    ],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Payment Automation',
    description: 'Automate payments, subscriptions, and treasury operations',
    examples: [
      'Recurring payments',
      'Multi-sig operations',
      'Treasury management',
      'Invoice generation',
    ],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Brain,
    title: 'Research & Analysis',
    description: 'Gather blockchain data for research, reporting, and decision making',
    examples: [
      'On-chain analytics',
      'Token research',
      'Whale tracking',
      'Network statistics',
    ],
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Activity,
    title: 'Monitoring & Alerts',
    description: 'Set up intelligent monitoring systems for blockchain events',
    examples: [
      'Price alerts',
      'Transaction monitoring',
      'Smart contract events',
      'Liquidation tracking',
    ],
    gradient: 'from-pink-500 to-rose-500',
  },
]

export function UseCases() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Use Cases
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Build Anything. Deploy Everywhere.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From trading bots to analytics dashboards, our MCP server powers 
            the next generation of blockchain applications.
          </p>
        </div>
        
        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  
                  {/* Examples */}
                  <div className="space-y-2">
                    {useCase.examples.map((example) => (
                      <div key={example} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {example}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
