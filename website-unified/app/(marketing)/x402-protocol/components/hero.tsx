'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Github, BookOpen, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              HTTP 402 Payment Required
            </Badge>
            
            <h1 className="text-display-lg font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Payments for AI Agents
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The first protocol designed for autonomous AI payments. Agents discover, 
              negotiate, and pay for services automatically using cryptocurrency.
            </p>
            
            {/* Key Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                </div>
                <div>
                  <div className="font-semibold">Autonomous Discovery</div>
                  <div className="text-sm text-gray-600">AI agents find and evaluate services automatically</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Crypto Native</div>
                  <div className="text-sm text-gray-600">Pay with USDC, ETH, or any ERC-20 token</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-600" />
                </div>
                <div>
                  <div className="font-semibold">Zero Configuration</div>
                  <div className="text-sm text-gray-600">Works with existing APIs, no code changes</div>
                </div>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/docs/x402">
                  Read the Spec
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/nirholas/x402" target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/x402-deploy">
                  Try x402-deploy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right Column - Protocol Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* HTTP 402 Response */}
              <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-400 ml-4">HTTP Response</span>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-2">
                  <div className="text-orange-400">HTTP/1.1 402 Payment Required</div>
                  <div className="text-gray-400">Content-Type: application/json</div>
                  <div className="text-purple-400">X-Accept-Cryptocurrency: USDC, ETH</div>
                  <div className="text-purple-400">X-Payment-Address: 0x742d...</div>
                  <div className="text-purple-400">X-Price-USD: 0.001</div>
                  <div className="text-gray-600 my-4">...</div>
                  <div className="text-gray-400">{'{'}</div>
                  <div className="pl-4">
                    <div className="text-blue-400">"message"<span className="text-gray-400">:</span> <span className="text-green-400">"Payment required"</span>,</div>
                    <div className="text-blue-400">"price"<span className="text-gray-400">:</span> <span className="text-yellow-400">0.001</span>,</div>
                    <div className="text-blue-400">"currency"<span className="text-gray-400">:</span> <span className="text-green-400">"USD"</span>,</div>
                    <div className="text-blue-400">"accepted"<span className="text-gray-400">:</span> [<span className="text-green-400">"USDC"</span>, <span className="text-green-400">"ETH"</span>]</div>
                  </div>
                  <div className="text-gray-400">{'}'}</div>
                </div>
              </div>
              
              {/* AI Agent Action */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-200"
              >
                <div className="text-xs text-gray-600 mb-1">AI Agent</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="text-sm font-semibold">Paying with USDC...</div>
                </div>
              </motion.div>
              
              {/* Success */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-green-50 p-4 rounded-xl shadow-xl border border-green-200"
              >
                <div className="text-xs text-green-600 mb-1">Transaction</div>
                <div className="text-lg font-bold text-green-600">✓ Confirmed</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
