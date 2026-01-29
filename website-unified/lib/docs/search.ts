import Fuse from 'fuse.js'

export interface Doc {
  slug: string
  title: string
  content: string
  description?: string
  category: string
  keywords: string[]
}

export interface SearchMatch {
  indices: [number, number][]
  value?: string
  key?: string
}

export interface SearchResult extends Doc {
  score?: number
  matches?: readonly Fuse.FuseResultMatch[]
}

class DocSearch {
  private fuse: Fuse<Doc>
  private docs: Doc[]
  
  constructor(docs: Doc[]) {
    this.docs = docs
    this.fuse = new Fuse(docs, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'keywords', weight: 0.3 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    })
  }
  
  search(query: string, limit = 10): SearchResult[] {
    if (!query.trim()) return []
    
    const results = this.fuse.search(query, { limit })
    return results.map(result => ({
      ...result.item,
      score: result.score,
      matches: result.matches,
    }))
  }
  
  searchByCategory(category: string): Doc[] {
    return this.docs.filter(doc => doc.category === category)
  }
  
  getAllCategories(): string[] {
    return [...new Set(this.docs.map(doc => doc.category))]
  }
  
  getDocBySlug(slug: string): Doc | undefined {
    return this.docs.find(doc => doc.slug === slug)
  }
}

// Singleton instance
let searchInstance: DocSearch | null = null

// Build search index at build time
export async function buildSearchIndex(): Promise<DocSearch> {
  if (searchInstance) {
    return searchInstance
  }
  
  const docs = await getAllDocs()
  searchInstance = new DocSearch(docs)
  return searchInstance
}

// Get all docs from the loader
async function getAllDocs(): Promise<Doc[]> {
  // Import dynamically to avoid circular dependencies
  const { getAllDocs: loadAllDocs } = await import('./loader')
  return loadAllDocs()
}

// API route handler for search
export async function searchDocs(query: string, limit = 10): Promise<SearchResult[]> {
  const searchIndex = await buildSearchIndex()
  return searchIndex.search(query, limit)
}

// Search by category
export async function searchDocsByCategory(category: string): Promise<Doc[]> {
  const searchIndex = await buildSearchIndex()
  return searchIndex.searchByCategory(category)
}

// Get all available categories
export async function getAllCategories(): Promise<string[]> {
  const searchIndex = await buildSearchIndex()
  return searchIndex.getAllCategories()
}

// Get single doc by slug
export async function getDocBySlug(slug: string): Promise<Doc | undefined> {
  const searchIndex = await buildSearchIndex()
  return searchIndex.getDocBySlug(slug)
}
