'use client'

import React from 'react'
import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { name: 'MCP Server', href: '/mcp-server' },
      { name: 'x402 Protocol', href: '/x402-protocol' },
      { name: 'x402-deploy', href: '/x402-deploy' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Changelog', href: 'https://github.com/nirholas/universal-crypto-mcp/blob/main/CHANGELOG.md' },
    ],
  },
  developers: {
    title: 'Developers',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs/api-reference' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Playground', href: '/playground' },
      { name: 'GitHub', href: 'https://github.com/nirholas/universal-crypto-mcp' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { name: 'Developers', href: '/developers' },
      { name: 'Showcase', href: '/showcase' },
      { name: 'Discord', href: 'https://discord.gg/x402' },
      { name: 'Twitter', href: 'https://twitter.com/nichxbt' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Use Cases', href: '/use-cases' },
      { name: 'Security', href: 'https://github.com/nirholas/universal-crypto-mcp/blob/main/SECURITY.md' },
      { name: 'License', href: 'https://github.com/nirholas/universal-crypto-mcp/blob/main/LICENSE' },
      { name: 'Contact', href: 'mailto:hello@x402.dev' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">◈</span>
              <div>
                <div className="font-semibold text-gray-900">Universal Crypto MCP</div>
                <div className="text-sm text-gray-600">
                  © {new Date().getFullYear()} All rights reserved.
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/nirholas/universal-crypto-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com/nichxbt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:hello@x402.dev"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-gray-900 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
