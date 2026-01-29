'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Zap, BarChart3, Bell, Code, Wallet, Globe, Lock } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Payment Verification',
    description: 'Automatic on-chain transaction verification',
    details: [
      'Real-time verification',
      'Multi-chain support',
      'Fraud detection',
      'Automatic refunds',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Zap,
    title: 'Rate Limiting',
    description: 'Control usage and prevent abuse',
    details: [
      'Per-address limits',
      'Time-based windows',
      'Custom rules',
      'Whitelist support',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track revenue, usage, and performance',
    details: [
      'Real-time metrics',
      'Revenue charts',
      'User analytics',
      'Export reports',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Bell,
    title: 'Webhooks',
    description: 'Get notified of payments and events',
    details: [
      'Payment confirmations',
      'Failed transactions',
      'Rate limit hits',
      'Custom events',
    ],
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Code,
    title: 'API Management',
    description: 'Fine-grained endpoint control',
    details: [
      'Per-endpoint pricing',
      'Route protection',
      'Custom middleware',
      'Version control',
    ],
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Wallet,
    title: 'Multi-Wallet Support',
    description: 'Accept payments across chains',
    details: [
      '20+ chains',
      'Multiple tokens',
      'Gas optimization',
      'Automatic conversion',
    ],
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Lightning-fast API responses worldwide',
    details: [
      'Edge deployment',
      'Auto-scaling',
      'Load balancing',
      '99.99% uptime',
    ],
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Lock,
    title: 'Security First',
    description: 'Enterprise-grade security built-in',
    details: [
      'DDoS protection',
      'SSL/TLS encryption',
      'Private keys secure',
      'SOC 2 compliant',
    ],
    color: 'from-red-500 to-red-600',
  },
]

export function Features() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Features
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Everything You Need to Monetize
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Production-ready features that would take months to build yourself.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  
                  {/* Details */}
                  <div className="space-y-1">
                    {feature.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2 text-xs text-gray-700">
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
      </div>
    </section>
  )
}
