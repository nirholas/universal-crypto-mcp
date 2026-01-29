'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, ExternalLink } from 'lucide-react'

const platforms = [
  {
    name: 'Railway',
    logo: '🚂',
    description: 'Deploy in one click with automatic scaling',
    features: [
      'Auto-deployment from Git',
      'Custom domains',
      'Built-in databases',
      'Instant rollbacks',
    ],
    time: '2 min',
    command: 'x402-deploy deploy --platform railway',
    color: 'from-purple-500 to-purple-600',
    url: 'https://railway.app',
  },
  {
    name: 'Fly.io',
    logo: '🪰',
    description: 'Edge deployment with global distribution',
    features: [
      'Deploy near users',
      'Auto-scale globally',
      'Redis included',
      'Free tier available',
    ],
    time: '2 min',
    command: 'x402-deploy deploy --platform fly',
    color: 'from-blue-500 to-blue-600',
    url: 'https://fly.io',
  },
  {
    name: 'Vercel',
    logo: '▲',
    description: 'Serverless deployment with edge functions',
    features: [
      'Instant deployment',
      'Edge network',
      'Preview deployments',
      'Analytics included',
    ],
    time: '1 min',
    command: 'x402-deploy deploy --platform vercel',
    color: 'from-gray-800 to-gray-900',
    url: 'https://vercel.com',
  },
  {
    name: 'Docker',
    logo: '🐳',
    description: 'Self-host anywhere with Docker containers',
    features: [
      'Full control',
      'Any cloud provider',
      'Custom configuration',
      'Kubernetes ready',
    ],
    time: '3 min',
    command: 'x402-deploy docker build',
    color: 'from-blue-400 to-cyan-500',
    url: 'https://docker.com',
  },
]

const comparison = [
  { feature: 'Setup Time', railway: '2 min', fly: '2 min', vercel: '1 min', docker: '3 min' },
  { feature: 'Auto-scaling', railway: true, fly: true, vercel: true, docker: false },
  { feature: 'Free Tier', railway: true, fly: true, vercel: true, docker: 'N/A' },
  { feature: 'Custom Domains', railway: true, fly: true, vercel: true, docker: true },
  { feature: 'Global Edge', railway: false, fly: true, vercel: true, docker: false },
  { feature: 'Database', railway: true, fly: true, vercel: false, docker: true },
]

export function Platforms() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Deployment Options
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Deploy Anywhere You Want
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            x402-deploy works with all major cloud platforms. Choose your favorite 
            or deploy to multiple for redundancy.
          </p>
        </div>
        
        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                    {platform.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{platform.name}</h3>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                  <Badge variant="outline">{platform.time}</Badge>
                </div>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {platform.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Command */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <code className="text-xs text-green-400 font-mono">
                    $ {platform.command}
                  </code>
                </div>
                
                {/* CTA */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={platform.url} target="_blank">
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Comparison Table */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Platform Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Railway</th>
                  <th className="text-center p-4 font-semibold">Fly.io</th>
                  <th className="text-center p-4 font-semibold">Vercel</th>
                  <th className="text-center p-4 font-semibold">Docker</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {comparison.map((row, index) => (
                  <tr key={row.feature} className={index < comparison.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="text-center p-4">
                      {typeof row.railway === 'boolean' ? (
                        row.railway ? <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /> : '✗'
                      ) : (
                        row.railway
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.fly === 'boolean' ? (
                        row.fly ? <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /> : '✗'
                      ) : (
                        row.fly
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.vercel === 'boolean' ? (
                        row.vercel ? <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /> : '✗'
                      ) : (
                        row.vercel
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.docker === 'boolean' ? (
                        row.docker ? <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /> : '✗'
                      ) : (
                        row.docker
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
