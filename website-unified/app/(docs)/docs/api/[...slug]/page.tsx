/**
 * Dynamic API Reference Package Page
 * 
 * Displays API documentation for individual packages or categories.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  getApiDocBySlug, 
  getAllApiDocSlugs,
  getApiPackage,
  getAllApiSymbols,
  API_CATEGORIES,
  ApiSymbol,
} from '@/lib/api-reference'
import { 
  SymbolDetail, 
  SymbolCard,
  InstallationBlock,
  TableOfContents,
  SymbolBadge,
} from '@/components/api-reference'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: { slug?: string[] }
}

export async function generateStaticParams() {
  const slugs = await getAllApiDocSlugs()
  
  // Add category pages
  const categoryParams = Object.keys(API_CATEGORIES).map(cat => ({
    slug: [cat],
  }))
  
  // Add doc pages
  const docParams = slugs.map(slug => ({
    slug: slug.split('/').filter(Boolean),
  }))
  
  return [...categoryParams, ...docParams]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug?.join('/') || 'index'
  
  // Check if it's a category page
  const categoryKey = params.slug?.[0]
  if (categoryKey && API_CATEGORIES[categoryKey] && params.slug?.length === 1) {
    const category = API_CATEGORIES[categoryKey]
    return {
      title: `${category.name} API Reference - Universal Crypto MCP`,
      description: category.description,
      keywords: ['api', 'reference', categoryKey, 'documentation'],
    }
  }
  
  // Check if it's a package page
  const packageName = params.slug?.join('/')
  if (packageName) {
    const pkg = await getApiPackage(packageName)
    if (pkg) {
      return {
        title: `${pkg.displayName} API Reference - Universal Crypto MCP`,
        description: pkg.description || `API documentation for ${pkg.displayName}`,
        keywords: ['api', 'reference', pkg.displayName, ...pkg.keywords],
      }
    }
  }
  
  // Try to load as doc
  const doc = await getApiDocBySlug(slug)
  if (doc) {
    return {
      title: `${doc.title} - API Reference - Universal Crypto MCP`,
      description: doc.description,
      keywords: ['api', 'reference', doc.package],
    }
  }
  
  return {
    title: 'API Reference - Universal Crypto MCP',
    description: 'API documentation',
  }
}

export default async function ApiDocPage({ params }: PageProps) {
  const slug = params.slug?.join('/') || 'index'
  
  // Check if it's a category page
  const categoryKey = params.slug?.[0]
  if (categoryKey && API_CATEGORIES[categoryKey] && params.slug?.length === 1) {
    return <CategoryPage categoryKey={categoryKey} />
  }
  
  // Try to load the doc
  const doc = await getApiDocBySlug(slug)
  
  if (!doc) {
    // Try as package
    const packageName = params.slug?.join('-') || params.slug?.[0]
    if (packageName) {
      return <PackagePage packageSlug={packageName} />
    }
    
    notFound()
  }
  
  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/docs/api" className="hover:text-gray-700 dark:hover:text-gray-200">
                API Reference
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link 
                href={`/docs/api/${doc.category}`} 
                className="hover:text-gray-700 dark:hover:text-gray-200"
              >
                {doc.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{doc.title}</li>
          </ol>
        </nav>
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {doc.description}
            </p>
          )}
          {doc.lastModified && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Last updated: {new Date(doc.lastModified).toLocaleDateString()}
            </p>
          )}
        </header>
        
        {/* MDX Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote
            source={doc.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                  [rehypePrettyCode, { theme: 'github-dark', keepBackground: false }],
                ],
              },
            }}
          />
        </div>
        
        {/* Symbols */}
        {doc.symbols && doc.symbols.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              API Symbols
            </h2>
            <div className="space-y-6">
              {doc.symbols.map((symbol, idx) => (
                <SymbolDetail key={idx} symbol={symbol} />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Table of Contents */}
      {doc.toc && doc.toc.length > 0 && (
        <aside className="hidden xl:block w-64 shrink-0">
          <TableOfContents items={doc.toc} />
        </aside>
      )}
    </div>
  )
}

// ============================================================================
// Category Page Component
// ============================================================================

async function CategoryPage({ categoryKey }: { categoryKey: string }) {
  const category = API_CATEGORIES[categoryKey]
  if (!category) notFound()
  
  // Get all symbols for this category
  const allSymbols = await getAllApiSymbols()
  const categorySymbols = allSymbols.filter(s => {
    // Match by package name containing category key
    return s.package.toLowerCase().includes(categoryKey)
  })
  
  // Group symbols by kind
  const symbolsByKind = categorySymbols.reduce((acc, symbol) => {
    if (!acc[symbol.kind]) acc[symbol.kind] = []
    acc[symbol.kind].push(symbol)
    return acc
  }, {} as Record<string, ApiSymbol[]>)
  
  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/docs/api" className="hover:text-gray-700 dark:hover:text-gray-200">
              API Reference
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white">{category.name}</li>
        </ol>
      </nav>
      
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {category.name}
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {category.description}
        </p>
      </header>
      
      {/* Symbol Overview */}
      {Object.keys(symbolsByKind).length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Symbol Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(symbolsByKind).map(([kind, symbols]) => (
              <div 
                key={kind}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
              >
                <SymbolBadge kind={kind as ApiSymbol['kind']} size="sm" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {symbols.length}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Symbols by Kind */}
      {Object.entries(symbolsByKind).map(([kind, symbols]) => (
        <section key={kind} className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <SymbolBadge kind={kind as ApiSymbol['kind']} size="sm" />
            <span>{symbols.length} {kind}s</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {symbols.slice(0, 20).map((symbol, idx) => (
              <SymbolCard 
                key={idx} 
                symbol={symbol} 
                compact 
                showPackage
              />
            ))}
          </div>
          {symbols.length > 20 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              And {symbols.length - 20} more...
            </p>
          )}
        </section>
      ))}
    </div>
  )
}

// ============================================================================
// Package Page Component
// ============================================================================

async function PackagePage({ packageSlug }: { packageSlug: string }) {
  // Try to find package by various name formats
  const pkg = await getApiPackage(packageSlug) 
    || await getApiPackage(`@nirholas/${packageSlug}`)
    || await getApiPackage(packageSlug.replace(/-/g, '/'))
  
  if (!pkg) {
    notFound()
  }
  
  // Get symbols for this package
  const allSymbols = await getAllApiSymbols()
  const packageSymbols = allSymbols.filter(s => 
    s.package === pkg.name || s.package === pkg.displayName
  )
  
  // Group by kind
  const symbolsByKind = packageSymbols.reduce((acc, symbol) => {
    if (!acc[symbol.kind]) acc[symbol.kind] = []
    acc[symbol.kind].push(symbol)
    return acc
  }, {} as Record<string, ApiSymbol[]>)
  
  const categoryConfig = API_CATEGORIES[pkg.category]
  
  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/docs/api" className="hover:text-gray-700 dark:hover:text-gray-200">
              API Reference
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link 
              href={`/docs/api/${pkg.category}`} 
              className="hover:text-gray-700 dark:hover:text-gray-200"
            >
              {categoryConfig?.name || pkg.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white">{pkg.displayName}</li>
        </ol>
      </nav>
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {pkg.displayName}
          </h1>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded">
            v{pkg.version}
          </span>
        </div>
        
        {pkg.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {pkg.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {pkg.keywords.map((keyword, idx) => (
            <span 
              key={idx}
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded"
            >
              {keyword}
            </span>
          ))}
        </div>
      </header>
      
      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Installation
        </h2>
        <InstallationBlock packageName={pkg.name} />
      </section>
      
      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Start
        </h2>
        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{`import { /* exports */ } from '${pkg.name}'

// Your code here`}</code>
        </pre>
      </section>
      
      {/* Package Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Package Information
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Name</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{pkg.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Version</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{pkg.version}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Category</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{categoryConfig?.name || pkg.category}</td>
              </tr>
              {pkg.license && (
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">License</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{pkg.license}</td>
                </tr>
              )}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Symbols</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{packageSymbols.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Exports */}
      {pkg.exports.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Exports
          </h2>
          <div className="flex flex-wrap gap-2">
            {pkg.exports.map((exp, idx) => (
              <code 
                key={idx}
                className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono"
              >
                {exp}
              </code>
            ))}
          </div>
        </section>
      )}
      
      {/* Dependencies */}
      {pkg.dependencies && Object.keys(pkg.dependencies).length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Dependencies
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="space-y-1">
              {Object.entries(pkg.dependencies).slice(0, 10).map(([name, version]) => (
                <li key={name} className="text-sm">
                  <code className="font-mono text-blue-600 dark:text-blue-400">{name}</code>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">{version}</span>
                </li>
              ))}
              {Object.keys(pkg.dependencies).length > 10 && (
                <li className="text-sm text-gray-500 dark:text-gray-400">
                  And {Object.keys(pkg.dependencies).length - 10} more...
                </li>
              )}
            </ul>
          </div>
        </section>
      )}
      
      {/* API Symbols */}
      {Object.keys(symbolsByKind).length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            API Reference
          </h2>
          
          {Object.entries(symbolsByKind).map(([kind, symbols]) => (
            <div key={kind} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <SymbolBadge kind={kind as ApiSymbol['kind']} size="sm" />
                <span>{symbols.length} {kind}{symbols.length !== 1 ? 's' : ''}</span>
              </h3>
              <div className="space-y-4">
                {symbols.map((symbol, idx) => (
                  <SymbolDetail key={idx} symbol={symbol} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
