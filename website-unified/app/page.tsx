import { Hero } from '@/components/sections/hero'
import { Stats } from '@/components/sections/stats'
import { Products } from '@/components/sections/products'
import { Features } from '@/components/sections/features'
import { UseCases } from '@/components/sections/use-cases'
import { Comparison } from '@/components/sections/comparison'
import { Testimonials } from '@/components/sections/testimonials'
import { CallToAction } from '@/components/sections/cta'
import { Newsletter } from '@/components/sections/newsletter'

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Stats />
      <Products />
      <Features />
      <UseCases />
      <Comparison />
      <Testimonials />
      <CallToAction />
      <Newsletter />
    </main>
  )
}

export const metadata = {
  title: 'Universal Crypto MCP - AI-Native Blockchain Infrastructure',
  description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization. Build, deploy, and monetize in 5 minutes.',
  keywords: 'AI blockchain, MCP server, x402 protocol, API monetization, crypto payments, DeFi, Web3',
  openGraph: {
    title: 'Universal Crypto MCP - AI-Native Blockchain Infrastructure',
    description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization.',
    images: ['/og-image.png'],
  },
}
