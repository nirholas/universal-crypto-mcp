/**
 * Payments Section Layout
 * 
 * Shared layout for all payment-related pages with navigation sidebar
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  FileText,
  Settings,
  BarChart3,
  Bell,
  ShoppingCart,
  History,
  Menu,
  X,
  Home,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/history', label: 'Transaction History', icon: History },
  { href: '/invoices', label: 'Invoices', icon: FileText },
];

const secondaryNavItems: NavItem[] = [
  { href: '/checkout', label: 'Checkout', icon: ShoppingCart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// ============================================
// Layout
// ============================================

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Payments</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2">
              Main
            </div>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2">
              Other
            </div>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">Account</div>
                <div className="text-xs text-gray-500">Manage profile</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Payments</span>
          </Link>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
