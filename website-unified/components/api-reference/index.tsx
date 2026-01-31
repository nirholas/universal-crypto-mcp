'use client'

/**
 * API Reference Components
 * 
 * React components for displaying API documentation.
 * Designed for enterprise-grade documentation with full TypeScript support.
 */

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  ApiSymbol, 
  ApiSymbolKind, 
  ApiParameter,
  ApiPackageInfo,
  ApiCategory,
  SYMBOL_KIND_CONFIG,
  ApiSearchResult,
} from '@/lib/api-reference'

// ============================================================================
// Symbol Badge Component
// ============================================================================

interface SymbolBadgeProps {
  kind: ApiSymbolKind
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function SymbolBadge({ kind, size = 'md', showLabel = true }: SymbolBadgeProps) {
  const config = SYMBOL_KIND_CONFIG[kind]
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }
  
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  }
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-md font-medium
        ${sizeClasses[size]}
        ${colorClasses[config.color]}
      `}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

// ============================================================================
// Symbol Signature Component
// ============================================================================

interface SymbolSignatureProps {
  symbol: ApiSymbol
  showParameters?: boolean
  compact?: boolean
}

export function SymbolSignature({ symbol, showParameters = true, compact = false }: SymbolSignatureProps) {
  const renderParameters = () => {
    if (!symbol.parameters || symbol.parameters.length === 0) {
      return '()'
    }
    
    const params = symbol.parameters.map(p => {
      const optionalMarker = p.optional ? '?' : ''
      const restMarker = p.rest ? '...' : ''
      return `${restMarker}${p.name}${optionalMarker}: ${p.type}`
    })
    
    if (compact) {
      return `(${params.join(', ')})`
    }
    
    return (
      <span className="text-gray-600 dark:text-gray-400">
        {'('}
        {params.map((param, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ', '}
            <span className="text-orange-600 dark:text-orange-400">{param}</span>
          </React.Fragment>
        ))}
        {')'}
      </span>
    )
  }
  
  const renderReturnType = () => {
    if (!symbol.returnType || symbol.returnType === 'void') return null
    
    return (
      <span className="text-gray-600 dark:text-gray-400">
        {' => '}
        <span className="text-green-600 dark:text-green-400">{symbol.returnType}</span>
      </span>
    )
  }
  
  if (compact && typeof renderParameters() === 'string') {
    return (
      <code className="text-sm font-mono">
        <span className="text-blue-600 dark:text-blue-400">{symbol.name}</span>
        {showParameters && renderParameters()}
        {symbol.returnType && `: ${symbol.returnType}`}
      </code>
    )
  }
  
  return (
    <code className="text-sm font-mono block overflow-x-auto">
      <span className="text-purple-600 dark:text-purple-400">{symbol.kind}</span>
      {' '}
      <span className="text-blue-600 dark:text-blue-400 font-semibold">{symbol.name}</span>
      {symbol.typeParameters && symbol.typeParameters.length > 0 && (
        <span className="text-cyan-600 dark:text-cyan-400">
          {'<'}
          {symbol.typeParameters.map((tp, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && ', '}
              {tp.name}
              {tp.constraint && ` extends ${tp.constraint}`}
            </React.Fragment>
          ))}
          {'>'}
        </span>
      )}
      {showParameters && (symbol.kind === 'function' || symbol.kind === 'method' || symbol.kind === 'constructor') && renderParameters()}
      {renderReturnType()}
    </code>
  )
}

// ============================================================================
// Parameter Table Component
// ============================================================================

interface ParameterTableProps {
  parameters: ApiParameter[]
}

export function ParameterTable({ parameters }: ParameterTableProps) {
  if (!parameters || parameters.length === 0) return null
  
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Parameter
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {parameters.map((param, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3 whitespace-nowrap">
                <code className="text-sm font-mono text-purple-600 dark:text-purple-400">
                  {param.rest && '...'}
                  {param.name}
                  {param.optional && (
                    <span className="text-gray-400 dark:text-gray-500">?</span>
                  )}
                </code>
                {param.defaultValue && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    = {param.defaultValue}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  {param.type}
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {param.description || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Symbol Card Component
// ============================================================================

interface SymbolCardProps {
  symbol: ApiSymbol
  href?: string
  showPackage?: boolean
  compact?: boolean
}

export function SymbolCard({ symbol, href, showPackage = true, compact = false }: SymbolCardProps) {
  const content = (
    <div 
      className={`
        border border-gray-200 dark:border-gray-700 rounded-lg p-4
        hover:border-blue-500 dark:hover:border-blue-400 transition-colors
        ${href ? 'cursor-pointer' : ''}
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <SymbolBadge kind={symbol.kind} size="sm" showLabel={!compact} />
            {symbol.deprecated && (
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                Deprecated
              </span>
            )}
          </div>
          
          <h3 className="font-mono font-semibold text-gray-900 dark:text-white truncate">
            {symbol.name}
          </h3>
          
          {!compact && symbol.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {symbol.description}
            </p>
          )}
          
          {showPackage && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              {symbol.package}
            </p>
          )}
        </div>
        
        {!compact && symbol.returnType && (
          <code className="text-xs font-mono text-green-600 dark:text-green-400 shrink-0">
            → {symbol.returnType}
          </code>
        )}
      </div>
    </div>
  )
  
  if (href) {
    return <Link href={href}>{content}</Link>
  }
  
  return content
}

