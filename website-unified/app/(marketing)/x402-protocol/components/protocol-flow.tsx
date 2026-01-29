'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Badge } from '@/components/ui/badge'
import { Server, Zap, ArrowRight, Globe } from 'lucide-react'

const requestCode = `GET /api/premium-data HTTP/1.1
Host: api.example.com
Authorization: Bearer agent-token`

const responseCode = `HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Accept-Cryptocurrency: USDC, ETH, DAI
X-Payment-Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
X-Price-USD: 0.001
X-Chain: base

{
  "error": "Payment required",
  "message": "This endpoint requires payment",
  "price": {
    "amount": 0.001,
    "currency": "USD"
  },
  "payment": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chains": ["base", "arbitrum", "optimism"],
    "accepted": ["USDC", "ETH", "DAI"]
  },
  "info": {
    "endpoint": "/api/premium-data",
    "rateLimit": "100 requests/day",
    "description": "Real-time market analytics"
  }
}`

const paymentCode = `POST /api/premium-data HTTP/1.1
Host: api.example.com
Authorization: Bearer agent-token
X-Payment-Tx: 0xabcd1234...
X-Payment-Chain: base

// AI agent paid 0.001 USDC on Base
// Transaction confirmed in 2 seconds`

const successCode = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "btc_price": 45123.45,
    "eth_price": 2345.67,
    "market_cap": 1234567890,
    "volume_24h": 98765432
  },
  "credits_remaining": 99
}`

export function ProtocolFlow() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Technical Details
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            See the Protocol in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete request/response cycle showing how AI agents 
            interact with paid APIs.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Step 1: Initial Request */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">AI Agent Makes Request</h3>
            </div>
            <CodeBlock
              code={requestCode}
              language="http"
              filename="Request"
            />
          </motion.div>
          
          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* Step 2: 402 Response */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">Server Returns 402 with Payment Info</h3>
            </div>
            <CodeBlock
              code={responseCode}
              language="http"
              filename="Response"
            />
          </motion.div>
          
          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* Step 3: Payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Agent Pays and Retries Request</h3>
            </div>
            <CodeBlock
              code={paymentCode}
              language="http"
              filename="Paid Request"
            />
          </motion.div>
          
          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* Step 4: Success */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold">Server Returns Requested Data</h3>
            </div>
            <CodeBlock
              code={successCode}
              language="http"
              filename="Success Response"
            />
          </motion.div>
        </div>
        
        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6">
            <Server className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold mb-2">Standard HTTP</h3>
            <p className="text-sm text-gray-600">
              Uses HTTP 402 status code, works with existing infrastructure
            </p>
          </Card>
          
          <Card className="p-6">
            <Zap className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-2">Fast Payments</h3>
            <p className="text-sm text-gray-600">
              Transactions confirm in seconds on L2 chains like Base
            </p>
          </Card>
          
          <Card className="p-6">
            <Globe className="w-8 h-8 text-cyan-600 mb-3" />
            <h3 className="font-bold mb-2">Multi-Chain</h3>
            <p className="text-sm text-gray-600">
              Accept payments on any EVM chain, agent chooses optimal
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
