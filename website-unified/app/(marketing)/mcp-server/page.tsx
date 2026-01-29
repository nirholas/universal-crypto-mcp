import { Metadata } from 'next'
import { Hero } from './components/hero'
import { ToolShowcase } from './components/tool-showcase'
import { Chains } from './components/chains'
import { UseCases } from './components/use-cases'
import { Integration } from './components/integration'
import { Pricing } from './components/pricing'

export const metadata: Metadata = {
  title: 'MCP Server - 380+ Blockchain Tools for AI Agents',
  description: 'The most comprehensive blockchain MCP server. Works with Claude, ChatGPT, and any AI. Multi-chain support, DeFi protocols, NFTs, and real-time data.',
}

export default function MCPServerPage() {
  return (
    <main>
      <Hero />
      <ToolShowcase />
      <Chains />
      <UseCases />
      <Integration />
      <Pricing />
    </main>
  )
}
