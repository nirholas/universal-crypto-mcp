import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { cn } from '@/lib/utils/cn'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://universal-crypto-mcp.com'),
  title: {
    default: 'Universal Crypto MCP - AI-Native Blockchain Infrastructure',
    template: '%s | Universal Crypto MCP',
  },
  description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization. Build, deploy, and monetize in 5 minutes.',
  keywords: [
    'AI blockchain',
    'MCP server',
    'Model Context Protocol',
    'x402 protocol',
    'API monetization',
    'crypto payments',
    'DeFi tools',
    'blockchain API',
    'Claude MCP',
    'ChatGPT plugins',
  ],
  authors: [{ name: 'Universal Crypto MCP Team' }],
  creator: 'Universal Crypto MCP',
  publisher: 'Universal Crypto MCP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://universal-crypto-mcp.com',
    title: 'Universal Crypto MCP - AI-Native Blockchain Infrastructure',
    description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization.',
    siteName: 'Universal Crypto MCP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Universal Crypto MCP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Crypto MCP - AI-Native Blockchain Infrastructure',
    description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization.',
    creator: '@nichxbt',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-white font-sans antialiased',
        inter.variable,
        jetbrainsMono.variable
      )}>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
