'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Badge } from '@/components/ui/badge'
import { Database, Brain, Zap, Image } from 'lucide-react'

const examples = [
  {
    icon: Database,
    title: 'Premium Data APIs',
    description: 'Real-time market data, analytics, and insights',
    code: `// API returns 402
AI Agent: "I need BTC price data"

// Agent evaluates:
- Price: $0.001 per request
- Currency: USDC on Base
- Provider rating: 4.8/5

// Agent decides and pays
await wallet.pay({
  to: "0x742d...",
  amount: "0.001",
  token: "USDC",
  chain: "base"
})

// Gets data instantly
{ btc_price: 45123.45, confidence: 0.98 }`,
  },
  {
    icon: Brain,
    title: 'AI Model Inference',
    description: 'Pay per inference for specialized AI models',
    code: `// Request to premium AI model
POST /api/v1/generate-image

// 402 Response
{
  "price": 0.10,
  "currency": "USD",
  "accepted": ["USDC", "ETH"],
  "model": "stable-diffusion-xl"
}

// Agent pays $0.10 USDC
// Receives generated image
{
  "image_url": "https://...",
  "generation_time": "3.2s"
}`,
  },
  {
    icon: Zap,
    title: 'Compute Resources',
    description: 'On-demand computation and GPU time',
    code: `// Request GPU compute
GET /api/compute/gpu-h100

// 402: Pay per minute
{
  "price_per_minute": 0.50,
  "currency": "USD",
  "min_duration": 5
}

// Agent reserves 10 minutes
// Pays 5 USDC upfront
// Gets compute access token
{ "session_id": "abc123", "expires": 600 }`,
  },
  {
    icon: Image,
    title: 'Content Creation',
    description: 'Generate images, videos, and documents',
    code: `// AI agent needs logo design
POST /api/design/logo

// 402 Response
{
  "price": 5.00,
  "currency": "USD",
  "turnaround": "2 minutes"
}

// Agent approves cost
// Pays 5 USDC
// Receives custom logo
{
  "designs": [...],
  "formats": ["svg", "png"]
}`,
  },
]

export function Examples() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Real-World Examples
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Use Cases for x402
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how AI agents use x402 to access premium services across different industries.
          </p>
        </div>
        
        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {examples.map((example, index) => {
            const Icon = example.icon
            return (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{example.title}</h3>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </div>
                  </div>
                  
                  {/* Code Example */}
                  <CodeBlock
                    code={example.code}
                    language="typescript"
                    filename="example.ts"
                  />
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
