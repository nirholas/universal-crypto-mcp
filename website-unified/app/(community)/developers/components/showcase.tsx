import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

const featuredProjects = [
  {
    name: 'AI Trading Agent',
    description: 'Autonomous DeFi trader using GPT-4 and real-time market data',
    author: 'Sarah Chen',
    tags: ['AI', 'Trading', 'DeFi'],
    revenue: '$12k+',
    image: '/showcase/ai-trader.png',
  },
  {
    name: 'NFT Analytics Dashboard',
    description: 'Real-time NFT market insights across 10+ chains',
    author: 'Marcus Johnson',
    tags: ['NFT', 'Analytics'],
    revenue: '$8k+',
    image: '/showcase/nft-dashboard.png',
  },
  {
    name: 'DeFi Portfolio Manager',
    description: 'Multi-chain portfolio tracking with automated rebalancing',
    author: 'Lisa Park',
    tags: ['DeFi', 'Portfolio'],
    revenue: '$15k+',
    image: '/showcase/portfolio-manager.png',
  },
]

export function Showcase() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-display-sm font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600">
              See what the community is building
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/showcase">
              View All Projects
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Card key={project.name} className="group hover:shadow-xl transition-shadow">
              <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl overflow-hidden">
                {/* Placeholder gradient - in production, use actual images */}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                  {project.name.split(' ')[0]}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.revenue}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="group-hover:text-brand-600 transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">by {project.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
