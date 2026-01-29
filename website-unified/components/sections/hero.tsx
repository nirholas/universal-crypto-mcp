'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Terminal } from '@/components/ui/terminal'
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react'

const messages = [
  {
    title: 'Blockchain tools\nfor AI agents',
    subtitle: '380+ tools across 20+ chains. Claude, ChatGPT, and any AI can now interact with DeFi.',
    icon: Sparkles,
  },
  {
    title: 'AI agents can now\npay for services',
    subtitle: 'x402 protocol enables autonomous payments. The first HTTP 402 implementation for AI.',
    icon: Zap,
  },
  {
    title: 'Monetize any API\nin 5 minutes',
    subtitle: 'One command turns your API into a paid service. Zero code changes. Enterprise-ready.',
    icon: Globe,
  },
]

export function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  
  const message = messages[currentMessage]
  const Icon = message.icon
  
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div>
            {/* Icon */}
            <motion.div
              key={`icon-${currentMessage}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block p-4 rounded-2xl bg-black"
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Title with Animation */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentMessage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-display-lg font-bold mb-6 whitespace-pre-line"
              >
                {message.title}
              </motion.h1>
            </AnimatePresence>
            
            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${currentMessage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-gray-600 mb-10 max-w-lg"
              >
                {message.subtitle}
              </motion.p>
            </AnimatePresence>
            
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="xl" asChild>
                <Link href="/docs/getting-started">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="secondary" asChild>
                <Link href="/playground">
                  Try Playground
                </Link>
              </Button>
            </motion.div>
            
            {/* Progress Dots */}
            <div className="flex gap-2 mt-8">
              {messages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentMessage(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentMessage ? 'w-8 bg-black' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Right Column - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TerminalDemo messageIndex={currentMessage} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TerminalDemo({ messageIndex }: { messageIndex: number }) {
  const demos = [
    // MCP Server Demo
    [
      { type: 'input' as const, content: 'claude "Check my ETH balance on Base"', delay: 800 },
      { type: 'output' as const, content: '🔍 Querying Base blockchain...', delay: 600 },
      { type: 'success' as const, content: '✓ Balance: 2.4587 ETH ($4,234.56)', delay: 400 },
      { type: 'output' as const, content: '💡 Tip: You can swap on Uniswap for 0.01% fees', delay: 800 },
    ],
    // x402 Protocol Demo
    [
      { type: 'input' as const, content: 'curl https://api.weather.com/premium', delay: 800 },
      { type: 'output' as const, content: '402 Payment Required', delay: 400 },
      { type: 'output' as const, content: 'Price: $0.001 USDC on Base', delay: 600 },
      { type: 'input' as const, content: 'claude "Pay and get weather data"', delay: 800 },
      { type: 'success' as const, content: '✓ Payment sent: 0x7f3a...', delay: 400 },
      { type: 'success' as const, content: '✓ Data received: 72°F, Sunny', delay: 600 },
    ],
    // x402-deploy Demo
    [
      { type: 'input' as const, content: 'x402-deploy deploy', delay: 800 },
      { type: 'output' as const, content: '🚀 Deploying to Railway...', delay: 600 },
      { type: 'output' as const, content: '💰 Creating payment wallet...', delay: 600 },
      { type: 'output' as const, content: '🔍 Registering on x402scan...', delay: 600 },
      { type: 'success' as const, content: '✓ Live at https://my-api.up.railway.app', delay: 400 },
      { type: 'success' as const, content: '✓ Earning $0.01 per request', delay: 800 },
    ],
  ]
  
  return <Terminal lines={demos[messageIndex]} />
}
