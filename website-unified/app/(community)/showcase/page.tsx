'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Award } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  author: string
  authorAvatar: string
  image: string
  tags: string[]
  github?: string
  demo?: string
  featured?: boolean
  revenue?: string
}

const projects: Project[] = [
  {
    id: 'ai-trader',
    name: 'AI Trading Agent',
    description: 'Autonomous DeFi trader using GPT-4 and real-time market data. Achieved 23% APY in 3 months.',
    author: 'Sarah Chen',
    authorAvatar: '/avatars/sarah.jpg',
    image: '/showcase/ai-trader.png',
    tags: ['Trading', 'AI', 'DeFi'],
    github: 'https://github.com/example/ai-trader',
    demo: 'https://ai-trader-demo.com',
    featured: true,
    revenue: '$12k+',
  },
  {
    id: 'nft-analytics',
    name: 'NFT Analytics Dashboard',
    description: 'Real-time NFT market insights across 10+ chains. Track floor prices, whale movements, and trends.',
    author: 'Marcus Johnson',
    authorAvatar: '/avatars/marcus.jpg',
    image: '/showcase/nft-dashboard.png',
    tags: ['NFT', 'Analytics', 'Dashboard'],
    github: 'https://github.com/example/nft-analytics',
    featured: true,
    revenue: '$8k+',
  },
  {
    id: 'portfolio-manager',
    name: 'DeFi Portfolio Manager',
    description: 'Multi-chain portfolio tracking with automated rebalancing and yield optimization.',
    author: 'Lisa Park',
    authorAvatar: '/avatars/lisa.jpg',
    image: '/showcase/portfolio-manager.png',
    tags: ['DeFi', 'Portfolio', 'Analytics'],
    github: 'https://github.com/example/portfolio-manager',
    demo: 'https://portfolio-demo.com',
    featured: true,
    revenue: '$15k+',
  },
  {
    id: 'gas-optimizer',
    name: 'Gas Optimizer Tool',
    description: 'Predict and optimize gas fees across multiple chains. Save up to 40% on transaction costs.',
    author: 'Alex Kumar',
    authorAvatar: '/avatars/alex.jpg',
    image: '/showcase/gas-optimizer.png',
    tags: ['Tools', 'Analytics'],
    github: 'https://github.com/example/gas-optimizer',
    revenue: '$5k+',
  },
  {
    id: 'dao-bot',
    name: 'DAO Governance Bot',
    description: 'AI-powered governance assistant for DAOs. Analyzes proposals and voting patterns.',
    author: 'Jamie Rodriguez',
    authorAvatar: '/avatars/jamie.jpg',
    image: '/showcase/dao-bot.png',
    tags: ['AI', 'DAO', 'Tools'],
    github: 'https://github.com/example/dao-bot',
    demo: 'https://dao-bot-demo.com',
    revenue: '$6k+',
  },
  {
    id: 'wallet-shield',
    name: 'Wallet Security Shield',
    description: 'Real-time security monitoring and threat detection for your crypto wallets.',
    author: 'Chris Taylor',
    authorAvatar: '/avatars/chris.jpg',
    image: '/showcase/wallet-shield.png',
    tags: ['Security', 'Tools'],
    github: 'https://github.com/example/wallet-shield',
    revenue: '$10k+',
  },
  {
    id: 'yield-finder',
    name: 'Yield Farming Finder',
    description: 'Discover and compare yield farming opportunities across 50+ DeFi protocols.',
    author: 'Nina Patel',
    authorAvatar: '/avatars/nina.jpg',
    image: '/showcase/yield-finder.png',
    tags: ['DeFi', 'Yield', 'Analytics'],
    demo: 'https://yield-finder.com',
    revenue: '$7k+',
  },
  {
    id: 'nft-minter',
    name: 'No-Code NFT Minter',
    description: 'Launch your NFT collection without writing code. Full smart contract deployment.',
    author: 'David Lee',
    authorAvatar: '/avatars/david.jpg',
    image: '/showcase/nft-minter.png',
    tags: ['NFT', 'Tools'],
    github: 'https://github.com/example/nft-minter',
    demo: 'https://nft-minter.com',
    revenue: '$20k+',
  },
  {
    id: 'token-analyzer',
    name: 'Token Risk Analyzer',
    description: 'Analyze smart contracts for security risks and rug pull indicators.',
    author: 'Emma Wilson',
    authorAvatar: '/avatars/emma.jpg',
    image: '/showcase/token-analyzer.png',
    tags: ['Security', 'Analytics', 'Tools'],
    github: 'https://github.com/example/token-analyzer',
    revenue: '$9k+',
  },
]

const categories = ['All', 'Trading', 'DeFi', 'NFT', 'Analytics', 'Tools', 'AI', 'Security']

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(selectedCategory))
  
  const featuredProjects = filteredProjects.filter(p => p.featured)
  const regularProjects = filteredProjects.filter(p => !p.featured)
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-display-sm font-bold mb-4">Community Showcase</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing projects built with Universal Crypto MCP
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}
        
        {/* All Projects */}
        {regularProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No projects found in this category.</p>
          </div>
        )}
        
        {/* Submit CTA */}
        <div className="mt-16 text-center p-12 bg-white rounded-2xl border-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-4">Built something amazing?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Submit your project to be featured in our showcase
          </p>
          <Button size="lg" asChild>
            <Link href="https://github.com/nirholas/universal-crypto-mcp/issues/new?template=showcase.md">
              Submit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Card className={`group ${featured ? 'border-brand-500' : ''}`}>
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        {/* Gradient placeholder - in production, replace with actual images */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
          {project.name.split(' ')[0]}
        </div>
        {project.revenue && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            {project.revenue} earned
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="group-hover:text-brand-600 transition-colors">
          {project.name}
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
            {project.author.charAt(0)}
          </div>
          <span className="text-sm text-gray-600">by {project.author}</span>
        </div>
        
        <div className="flex gap-2">
          {project.github && (
            <Button variant="secondary" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          )}
          {project.demo && (
            <Button size="sm" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
