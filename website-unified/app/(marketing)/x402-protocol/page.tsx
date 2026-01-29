import { Metadata } from 'next'
import { Hero } from './components/hero'
import { HowItWorks } from './components/how-it-works'
import { ProtocolFlow } from './components/protocol-flow'
import { Discovery } from './components/discovery'
import { Examples } from './components/examples'
import { Integration } from './components/integration'

export const metadata: Metadata = {
  title: 'x402 Protocol - HTTP 402 for AI Agent Payments',
  description: 'The first payment protocol designed for AI agents. Autonomous discovery, negotiation, and payment with cryptocurrency.',
}

export default function X402ProtocolPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ProtocolFlow />
      <Discovery />
      <Examples />
      <Integration />
    </main>
  )
}
