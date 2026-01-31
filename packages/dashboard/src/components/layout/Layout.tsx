import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  isConnected: boolean;
}

export function Layout({ children, isConnected }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:pl-64">
        <Header isConnected={isConnected} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
