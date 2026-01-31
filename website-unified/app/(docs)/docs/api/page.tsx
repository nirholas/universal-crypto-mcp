/**
 * API Reference Index Page
 * 
 * Displays all API documentation categories and packages.
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { 
  getApiPackagesByCategory, 
  getApiStats,
  API_CATEGORIES,
} from '@/lib/api-reference'
import { 
  CategorySection, 
  InstallationBlock,
} from '@/components/api-reference'

export const metadata: Metadata = {
  title: 'API Reference - Universal Crypto MCP',
  description: 'Complete API documentation for Universal Crypto MCP - 83+ packages, 380+ tools, covering DeFi, wallets, trading, agents, and more.',
  keywords: ['api', 'reference', 'documentation', 'typescript', 'mcp', 'crypto'],
  openGraph: {
    title: 'Universal Crypto MCP API Reference',
    description: 'Complete API documentation for 83+ packages',
    type: 'website',
  },
}

export default async function ApiReferencePage() {
  const categories = await getApiPackagesByCategory()
  const stats = await getApiStats()
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          API Reference
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Complete TypeScript API documentation for the Universal Crypto MCP ecosystem.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.totalPackages}</div>
            <div className="text-blue-100">Packages</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.totalSymbols.toLocaleString()}</div>
            <div className="text-purple-100">Symbols</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="text-3xl font-bold">{Object.keys(stats.categoryCounts).length}</div>
            <div className="text-green-100">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="text-3xl font-bold">60+</div>
            <div className="text-orange-100">Chains</div>
          </div>
        </div>
        
        {/* Quick Install */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Install</h2>
          <InstallationBlock packageName="@nirholas/universal-crypto-mcp" />
        </div>
      </header>
      
      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/docs/getting-started"
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚀</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Getting Started</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick start guide and installation instructions
            </p>
          </Link>
          
          <Link 
            href="/tools"
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔧</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tool Catalog</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse all 380+ MCP tools
            </p>
          </Link>
          
          <Link 
            href="/docs/x402"
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💳</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">x402 Protocol</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Machine-to-machine micropayments
            </p>
          </Link>
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Package Categories
        </h2>
        
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </section>
      
      {/* Documentation Standards */}
      <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Documentation Standards
        </h2>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            All packages in the Universal Crypto MCP ecosystem follow consistent documentation patterns:
          </p>
          
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`/**
 * Brief description of the function
 * 
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 * 
 * @example
 * \`\`\`typescript
 * const result = myFunction('value1', 'value2')
 * console.log(result)
 * \`\`\`
 * 
 * @see {@link RelatedClass} for related functionality
 */
export function myFunction(param1: string, param2: string): Result {
  // implementation
}`}</code>
          </pre>
          
          <h3>Symbol Icons</h3>
          <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {Object.entries(API_CATEGORIES).slice(0, 8).map(([key, cat]) => (
              <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span>{cat.icon}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Support */}
      <section className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Need Help?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/nirholas/universal-crypto-mcp/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Report an Issue
          </a>
          <a
            href="https://discord.gg/universal-crypto-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
            Join Discord
          </a>
        </div>
      </section>
    </div>
  )
}
