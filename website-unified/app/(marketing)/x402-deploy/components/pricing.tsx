'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight, Rocket, Building2, Sparkles } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    icon: Sparkles,
    features: [
      'Up to 10,000 requests/month',
      'All deployment platforms',
      'Multi-chain support',
      'Basic analytics',
      'Community support',
      'HTTP 402 protocol',
    ],
    limitations: [
      'Public dashboard',
      'Standard rate limits',
    ],
    cta: 'Get Started Free',
    href: '#quick-start',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing APIs',
    icon: Rocket,
    features: [
      'Everything in Free',
      'Unlimited requests',
      'Custom domains',
      'Advanced analytics',
      'Webhook notifications',
      'Priority support',
      'Private dashboard',
      'Custom rate limits',
      'SLA guarantees',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale deployments',
    icon: Building2,
    features: [
      'Everything in Pro',
      'Dedicated infrastructure',
      'Custom integrations',
      'White-label dashboard',
      'Multi-region deployment',
      'SOC 2 compliance',
      'Dedicated support',
      'Custom SLAs',
      'Volume discounts',
    ],
    cta: 'Contact Sales',
    href: 'mailto:enterprise@x402.dev',
    highlight: false,
  },
]

const faqs = [
  {
    q: 'Do you charge transaction fees?',
    a: 'No! We charge $0 in transaction fees. You keep 100% of your revenue.',
  },
  {
    q: 'What chains are supported?',
    a: 'All major EVM chains (Ethereum, Base, Arbitrum, Optimism, Polygon, etc.) plus Solana.',
  },
  {
    q: 'Can I use my own wallet?',
    a: 'Yes! You provide your own wallet address. We never custody your funds.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes! Free tier includes 10,000 requests/month, perfect for testing and small projects.',
  },
]

export function Pricing() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Pricing
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you grow. No hidden fees, no transaction charges.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <Card
                key={tier.name}
                className={`p-8 ${tier.highlight ? 'ring-2 ring-brand-600 relative' : ''}`}
              >
                {tier.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Header */}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-600 ml-1">{tier.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full mb-6"
                  variant={tier.highlight ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={tier.href}>
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {tier.limitations && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    {tier.limitations.map((limit) => (
                      <div key={limit} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                        </div>
                        <span className="text-xs text-gray-600">{limit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
        
        {/* Key Points */}
        <Card className="p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            What makes x402-deploy different
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <div className="font-semibold mb-2">0% Transaction Fees</div>
              <div className="text-sm text-gray-600">
                Unlike Stripe (2.9%) or payment gateways, we charge $0 in transaction fees
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="font-semibold mb-2">Instant Settlement</div>
              <div className="text-sm text-gray-600">
                Crypto payments settle in seconds, not days like traditional payments
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <div className="font-semibold mb-2">Non-Custodial</div>
              <div className="text-sm text-gray-600">
                Payments go directly to your wallet. We never touch your funds
              </div>
            </div>
          </div>
        </Card>
        
        {/* FAQs */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <Card key={faq.q} className="p-6">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
