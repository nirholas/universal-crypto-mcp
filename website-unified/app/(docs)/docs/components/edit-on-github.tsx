'use client'

import { usePathname } from 'next/navigation'
import { Github } from 'lucide-react'

const GITHUB_REPO = 'nirholas/universal-crypto-mcp'
const DOCS_PATH = 'docs/content'

export function EditOnGitHub() {
  const pathname = usePathname()
  
  // Convert pathname to file path
  const filePath = pathname
    .replace('/docs', '')
    .replace(/\/$/, '')
  
  const githubUrl = `https://github.com/${GITHUB_REPO}/edit/main/${DOCS_PATH}${filePath || '/index'}.md`

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Github className="w-4 h-4" />
        Edit this page on GitHub
      </a>
    </div>
  )
}
