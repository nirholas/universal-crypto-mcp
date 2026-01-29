'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Github, Users } from 'lucide-react'

interface Contributor {
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

export function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('https://api.github.com/repos/nirholas/universal-crypto-mcp/contributors?per_page=12')
      .then(res => res.json())
      .then(data => {
        setContributors(data)
        setLoading(false)
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setContributors([])
        setLoading(false)
      })
  }, [])
  
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-brand-600" />
            <h2 className="text-display-sm font-bold">Contributors</h2>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Thank you to everyone who has contributed to Universal Crypto MCP
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          </div>
        ) : contributors.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
              {contributors.map((contributor) => (
                <a
                  key={contributor.login}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group"
                >
                  <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-brand-600 transition-all">
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-center group-hover:text-brand-600 transition-colors">
                    {contributor.login}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contributor.contributions} commits
                  </p>
                </a>
              ))}
            </div>
            
            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/nirholas/universal-crypto-mcp/graphs/contributors">
                  <Github className="w-4 h-4 mr-2" />
                  View All Contributors
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Loading contributors...</p>
            <Button size="lg" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
        )}
        
        {/* Become a Contributor CTA */}
        <div className="mt-16 bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to contribute?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We welcome contributions of all kinds. Check out our contributing guide to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp/blob/main/CONTRIBUTING.md">
                Contributing Guide
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">
                Good First Issues
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
