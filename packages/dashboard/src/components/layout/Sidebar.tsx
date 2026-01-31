import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  Network,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Networks', href: '/networks', icon: Network },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile sidebar */}
      <div
        className={clsx(
          'lg:hidden fixed inset-0 z-40 transition-opacity',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={clsx(
            'absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="h-16 flex items-center px-6 border-b dark:border-gray-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              x402 Dashboard
            </span>
          </div>
          <NavContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
        <div className="h-16 flex items-center px-6 border-b dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            x402 Dashboard
          </span>
        </div>
        <NavContent />
      </div>
    </>
  );
}
