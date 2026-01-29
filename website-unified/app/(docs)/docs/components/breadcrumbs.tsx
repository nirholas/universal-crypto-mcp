'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .slice(0, -1) // Remove last segment (current page)

  if (segments.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        href="/docs"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Docs
      </Link>
      
      {segments.slice(1).map((segment, index) => {
        const href = '/' + segments.slice(0, index + 2).join('/')
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={href}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {label}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
