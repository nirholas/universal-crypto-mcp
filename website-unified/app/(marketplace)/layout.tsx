import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Service Marketplace | Universal Crypto MCP',
  description: 'Discover, subscribe, and use AI services with crypto payments. Access trading signals, data APIs, analytics, and more.',
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Marketplace Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 font-bold text-gray-900">
              <span className="text-2xl">🏪</span>
              <span>AI Marketplace</span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="/marketplace/discover"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                Discover
              </a>
              <a
                href="/marketplace/categories"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                Categories
              </a>
              <a
                href="/marketplace/trending"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                Trending
              </a>
              <a
                href="/marketplace/provider/dashboard"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                For Providers
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/marketplace/subscriptions"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-black sm:block"
            >
              My Subscriptions
            </a>
            <button
              type="button"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold text-gray-900">Marketplace</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/marketplace/discover" className="text-sm text-gray-600 hover:text-black">Discover</a></li>
                <li><a href="/marketplace/categories" className="text-sm text-gray-600 hover:text-black">Categories</a></li>
                <li><a href="/marketplace/trending" className="text-sm text-gray-600 hover:text-black">Trending</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Providers</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/marketplace/provider/register" className="text-sm text-gray-600 hover:text-black">Register Service</a></li>
                <li><a href="/marketplace/provider/dashboard" className="text-sm text-gray-600 hover:text-black">Dashboard</a></li>
                <li><a href="/marketplace/docs" className="text-sm text-gray-600 hover:text-black">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/docs" className="text-sm text-gray-600 hover:text-black">API Docs</a></li>
                <li><a href="/community" className="text-sm text-gray-600 hover:text-black">Community</a></li>
                <li><a href="/support" className="text-sm text-gray-600 hover:text-black">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/terms" className="text-sm text-gray-600 hover:text-black">Terms</a></li>
                <li><a href="/privacy" className="text-sm text-gray-600 hover:text-black">Privacy</a></li>
                <li><a href="/marketplace/disputes" className="text-sm text-gray-600 hover:text-black">Disputes</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            © 2026 Universal Crypto MCP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
