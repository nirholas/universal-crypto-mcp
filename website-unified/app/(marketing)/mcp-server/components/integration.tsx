'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, MessageSquare, Code2, Terminal } from 'lucide-react'

const installCode = `# Install via npm
npx -y @modelcontextprotocol/create-server universal-crypto-mcp

# Or with pnpm
pnpm dlx @modelcontextprotocol/create-server universal-crypto-mcp

# Configure Claude Desktop
# Add to ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["-y", "universal-crypto-mcp"]
    }
  }
}`

const pythonCode = `from anthropic import Anthropic

client = Anthropic()

# Claude automatically has access to all blockchain tools
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    messages=[{
        "role": "user",
        "content": "What's my ETH balance on Base?"
    }]
)

print(response.content)`

const nodeCode = `import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

// Build powerful blockchain apps with natural language
const message = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  messages: [{
    role: "user",
    content: "Swap 1 ETH to USDC on Base"
  }]
})

console.log(message.content)`

const steps = [
  {
    icon: Terminal,
    title: 'Install',
    description: 'One command to get started',
    time: '30 seconds',
  },
  {
    icon: Code2,
    title: 'Configure',
    description: 'Add to your AI assistant',
    time: '1 minute',
  },
  {
    icon: MessageSquare,
    title: 'Use',
    description: 'Start chatting with blockchain',
    time: 'Instant',
  },
]

export function Integration() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Quick Integration
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Get Started in 2 Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Works with Claude, ChatGPT, and any AI that supports MCP. 
            Zero configuration, instant access to 380+ tools.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <div className="text-sm text-brand-600 font-semibold mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-2">{step.description}</p>
                <div className="text-sm text-gray-500">{step.time}</div>
              </Card>
            )
          })}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Installation */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Installation</h3>
            <CodeBlock
              code={installCode}
              language="bash"
              filename="Terminal"
            />
          </div>
          
          {/* Python Example */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Use with Python</h3>
            <CodeBlock
              code={pythonCode}
              language="python"
              filename="app.py"
            />
          </div>
        </div>
        
        {/* Node.js Example */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-4">Use with Node.js</h3>
          <CodeBlock
            code={nodeCode}
            language="typescript"
            filename="app.ts"
          />
        </div>
        
        {/* AI Platforms */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Works with your favorite AI
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <div className="font-semibold mb-2">Claude Desktop</div>
              <div className="text-sm text-gray-600">Native MCP support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <div className="font-semibold mb-2">ChatGPT</div>
              <div className="text-sm text-gray-600">Via MCP bridge</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="font-semibold mb-2">Any AI</div>
              <div className="text-sm text-gray-600">MCP compatible</div>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/docs/quickstart">
                View Full Documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
