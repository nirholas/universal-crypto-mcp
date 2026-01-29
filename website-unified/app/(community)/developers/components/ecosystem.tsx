import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Network, Cpu, Wallet, Shield } from 'lucide-react'

const ecosystemPartners = [
  {
    category: 'Blockchain Networks',
    icon: Network,
    partners: [
      { name: 'Ethereum', description: 'Layer 1 blockchain' },
      { name: 'Polygon', description: 'Scaling solution' },
      { name: 'Arbitrum', description: 'Layer 2 rollup' },
      { name: 'Optimism', description: 'Layer 2 rollup' },
    ],
  },
  {
    category: 'AI Models',
    icon: Cpu,
    partners: [
      { name: 'OpenAI', description: 'GPT-4 integration' },
      { name: 'Anthropic', description: 'Claude support' },
      { name: 'OpenRouter', description: 'Multi-model access' },
      { name: 'Local Models', description: 'Ollama support' },
    ],
  },
  {
    category: 'Wallets',
    icon: Wallet,
    partners: [
      { name: 'MetaMask', description: 'Browser extension' },
      { name: 'WalletConnect', description: 'Universal protocol' },
      { name: 'Coinbase Wallet', description: 'Self-custody' },
      { name: 'Safe', description: 'Multi-sig wallet' },
    ],
  },
  {
    category: 'Security',
    icon: Shield,
    partners: [
      { name: 'OpenZeppelin', description: 'Smart contract security' },
      { name: 'Tenderly', description: 'Monitoring & debugging' },
      { name: 'Defender', description: 'Ops platform' },
      { name: 'Forta', description: 'Real-time monitoring' },
    ],
  },
]

export function Ecosystem() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold mb-4">Ecosystem</h2>
          <p className="text-xl text-gray-600">
            Integrations with leading blockchain and AI platforms
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {ecosystemPartners.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <category.icon className="w-6 h-6 text-brand-600" />
                  <CardTitle>{category.category}</CardTitle>
                </div>
                <div className="space-y-3">
                  {category.partners.map((partner) => (
                    <div key={partner.name} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-gray-600">{partner.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        {/* Partnership CTA */}
        <div className="mt-16 text-center p-12 bg-white rounded-2xl border-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-4">Want to partner with us?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            We're always looking to expand our ecosystem with new integrations and partnerships
          </p>
          <Link
            href="mailto:partnerships@universal-crypto-mcp.com"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
