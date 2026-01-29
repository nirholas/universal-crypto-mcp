import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import { CodeBlock } from './code-block'
import { Callout } from './callout'
import { Card } from './card'

export const components: MDXComponents = {
  // Headings with auto-generated IDs
  h1: ({ children, ...props }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      : undefined
    return (
      <h1 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }) => {
    const id = typeof children === 'string'
      ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      : undefined
    return (
      <h2 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }) => {
    const id = typeof children === 'string'
      ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      : undefined
    return (
      <h3 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h3>
    )
  },
  
  // Links
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    const isAnchor = href?.startsWith('#')
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          {...props}
        >
          {children}
        </a>
      )
    }
    
    if (isAnchor) {
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          {...props}
        >
          {children}
        </a>
      )
    }
    
    return (
      <Link
        href={href || '#'}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        {...props}
      >
        {children}
      </Link>
    )
  },
  
  // Images
  img: ({ src, alt, ...props }) => {
    if (!src) return null
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg"
        {...props}
      />
    )
  },
  
  // Code blocks
  pre: ({ children, ...props }) => {
    return <CodeBlock {...props}>{children}</CodeBlock>
  },
  
  code: ({ children, className, ...props }) => {
    // Inline code
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-sm rounded"
          {...props}
        >
          {children}
        </code>
      )
    }
    
    // Code block (handled by pre)
    return <code className={className} {...props}>{children}</code>
  },
  
  // Tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" {...props}>
        {children}
      </table>
    </div>
  ),
  
  th: ({ children, ...props }) => (
    <th
      className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),
  
  td: ({ children, ...props }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm" {...props}>
      {children}
    </td>
  ),
  
  // Custom components
  Callout,
  Card,
}
