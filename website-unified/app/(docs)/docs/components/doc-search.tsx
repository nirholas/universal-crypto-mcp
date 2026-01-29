'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  slug: string
  title: string
  content: string
  category: string
  score?: number
}

export function DocSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Search documents
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchDocs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/docs/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchDocs, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (slug: string) => {
    router.push(`/docs/${slug}`)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search docs...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
          <Command className="w-3 h-3 inline" />K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none"
                  autoFocus
                />
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading && (
                  <div className="p-8 text-center text-gray-500">
                    Searching...
                  </div>
                )}

                {!isLoading && query && results.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="py-2">
                    {results.map((result, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSelect(result.slug)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                            {result.content.substring(0, 150)}...
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {result.category}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
                <span>Press ESC to close</span>
                <span>↑↓ to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
