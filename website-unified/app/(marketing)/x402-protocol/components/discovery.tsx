'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Globe, CheckCircle2, TrendingUp } from 'lucide-react'

const benefits = [
  {
    icon: Search,
    title: 'Service Discovery',
    description: 'AI agents automatically find and evaluate paid services',
    points: [
      'No manual configuration needed',
      'Standardized payment metadata',
      'Price comparison across providers',
      'Quality and reputation signals',
    ],
  },
  {
    icon: Globe,
    title: 'Interoperability',
    description: 'Universal standard works across all AI agents and APIs',
    points: [
      'HTTP 402 compliance',
      'Chain-agnostic payments',
      'Multiple currency support',
      'Cross-platform compatible',
    ],
  },
  {
    icon: CheckCircle2,
    title: 'Trust & Verification',
    description: 'Built-in mechanisms for secure, verifiable transactions',
    points: [
      'On-chain payment proofs',
      'Automatic verification',
      'Dispute resolution',
      'Reputation tracking',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Economic Efficiency',
    description: 'Micro-payments and usage-based pricing enable new business models',
    points: [
      'Pay per request',
      'No subscriptions required',
      'Low transaction fees on L2',
      'Instant monetization',
    ],
  },
]

export function Discovery() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Why x402
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            The Future of AI-to-API Commerce
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            x402 enables a new paradigm where AI agents can autonomously 
            discover, evaluate, and pay for services.
          </p>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{benefit.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{benefit.description}</p>
                  
                  <div className="space-y-3">
                    {benefit.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* Comparison */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            x402 vs Traditional Payment Methods
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">API Keys</th>
                  <th className="text-center p-4 font-semibold">OAuth</th>
                  <th className="text-center p-4 font-semibold bg-brand-50 rounded-t-lg">
                    x402 Protocol
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="p-4">AI Agent Compatible</td>
                  <td className="text-center p-4 text-gray-400">Manual</td>
                  <td className="text-center p-4 text-gray-400">Manual</td>
                  <td className="text-center p-4 bg-brand-50">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Autonomous Discovery</td>
                  <td className="text-center p-4 text-gray-400">✗</td>
                  <td className="text-center p-4 text-gray-400">✗</td>
                  <td className="text-center p-4 bg-brand-50">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Micro-payments</td>
                  <td className="text-center p-4 text-gray-400">✗</td>
                  <td className="text-center p-4 text-gray-400">✗</td>
                  <td className="text-center p-4 bg-brand-50">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Setup Time</td>
                  <td className="text-center p-4">Hours</td>
                  <td className="text-center p-4">Days</td>
                  <td className="text-center p-4 bg-brand-50 font-semibold">
                    Seconds
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Cross-platform</td>
                  <td className="text-center p-4 text-gray-400">Limited</td>
                  <td className="text-center p-4 text-gray-400">Limited</td>
                  <td className="text-center p-4 bg-brand-50">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4">Verifiable Payments</td>
                  <td className="text-center p-4 text-gray-400">Off-chain</td>
                  <td className="text-center p-4 text-gray-400">Off-chain</td>
                  <td className="text-center p-4 bg-brand-50 rounded-b-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
