import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CardProps {
  title: string
  description?: string
  href?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function Card({ title, description, href, icon, children }: CardProps) {
  const content = (
    <div className="flex items-start gap-4">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        {children}
      </div>
      {href && (
        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all my-4"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg my-4">
      {content}
    </div>
  )
}
