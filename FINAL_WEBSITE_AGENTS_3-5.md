

## Agent 5: Documentation Integration & Search

**Mission**: Integrate existing docs with powerful search and navigation.

### Task 5.1: Documentation Layout

**app/(docs)/docs/layout.tsx** - Docs-specific layout with sidebar:

```typescript
import { Sidebar } from './components/sidebar'
import { DocSearch } from './components/doc-search'
import { Breadcrumbs } from './components/breadcrumbs'
import { TableOfContents } from './components/table-of-contents'
import { EditOnGitHub } from './components/edit-on-github'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 fixed left-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-6">
          <DocSearch />
          <Sidebar />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 lg:mr-64">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Breadcrumbs />
          <article className="prose prose-lg max-w-none">
            {children}
          </article>
          <EditOnGitHub />
        </div>
      </main>
      
      {/* Table of Contents */}
      <aside className="hidden xl:block w-64 border-l border-gray-200 fixed right-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-6">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
```

### Task 5.2: Fast Document Search

**lib/docs/search.ts** - Algolia/MeiliSearch integration:

```typescript
import Fuse from 'fuse.js'

interface Doc {
  slug: string
  title: string
  content: string
  category: string
  keywords: string[]
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
    })
  }
  
  search(query: string, limit = 10) {
    const results = this.fuse.search(query, { limit })
    return results.map(result => ({
      ...result.item,
      score: result.score,
      matches: result.matches,
    }))
  }
  
  searchByCategory(category: string) {
    return this.docs.filter(doc => doc.category === category)
  }
}

// Build search index at build time
export async function buildSearchIndex() {
  const docs = await getAllDocs()
  return new DocSearch(docs)
}

// API route for search
export async function searchDocs(query: string) {
  const searchIndex = await buildSearchIndex()
  return searchIndex.search(query)
}
```

### Task 5.3: Dynamic Doc Pages

**app/(docs)/docs/[[...slug]]/page.tsx** - Load markdown docs:

```typescript
import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocs } from '@/lib/docs/loader'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from './mdx-components'

export async function generateStaticParams() {
  const docs = await getAllDocs()
  return docs.map(doc => ({
    slug: doc.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join('/') || 'index'
  const doc = await getDocBySlug(slug)
  
  if (!doc) return {}
  
  return {
    title: `${doc.title} - Universal Crypto MCP Docs`,
    description: doc.description,
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
      <h1>{doc.title}</h1>
      {doc.description && (
        <p className="text-xl text-gray-600 mb-8">{doc.description}</p>
      )}
      <MDXRemote source={doc.content} components={components} />
    </>
  )
}
```

### Success Criteria

✅ Three-column docs layout (sidebar, content, TOC)  
✅ Fast client-side search with Fuse.js  
✅ Breadcrumb navigation  
✅ Table of contents with active section highlighting  
✅ MDX rendering with custom components  
✅ Syntax highlighting for all languages  
✅ Copy buttons on code blocks  
✅ "Edit on GitHub" links  
✅ Mobile-responsive sidebar  
✅ Keyboard shortcuts (Cmd+K for search)

---

*[Continue to FINAL_WEBSITE_AGENTS_6-10.md for remaining agents...]*

