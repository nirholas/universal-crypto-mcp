import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BookOpen, Code, Video, FileText, Zap, Package } from 'lucide-react'

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Complete API reference and guides',
    link: '/docs',
    color: 'text-blue-500',
  },
  {
    icon: Code,
    title: 'Quick Start',
    description: 'Get up and running in 5 minutes',
    link: '/docs/quickstart',
    color: 'text-green-500',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    link: '/tutorials',
    color: 'text-red-500',
  },
  {
    icon: FileText,
    title: 'Code Examples',
    description: '50+ production-ready examples',
    link: '/examples',
    color: 'text-purple-500',
  },
  {
    icon: Zap,
    title: 'API Reference',
    description: 'Full TypeScript API documentation',
    link: '/api',
    color: 'text-yellow-500',
  },
  {
    icon: Package,
    title: 'NPM Packages',
    description: 'Modular packages for any use case',
    link: 'https://www.npmjs.com/org/universal-crypto-mcp',
    color: 'text-orange-500',
  },
]

export function Resources() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold mb-4">Developer Resources</h2>
          <p className="text-xl text-gray-600">
            Everything you need to build amazing blockchain applications
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link key={resource.title} href={resource.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <resource.icon className={`w-8 h-8 ${resource.color}`} />
                    <CardTitle>{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Quick Links */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/docs/getting-started">Get Started</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/examples">Browse Examples</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
