'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MessageSquare, CreditCard, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'AI agent encounters HTTP 402 response',
    details: [
      'Receives payment metadata',
      'Evaluates service value',
      'Checks wallet balance',
      'Verifies price acceptability',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: MessageSquare,
    title: 'Negotiation',
    description: 'Agent analyzes payment options',
    details: [
      'Reviews accepted currencies',
      'Selects optimal payment method',
      'Calculates gas costs',
      'Prepares transaction',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Payment',
    description: 'Executes cryptocurrency transaction',
    details: [
      'Signs transaction with wallet',
      'Sends payment on-chain',
      'Waits for confirmation',
      'Receives payment proof',
    ],
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: CheckCircle2,
    title: 'Access',
    description: 'Service grants access automatically',
    details: [
      'Verifies transaction on-chain',
      'Validates payment amount',
      'Grants API access',
      'Returns requested data',
    ],
    color: 'from-green-500 to-green-600',
  },
]

export function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Protocol Flow
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            How x402 Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A four-step process that enables AI agents to autonomously 
            discover, evaluate, and pay for services.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  {/* Step Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs font-bold text-gray-400">
                      STEP {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-px bg-gray-200" />
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* Flow Diagram */}
        <Card className="p-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3`}>
                    {React.createElement(step.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div className="text-center font-semibold text-sm">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path
                        d="M10 20H30M30 20L22 12M30 20L22 28"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
