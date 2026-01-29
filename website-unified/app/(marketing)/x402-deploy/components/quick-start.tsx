'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2 } from 'lucide-react'

const installCode = `# Install globally
npm install -g x402-deploy

# Or use with npx (no install needed)
npx x402-deploy`

const wrapCode = `# Wrap your existing API
x402-deploy wrap ./my-api \\
  --price 0.001 \\
  --currency USDC \\
  --chain base \\
  --endpoints "/api/premium/*"

# That's it! Your API now accepts crypto payments`

const deployCode = `# Deploy to your favorite platform
x402-deploy deploy --platform railway

# Other platforms:
x402-deploy deploy --platform fly
x402-deploy deploy --platform vercel
x402-deploy deploy --platform docker`

const testCode = `# Test your deployed API
curl https://your-api.x402.dev/api/premium/data

# Response: HTTP 402 Payment Required
{
  "error": "Payment required",
  "price": 0.001,
  "currency": "USD",
  "payment": {
    "address": "0x742d35Cc663...",
    "chain": "base",
    "accepted": ["USDC", "ETH"]
  }
}`

const configCode = `// x402.config.js
module.exports = {
  // Pricing
  price: 0.001,           // $0.001 per request
  currency: 'USD',
  
  // Payment options
  acceptedTokens: ['USDC', 'ETH', 'DAI'],
  chains: ['base', 'arbitrum', 'optimism'],
  
  // Protected endpoints
  endpoints: [
    '/api/premium/*',
    '/api/data/*'
  ],
  
  // Wallet
  paymentAddress: process.env.PAYMENT_ADDRESS,
  
  // Advanced
  rateLimit: 100,         // requests per day per payer
  cacheTTL: 300,          // cache verification for 5 min
}`

const steps = [
  {
    number: 1,
    title: 'Install',
    description: 'Add x402-deploy globally or use npx',
    time: '10 seconds',
  },
  {
    number: 2,
    title: 'Configure',
    description: 'Set price and payment options',
    time: '1 minute',
  },
  {
    number: 3,
    title: 'Deploy',
    description: 'Push to Railway, Fly.io, or Vercel',
    time: '2 minutes',
  },
  {
    number: 4,
    title: 'Earn',
    description: 'Start receiving payments from AI agents',
    time: 'Instant',
  },
]

export function QuickStart() {
  return (
    <section id="quick-start" className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Quick Start Guide
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            From Zero to Paid API in 4 Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No code changes, no complex setup. Just wrap, deploy, and start earning.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              <div className="text-xs text-green-600 font-semibold">{step.time}</div>
            </Card>
          ))}
        </div>
        
        {/* Code Examples */}
        <Tabs defaultValue="install" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="wrap">Wrap API</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>
          
          <TabsContent value="install">
            <CodeBlock
              code={installCode}
              language="bash"
              filename="Terminal"
            />
          </TabsContent>
          
          <TabsContent value="wrap">
            <CodeBlock
              code={wrapCode}
              language="bash"
              filename="Terminal"
            />
          </TabsContent>
          
          <TabsContent value="deploy">
            <CodeBlock
              code={deployCode}
              language="bash"
              filename="Terminal"
            />
          </TabsContent>
          
          <TabsContent value="test">
            <CodeBlock
              code={testCode}
              language="bash"
              filename="Terminal"
            />
          </TabsContent>
          
          <TabsContent value="config">
            <CodeBlock
              code={configCode}
              language="javascript"
              filename="x402.config.js"
            />
          </TabsContent>
        </Tabs>
        
        {/* Features List */}
        <Card className="p-8 mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            What you get out of the box
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'HTTP 402 payment handling',
              'Multi-chain support',
              'Transaction verification',
              'Rate limiting',
              'Analytics dashboard',
              'Webhook notifications',
              'Auto-scaling',
              'SSL/TLS encryption',
              'DDoS protection',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
