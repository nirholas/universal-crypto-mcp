'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight, Github, Heart } from 'lucide-react'

const freeTier = {
  name: 'Free Forever',
  price: '$0',
  description: 'Everything you need to build blockchain AI',
  features: [
    '380+ blockchain tools',
    '20+ chain support',
    'Unlimited requests',
    'Real-time data',
    'DeFi protocols',
    'NFT operations',
    'Market data',
    'Full documentation',
    'Community support',
    'MIT License',
  ],
  highlight: true,
}

const enterprise = {
  name: 'Enterprise',
  price: 'Custom',
  description: 'For teams building at scale',
  features: [
    'Everything in Free',
    'Priority support',
    'Custom integrations',
    'SLA guarantees',
    'Dedicated infrastructure',
    'Training & onboarding',
    'Security review',
    'Custom chains',
  ],
  highlight: false,
}

export function Pricing() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-brand-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Pricing
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Free Forever. Open Source.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MIT licensed, no hidden fees, no API keys required. 
            Build anything you want.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Tier */}
          <Card className={`p-8 ${freeTier.highlight ? 'ring-2 ring-brand-600' : ''}`}>
            {freeTier.highlight && (
              <Badge className="mb-4">Most Popular</Badge>
            )}
            <h3 className="text-3xl font-bold mb-2">{freeTier.name}</h3>
            <div className="mb-4">
              <span className="text-5xl font-bold">{freeTier.price}</span>
              <span className="text-gray-600 ml-2">forever</span>
            </div>
            <p className="text-gray-600 mb-6">{freeTier.description}</p>
            
            <Button size="lg" className="w-full mb-6" asChild>
              <Link href="/docs/quickstart">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <div className="space-y-3">
              {freeTier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Enterprise */}
          <Card className="p-8">
            <h3 className="text-3xl font-bold mb-2">{enterprise.name}</h3>
            <div className="mb-4">
              <span className="text-5xl font-bold">{enterprise.price}</span>
            </div>
            <p className="text-gray-600 mb-6">{enterprise.description}</p>
            
            <Button size="lg" variant="outline" className="w-full mb-6" asChild>
              <Link href="mailto:enterprise@universal-crypto-mcp.com">
                Contact Sales
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <div className="space-y-3">
              {enterprise.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Open Source CTA */}
        <Card className="p-8 text-center max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-2xl font-bold mb-4">
            Built with ❤️ by the community
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Universal Crypto MCP is open source and maintained by contributors worldwide. 
            Star us on GitHub, submit PRs, or sponsor development.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp" target="_blank">
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="https://github.com/sponsors/nirholas" target="_blank">
                <Heart className="w-4 h-4 mr-2" />
                Sponsor Project
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
