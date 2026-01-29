import { Metadata } from 'next'
import { Hero } from './components/hero'
import { QuickStart } from './components/quick-start'
import { Platforms } from './components/platforms'
import { Features } from './components/features'
import { Dashboard } from './components/dashboard'
import { Pricing } from './components/pricing'

export const metadata: Metadata = {
  title: 'x402-deploy - Monetize Any API in 5 Minutes',
  description: 'One command turns your API into a paid service. Deploy to Railway, Fly.io, Vercel, or Docker. Zero code changes.',
}

export default function X402DeployPage() {
  return (
    <main>
      <Hero />
      <QuickStart />
      <Platforms />
      <Features />
      <Dashboard />
      <Pricing />
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">1 min</div>
            <div className="text-sm text-gray-400">Deployment time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">0 code</div>
            <div className="text-sm text-gray-400">Changes required</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">∞ scale</div>
            <div className="text-sm text-gray-400">Auto-scaling included</div>
          </div>
        </div>
      </div>
    </main>
  )
}
