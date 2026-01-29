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
      <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-6">
          <DocSearch />
          <Sidebar />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 lg:mr-64">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Breadcrumbs />
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {children}
          </article>
          <EditOnGitHub />
        </div>
      </main>
      
      {/* Table of Contents */}
      <aside className="hidden xl:block w-64 border-l border-gray-200 dark:border-gray-800 fixed right-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-6">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
