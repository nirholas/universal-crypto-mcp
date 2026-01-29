import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocSlugs } from '@/lib/docs/loader'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from '../components/mdx-components'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs()
  return slugs.map(slug => ({
    slug: slug.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join('/') || 'index'
  const doc = await getDocBySlug(slug)
  
  if (!doc) return {}
  
  return {
    title: `${doc.title} - Universal Crypto MCP Docs`,
    description: doc.description || doc.content.substring(0, 160),
    keywords: doc.keywords,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: doc.title,
      description: doc.description,
    },
  }
}

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join('/') || 'index'
  const doc = await getDocBySlug(slug)
  
  if (!doc) {
    notFound()
  }
  
  return (
    <>
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {doc.description}
          </p>
        )}
        {doc.metadata.date && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: {new Date(doc.metadata.date).toLocaleDateString()}
          </p>
        )}
      </header>
      
      {/* MDX Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <MDXRemote
          source={doc.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: 'wrap',
                    properties: {
                      className: ['anchor'],
                    },
                  },
                ],
                [
                  rehypePrettyCode,
                  {
                    theme: 'github-dark',
                    keepBackground: false,
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </>
  )
}