// ============================================================================
// Symbol Detail Component
// ============================================================================

interface SymbolDetailProps {
  symbol: ApiSymbol
}

export function SymbolDetail({ symbol }: SymbolDetailProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" id={symbol.name.toLowerCase()}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <SymbolBadge kind={symbol.kind} />
          {symbol.deprecated && (
            <span className="text-sm px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
              ⚠️ Deprecated
            </span>
          )}
          {symbol.since && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Since v{symbol.since}
            </span>
          )}
        </div>
        
        <SymbolSignature symbol={symbol} />
        
        {symbol.sourceFile && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Defined in <code>{symbol.sourceFile}</code>
            {symbol.sourceLine && `:${symbol.sourceLine}`}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {symbol.description && (
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">{symbol.description}</p>
          </div>
        )}
        
        {/* Deprecation warning */}
        {symbol.deprecated && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-400 mb-1">⚠️ Deprecated</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              {typeof symbol.deprecated === 'string' ? symbol.deprecated : 'This API is deprecated and may be removed in a future version.'}
            </p>
          </div>
        )}
        
        {/* Parameters */}
        {symbol.parameters && symbol.parameters.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Parameters</h4>
            <ParameterTable parameters={symbol.parameters} />
          </div>
        )}
        
        {/* Return Type */}
        {symbol.returnType && symbol.returnType !== 'void' && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Returns</h4>
            <p className="text-gray-700 dark:text-gray-300">
              <code className="font-mono text-green-600 dark:text-green-400">{symbol.returnType}</code>
              {symbol.returnDescription && (
                <span className="ml-2">— {symbol.returnDescription}</span>
              )}
            </p>
          </div>
        )}
        
        {/* Throws */}
        {symbol.throws && symbol.throws.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Throws</h4>
            <ul className="list-disc list-inside space-y-1">
              {symbol.throws.map((t, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">
                  <code className="font-mono text-red-600 dark:text-red-400">{t.type}</code>
                  {t.description && <span className="ml-2">— {t.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Examples */}
        {symbol.examples && symbol.examples.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Examples</h4>
            {symbol.examples.map((example, idx) => (
              <pre key={idx} className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3">
                <code>{example}</code>
              </pre>
            ))}
          </div>
        )}
        
        {/* See Also */}
        {symbol.see && symbol.see.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">See Also</h4>
            <ul className="list-disc list-inside space-y-1">
              {symbol.see.map((ref, idx) => (
                <li key={idx} className="text-blue-600 dark:text-blue-400 hover:underline">
                  <Link href={`#${ref.toLowerCase()}`}>{ref}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Members (for classes/interfaces) */}
        {symbol.members && symbol.members.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Members</h4>
            <div className="space-y-3">
              {symbol.members.map((member, idx) => (
                <SymbolCard key={idx} symbol={member} compact showPackage={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Package Card Component
// ============================================================================

interface PackageCardProps {
  pkg: ApiPackageInfo
  href?: string
}

export function PackageCard({ pkg, href }: PackageCardProps) {
  const content = (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {pkg.displayName}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
          v{pkg.version}
        </span>
      </div>
      
      {pkg.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {pkg.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <code className="font-mono">{pkg.name}</code>
        <span>{pkg.symbolCount} symbols</span>
      </div>
      
      {pkg.keywords && pkg.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {pkg.keywords.slice(0, 3).map((keyword, idx) => (
            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
  
  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  
  return content
}

// ============================================================================
// Category Section Component
// ============================================================================

interface CategorySectionProps {
  category: ApiCategory
  showPackages?: boolean
}

export function CategorySection({ category, showPackages = true }: CategorySectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{category.icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {category.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {category.packages.length} package{category.packages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {category.description}
      </p>
      
      {showPackages && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.packages.map((pkg, idx) => (
            <PackageCard 
              key={idx} 
              pkg={pkg} 
              href={`/docs/api/${pkg.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ============================================================================
// Search Results Component
// ============================================================================

interface SearchResultsProps {
  results: ApiSearchResult[]
  onSelect?: (symbol: ApiSymbol) => void
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No results found
      </div>
    )
  }
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {results.map((result, idx) => (
        <button
          key={idx}
          onClick={() => onSelect?.(result.symbol)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <SymbolBadge kind={result.symbol.kind} size="sm" showLabel={false} />
            <span className="font-mono font-medium text-gray-900 dark:text-white">
              {result.symbol.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {result.symbol.package}
            </span>
          </div>
          {result.symbol.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {result.symbol.description}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// API Search Component
// ============================================================================

interface ApiSearchProps {
  onSearch: (query: string) => void
  results: ApiSearchResult[]
  isLoading?: boolean
  onResultSelect?: (symbol: ApiSymbol) => void
}

export function ApiSearch({ onSearch, results, isLoading, onResultSelect }: ApiSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0)
    onSearch(value)
  }, [onSearch])
  
  const handleSelect = useCallback((symbol: ApiSymbol) => {
    setIsOpen(false)
    setQuery('')
    onResultSelect?.(symbol)
  }, [onResultSelect])
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder="Search API symbols..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <SearchResults results={results} onSelect={handleSelect} />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Table of Contents Component
// ============================================================================

interface TocItem {
  id: string
  title: string
  level: number
  children?: TocItem[]
}

interface TableOfContentsProps {
  items: TocItem[]
  activeId?: string
}

export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  const renderItems = (tocItems: TocItem[], depth: number = 0) => {
    return (
      <ul className={depth > 0 ? 'ml-4 mt-1' : ''}>
        {tocItems.map((item) => (
          <li key={item.id} className="my-1">
            <a
              href={`#${item.id}`}
              className={`
                block text-sm py-1
                ${activeId === item.id 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {item.title}
            </a>
            {item.children && item.children.length > 0 && renderItems(item.children, depth + 1)}
          </li>
        ))}
      </ul>
    )
  }
  
  return (
    <nav className="sticky top-20">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">On this page</h4>
      {renderItems(items)}
    </nav>
  )
}

// ============================================================================
// Copy Button Component
// ============================================================================

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  )
}

// ============================================================================
// Installation Code Block Component
// ============================================================================

interface InstallationBlockProps {
  packageName: string
}

export function InstallationBlock({ packageName }: InstallationBlockProps) {
  const [manager, setManager] = useState<'npm' | 'pnpm' | 'yarn'>('pnpm')
  
  const commands = {
    npm: `npm install ${packageName}`,
    pnpm: `pnpm add ${packageName}`,
    yarn: `yarn add ${packageName}`,
  }
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['pnpm', 'npm', 'yarn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setManager(m)}
            className={`px-4 py-2 text-sm font-medium ${
              manager === m
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="relative bg-gray-900 dark:bg-gray-950">
        <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
          <code>{commands[manager]}</code>
        </pre>
        <CopyButton text={commands[manager]} className="absolute top-2 right-2" />
      </div>
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export default {
  SymbolBadge,
  SymbolSignature,
  ParameterTable,
  SymbolCard,
  SymbolDetail,
  PackageCard,
  CategorySection,
  SearchResults,
  ApiSearch,
  TableOfContents,
  CopyButton,
  InstallationBlock,
}
