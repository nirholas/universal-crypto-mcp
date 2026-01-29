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
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">⚡ Real-time Data</h3>
            <p className="text-sm text-gray-400">
              Live blockchain data, prices, gas fees, and transaction monitoring
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">🔒 Secure</h3>
            <p className="text-sm text-gray-400">
              Enterprise-grade security with wallet encryption and secure key management
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
