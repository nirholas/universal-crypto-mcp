'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Rocket, Code2, BookOpen } from 'lucide-react'

const serverCode = `// Install x402-deploy
npm install -g x402-deploy

// Wrap your existing API
x402-deploy wrap ./my-api \\
  --price 0.001 \\
  --currency USDC \\
  --chain base

// Deploy to Railway
x402-deploy deploy --platform railway

// Your API now accepts crypto payments! 🎉`

const clientCode = `import { X402Client } from '@x402/client'

const client = new X402Client({
  wallet: process.env.WALLET_PRIVATE_KEY
})

// AI agent automatically handles 402 responses
const data = await client.get('https://api.example.com/premium')

// Payment happens transparently
console.log(data) // Your premium data`

const specCode = `// Server sends 402 response
HTTP/1.1 402 Payment Required
X-Accept-Cryptocurrency: USDC, ETH
X-Payment-Address: 0x742d35Cc...
X-Price-USD: 0.001
X-Chain: base, arbitrum, optimism

// Client pays and retries
POST /api/endpoint
X-Payment-Tx: 0xabcd1234...
X-Payment-Chain: base

// Server verifies and responds
HTTP/1.1 200 OK
{ "data": "..." }`

export function Integration() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Get Started
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Integrate x402 in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multiple integration options for API providers and AI agent developers.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* For API Providers */}
          <Card className="p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">For API Providers</h3>
            <p className="text-gray-600 mb-4">
              Use x402-deploy to monetize your API in one command
            </p>
            <CodeBlock
              code={serverCode}
              language="bash"
              filename="Terminal"
            />
            <Button className="w-full mt-4" asChild>
              <Link href="/x402-deploy">
                Try x402-deploy
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
          
          {/* For AI Developers */}
          <Card className="p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">For AI Developers</h3>
            <p className="text-gray-600 mb-4">
              Use the x402 client library to handle payments
            </p>
            <CodeBlock
              code={clientCode}
              language="typescript"
              filename="app.ts"
            />
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link href="https://github.com/nirholas/x402" target="_blank">
                View on GitHub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
          
          {/* Protocol Spec */}
          <Card className="p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Protocol Specification</h3>
            <p className="text-gray-600 mb-4">
              Implement x402 from scratch using our spec
            </p>
            <CodeBlock
              code={specCode}
              language="http"
              filename="protocol.txt"
            />
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link href="/docs/x402/specification">
                Read Full Spec
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
        </div>
        
        {/* Community */}
        <Card className="p-8 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Join the x402 Community
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            x402 is an open standard. Help us shape the future of AI-to-API payments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="https://github.com/nirholas/x402" target="_blank">
                Contribute on GitHub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/docs/x402">
                Read Documentation
                <BookOpen className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
