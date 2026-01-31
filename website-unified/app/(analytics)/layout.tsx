import type { Metadata } from 'next';
import Link from 'next/link';
import { AnalyticsProvider } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Comprehensive portfolio analytics, market data, and DeFi tracking for your crypto assets.',
};

const navigationItems = [
  { href: '/dashboard', label: 'Portfolio', icon: '📊' },
  { href: '/market', label: 'Market', icon: '📈' },
  { href: '/defi', label: 'DeFi', icon: '🌾' },
  { href: '/transactions', label: 'Transactions', icon: '📝' },
  { href: '/alerts', label: 'Alerts', icon: '🔔' },
];

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                <span className="font-bold text-xl text-gray-900">Crypto Analytics</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Navigation Toggle */}
              <button
                type="button"
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Universal Crypto MCP. Real-time data powered by CoinGecko & DeFiLlama.
            </p>
          </div>
        </footer>
      </div>
    </AnalyticsProvider>
  );
}
