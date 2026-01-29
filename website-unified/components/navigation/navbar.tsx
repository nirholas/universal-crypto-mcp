'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'Products',
    items: [
      { name: 'MCP Server', href: '/mcp-server', description: '380+ blockchain tools for AI' },
      { name: 'x402 Protocol', href: '/x402-protocol', description: 'AI agent payment protocol' },
      { name: 'x402-deploy', href: '/x402-deploy', description: '1-click API monetization' },
    ],
  },
  {
    name: 'Developers',
    items: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs/api-reference' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Playground', href: '/playground' },
    ],
  },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Showcase', href: '/showcase' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">◈</span>
            <span className="text-xl font-bold">Universal Crypto MCP</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              item.items ? (
                <DropdownMenu key={item.name} item={item} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-black',
                    pathname === item.href ? 'text-black' : 'text-gray-600'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp">
                GitHub
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/docs/getting-started">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-6 space-y-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.items ? (
                  <>
                    <div className="font-semibold text-sm mb-2">{item.name}</div>
                    <div className="space-y-2 pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-gray-600 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="block font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function DropdownMenu({ item }: { item: any }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
        {item.name}
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border-2 border-gray-200 shadow-xl p-2">
          {item.items.map((subItem: any) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-semibold text-sm">{subItem.name}</div>
              {subItem.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {subItem.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
