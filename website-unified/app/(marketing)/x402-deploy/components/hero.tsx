'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, DollarSign, Clock } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6" variant="outline">
              <Zap className="w-3 h-3 mr-1" />
              Zero Code Changes Required
            </Badge>
            
            <h1 className="text-display-lg font-bold mb-6">
              Monetize Any API in{' '}
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                5 Minutes
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              One command turns your API into a paid service. Deploy to Railway, Fly.io, 
              Vercel, or Docker. Start earning from AI agents immediately.
            </p>
            
            {/* Value Props */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div className="text-2xl font-bold">5 min</div>
                </div>
                <div className="text-sm text-gray-600">Setup time</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold">$0</div>
                </div>
                <div className="text-sm text-gray-600">Platform fees</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div className="text-2xl font-bold">0</div>
                </div>
                <div className="text-sm text-gray-600">Code changes</div>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="#quick-start">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/nirholas/x402-deploy" target="_blank">
                  View on GitHub
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="#dashboard">
                  See Dashboard Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right Column - Terminal Demo */}
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
                <span className="text-sm text-gray-400 ml-4">Terminal</span>
              </div>
              
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-gray-400">$ npx x402-deploy</div>
                <div className="text-green-400 mt-4">
                  <div>✓ Detected Express.js API</div>
                  <div>✓ Generated payment middleware</div>
                  <div>✓ Configured USDC on Base</div>
                  <div>✓ Deployed to Railway</div>
                </div>
                <div className="text-blue-400 mt-4">
                  <div>🚀 Your API is live!</div>
                  <div className="text-gray-400">   URL: https://my-api-x402.up.railway.app</div>
                </div>
                <div className="text-purple-400 mt-4">
                  <div>💰 Payment Setup</div>
                  <div className="text-gray-400">   Address: 0x742d35Cc663...</div>
                  <div className="text-gray-400">   Chain: Base</div>
                  <div className="text-gray-400">   Price: $0.001/request</div>
                </div>
                <div className="text-yellow-400 mt-4">
                  <div>📊 Dashboard: https://dashboard.x402.dev</div>
                </div>
                <div className="text-green-400 mt-4 animate-pulse">
                  <div>⚡ Ready to accept payments!</div>
                </div>
              </div>
            </div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-200"
            >
              <div className="text-xs text-gray-600 mb-1">Deployment Time</div>
              <div className="text-2xl font-bold text-green-600">1m 23s</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
