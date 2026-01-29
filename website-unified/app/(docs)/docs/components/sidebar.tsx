'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface NavItem {
  title: string
  href?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    children: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Quick Start', href: '/docs/quick-start' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'Core Concepts',
    children: [
      { title: 'Architecture', href: '/docs/architecture' },
      { title: 'MCP Protocol', href: '/docs/mcp-protocol' },
      { title: 'Tools & Resources', href: '/docs/tools-resources' },
      { title: 'Security', href: '/docs/security' },
    ],
  },
  {
    title: 'Integrations',
    children: [
      { title: 'Overview', href: '/docs/integrations' },
      { title: 'DeFi Protocols', href: '/docs/integrations/defi' },
      { title: 'Wallets', href: '/docs/integrations/wallets' },
      { title: 'Market Data', href: '/docs/integrations/market-data' },
      { title: 'Trading', href: '/docs/integrations/trading' },
    ],
  },
  {
    title: 'API Reference',
    children: [
      { title: 'Core API', href: '/docs/api/core' },
      { title: 'DeFi API', href: '/docs/api/defi' },
      { title: 'Trading API', href: '/docs/api/trading' },
      { title: 'Wallet API', href: '/docs/api/wallet' },
    ],
  },
  {
    title: 'Guides',
    children: [
      { title: 'Building Agents', href: '/docs/guides/building-agents' },
      { title: 'Custom Integrations', href: '/docs/guides/custom-integrations' },
      { title: 'Testing', href: '/docs/guides/testing' },
      { title: 'Deployment', href: '/docs/guides/deployment' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="mt-6 space-y-8">
      {navigation.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {section.title}
          </h3>
          {section.children && (
            <ul className="space-y-2">
              {section.children.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href || '#'}
                    className={`block py-1 px-3 rounded-md text-sm transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
