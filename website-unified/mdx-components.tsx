import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with auto-generated IDs for anchor links
    h1: ({ children, ...props }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined
      return (
        <h1 id={id} className="scroll-mt-24" {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined
      return (
        <h2 id={id} className="scroll-mt-24" {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined
      return (
        <h3 id={id} className="scroll-mt-24" {...props}>
          {children}
        </h3>
      )
    },

    // Links with external detection
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

    // Images with Next.js optimization
    img: ({ src, alt, ...props }) => {
      if (!src) return null
      
      // Handle relative paths
      const imageSrc = src.startsWith('/') ? src : `/${src}`
      
      return (
        <Image
          src={imageSrc}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg"
          {...props}
        />
      )
    },

    // Code blocks with syntax highlighting
    pre: ({ children, ...props }) => {
      return (
        <pre
          className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm"
          {...props}
        >
          {children}
        </pre>
      )
    },

    // Inline code
    code: ({ children, ...props }) => {
      // Check if it's inside a pre (code block) or inline
      const isInPre = typeof props.className === 'string' && props.className.includes('language-')
      
      if (isInPre) {
        return <code {...props}>{children}</code>
      }
      
      return (
        <code
          className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    },

    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" {...props}>
          {children}
        </table>
      </div>
    ),

    th: ({ children, ...props }) => (
      <th
        className="px-4 py-2 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-900"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td className="px-4 py-2 text-sm" {...props}>
        {children}
      </td>
    ),

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Allow custom components
    ...components,
  }
}
