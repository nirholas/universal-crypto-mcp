import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { Doc } from './search'

const DOCS_PATH = path.join(process.cwd(), '../docs/content')

export interface DocMetadata {
  title: string
  description?: string
  category?: string
  keywords?: string[]
  order?: number
  published?: boolean
  author?: string
  date?: string
}

export interface DocWithContent extends Doc {
  metadata: DocMetadata
}

/**
 * Get all documentation files recursively
 */
async function getDocFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          return getDocFiles(fullPath)
        }
        return entry.name.endsWith('.md') || entry.name.endsWith('.mdx')
          ? [fullPath]
          : []
      })
    )
    return files.flat()
  } catch (error) {
    console.error('Error reading docs directory:', error)
    return []
  }
}

/**
 * Convert file path to slug
 */
function filePathToSlug(filePath: string): string {
  const relativePath = path.relative(DOCS_PATH, filePath)
  return relativePath
    .replace(/\.(md|mdx)$/, '')
    .replace(/\\/g, '/')
    .replace(/\/index$/, '')
    .replace(/^\//, '')
}

/**
 * Parse a markdown file and extract metadata
 */
async function parseDocFile(filePath: string): Promise<DocWithContent | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    const metadata = data as DocMetadata
    
    // Skip unpublished docs in production
    if (process.env.NODE_ENV === 'production' && metadata.published === false) {
      return null
    }

    const slug = filePathToSlug(filePath)
    
    return {
      slug,
      title: metadata.title || slug,
      description: metadata.description,
      content,
      category: metadata.category || 'General',
      keywords: metadata.keywords || [],
      metadata,
    }
  } catch (error) {
    console.error(`Error parsing doc file ${filePath}:`, error)
    return null
  }
}

/**
 * Get all documentation pages
 */
export async function getAllDocs(): Promise<Doc[]> {
  const docFiles = await getDocFiles(DOCS_PATH)
  const docs = await Promise.all(docFiles.map(parseDocFile))
  
  return docs
    .filter((doc): doc is DocWithContent => doc !== null)
    .sort((a, b) => {
      // Sort by order if specified, otherwise alphabetically
      const orderA = a.metadata.order ?? 999
      const orderB = b.metadata.order ?? 999
      if (orderA !== orderB) {
        return orderA - orderB
      }
      return a.title.localeCompare(b.title)
    })
}

/**
 * Get a single doc by slug
 */
export async function getDocBySlug(slug: string): Promise<DocWithContent | null> {
  // Handle index page
  if (!slug || slug === 'index') {
    const indexPath = path.join(DOCS_PATH, 'index.md')
    try {
      return await parseDocFile(indexPath)
    } catch {
      const indexMdxPath = path.join(DOCS_PATH, 'index.mdx')
      return await parseDocFile(indexMdxPath)
    }
  }

  // Try both .md and .mdx extensions
  const mdPath = path.join(DOCS_PATH, `${slug}.md`)
  const mdxPath = path.join(DOCS_PATH, `${slug}.mdx`)
  const indexMdPath = path.join(DOCS_PATH, slug, 'index.md')
  const indexMdxPath = path.join(DOCS_PATH, slug, 'index.mdx')

  for (const filePath of [mdPath, mdxPath, indexMdPath, indexMdxPath]) {
    try {
      return await parseDocFile(filePath)
    } catch {
      continue
    }
  }

  return null
}

/**
 * Get all doc slugs for static generation
 */
export async function getAllDocSlugs(): Promise<string[]> {
  const docs = await getAllDocs()
  return docs.map(doc => doc.slug)
}

/**
 * Get docs by category
 */
export async function getDocsByCategory(category: string): Promise<Doc[]> {
  const docs = await getAllDocs()
  return docs.filter(doc => doc.category === category)
}
