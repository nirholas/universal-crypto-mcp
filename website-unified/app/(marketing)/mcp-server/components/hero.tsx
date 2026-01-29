'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Github, BookOpen, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6" variant="outline">
              <Zap className="w-3 h-3 mr-1" />
              380+ Tools Across 20+ Chains
            </Badge>
            
            <h1 className="text-display-lg font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
              The Most Comprehensive Blockchain MCP Server
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Give your AI agents superpowers. Access DeFi protocols, swap tokens, 
              query NFTs, and more—all through natural language with Claude, ChatGPT, 
              or any AI assistant.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                <div>
                  <div className="font-semibold">20+ Chains</div>
                  <div className="text-sm text-gray-600">EVM & Solana</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                <div>
                  <div className="font-semibold">380+ Tools</div>
                  <div className="text-sm text-gray-600">DeFi, NFTs, Swaps</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                <div>
                  <div className="font-semibold">Real-time Data</div>
                  <div className="text-sm text-gray-600">Live prices & balances</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                <div>
                  <div className="font-semibold">Free Forever</div>
                  <div className="text-sm text-gray-600">Open source MIT</div>
                </div>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/docs/quickstart">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/nirholas/universal-crypto-mcp" target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/docs">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right Column - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400 ml-4">Claude Desktop</span>
              </div>
              
              {/* Chat Interface */}
              <div className="p-6 space-y-4 min-h-[400px] font-mono text-sm">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-brand-600 text-white px-4 py-2 rounded-2xl max-w-[80%]">
                    What's my ETH balance on Base and Arbitrum?
                  </div>
                </div>
                
                {/* AI Response */}
                <div className="flex">
                  <div className="bg-gray-800 text-gray-100 px-4 py-3 rounded-2xl max-w-[90%]">
                    <div className="mb-2">I'll check your ETH balance across those chains.</div>
                    <div className="bg-gray-900 p-3 rounded-lg mt-2 text-xs">
                      <div className="text-brand-400 mb-1">// Using get_balance</div>
                      <div className="text-green-400">✓ Base: 2.45 ETH ($5,245.12)</div>
                      <div className="text-green-400">✓ Arbitrum: 1.83 ETH ($3,915.45)</div>
                      <div className="text-blue-400 mt-2">Total: 4.28 ETH ($9,160.57)</div>
                    </div>
                  </div>
                </div>
                
                {/* User Follow-up */}
                <div className="flex justify-end">
                  <div className="bg-brand-600 text-white px-4 py-2 rounded-2xl max-w-[80%]">
                    Swap 1 ETH to USDC on Base
                  </div>
                </div>
                
                {/* AI Execution */}
                <div className="flex">
                  <div className="bg-gray-800 text-gray-100 px-4 py-3 rounded-2xl max-w-[90%]">
                    <div className="mb-2">I'll execute that swap for you.</div>
                    <div className="bg-gray-900 p-3 rounded-lg mt-2 text-xs">
                      <div className="text-brand-400 mb-1">// Using swap_tokens</div>
                      <div className="text-yellow-400">⟳ Getting best quote...</div>
                      <div className="text-green-400 mt-1">✓ Quote: 1 ETH → 2,145.32 USDC</div>
                      <div className="text-green-400">✓ Swap executed on Uniswap V3</div>
                      <div className="text-gray-400 mt-2">TX: 0xabcd...ef12</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-200"
            >
              <div className="text-xs text-gray-600 mb-1">Response Time</div>
              <div className="text-2xl font-bold text-brand-600">0.8s</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-200"
            >
              <div className="text-xs text-gray-600 mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-green-600">99.9%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
