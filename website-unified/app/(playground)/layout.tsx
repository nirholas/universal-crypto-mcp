/**
 * Playground Layout - Provides navigation and structure for the playground section
 * @module app/(playground)/layout
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export const metadata = {
  title: 'MCP Tool Playground | Universal Crypto MCP',
  description: 'Interactive playground for exploring and testing 380+ MCP crypto tools',
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link 
                href="/playground" 
                className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                MCP Playground
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/playground" label="Home" />
                <NavLink href="/tools" label="Tools" />
                <NavLink href="/workflows" label="Workflows" />
                <NavLink href="/sdk" label="SDK" />
                <NavLink href="/workspace" label="Workspace" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/docs"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/nirholas/universal-crypto-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      {label}
    </Link>
  );
}
