'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getAdjacentPages } from '@/lib/docs/navigation'

export function PrevNextNavigation() {
  const pathname = usePathname()
  const { previous, next } = getAdjacentPages(pathname)

  if (!previous && !next) {
    return null
  }

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-between gap-4">
        {/* Previous Link */}
        {previous ? (
          <Link
            href={previous.href || '#'}
            className="group flex-1 flex flex-col p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
          >
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Previous
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              {previous.title}
            </span>
            {previous.description && (
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                {previous.description}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {/* Next Link */}
        {next ? (
          <Link
            href={next.href || '#'}
            className="group flex-1 flex flex-col items-end text-right p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
          >
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
              Next
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              {next.title}
            </span>
            {next.description && (
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                {next.description}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  )
}
