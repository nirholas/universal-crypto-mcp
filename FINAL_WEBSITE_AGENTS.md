

## Agent 2: Design System & Component Library

**Mission**: Build a production-grade component library with accessibility and performance baked in.

### Task 2.1: Base UI Components

**components/ui/button.tsx** - Accessible button with variants:

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white hover:bg-gray-900 active:scale-95',
        secondary: 'bg-white text-black border-2 border-gray-200 hover:border-black active:scale-95',
        ghost: 'hover:bg-gray-100 active:bg-gray-200',
        link: 'text-black underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**components/ui/card.tsx** - Flexible card component:

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-bold tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-gray-600', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
```

**components/ui/terminal.tsx** - Animated terminal:

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TerminalProps {
  lines: Array<{
    type: 'input' | 'output' | 'success' | 'error'
    content: string
    delay?: number
  }>
  className?: string
}

export function Terminal({ lines, className }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  
  useEffect(() => {
    if (visibleLines >= lines.length) return
    
    const delay = lines[visibleLines]?.delay || 500
    const timer = setTimeout(() => {
      setVisibleLines(v => v + 1)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [visibleLines, lines])
  
  return (
    <div className={cn('rounded-2xl bg-black overflow-hidden shadow-2xl', className)}>
      <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="p-6 font-mono text-sm">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={cn(
              'mb-2 animate-fade-in',
              line.type === 'input' && 'text-white',
              line.type === 'output' && 'text-gray-400',
              line.type === 'success' && 'text-green-400',
              line.type === 'error' && 'text-red-400'
            )}
          >
            {line.type === 'input' && <span className="text-green-400">$ </span>}
            {line.content}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-white animate-pulse" />
        )}
      </div>
    </div>
  )
}
```

**components/ui/code-block.tsx** - Syntax highlighted code:

```typescript
'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className={cn('group relative rounded-xl bg-gray-950 overflow-hidden', className)}>
      {filename && (
        <div className="px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-mono">
          {filename}
        </div>
      )}
      <button
        onClick={copyCode}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="p-6 overflow-x-auto">
        <code className={cn('text-sm font-mono', `language-${language}`)}>
          {code}
        </code>
      </pre>
    </div>
  )
}
```

### Task 2.2: Layout Components

**components/navigation/navbar.tsx** - Sticky navigation:

```typescript
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'Products',
    items: [
      { name: 'MCP Server', href: '/mcp-server', description: '380+ blockchain tools for AI' },
      { name: 'x402 Protocol', href: '/x402-protocol', description: 'AI agent payment protocol' },
      { name: 'x402-deploy', href: '/x402-deploy', description: '1-click API monetization' },
    ],
  },
  {
    name: 'Developers',
    items: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs/api-reference' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Playground', href: '/playground' },
    ],
  },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Showcase', href: '/showcase' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">◈</span>
            <span className="text-xl font-bold">Universal Crypto MCP</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              item.items ? (
                <DropdownMenu key={item.name} item={item} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-black',
                    pathname === item.href ? 'text-black' : 'text-gray-600'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/nirholas/universal-crypto-mcp">
                GitHub
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/docs/getting-started">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-6 space-y-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.items ? (
                  <>
                    <div className="font-semibold text-sm mb-2">{item.name}</div>
                    <div className="space-y-2 pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-gray-600 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="block font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function DropdownMenu({ item }: { item: any }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
        {item.name}
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border-2 border-gray-200 shadow-xl p-2">
          {item.items.map((subItem: any) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-semibold text-sm">{subItem.name}</div>
              {subItem.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {subItem.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Success Criteria

✅ Accessible button component with keyboard navigation  
✅ Card components with hover states  
✅ Animated terminal with typing effect  
✅ Code block with syntax highlighting and copy button  
✅ Responsive navbar with dropdown menus  
✅ Mobile menu with smooth transitions  
✅ All components use design tokens  
✅ 100% TypeScript coverage  
✅ WCAG 2.1 AA compliant  
✅ Performance: < 10ms render time per component

---


