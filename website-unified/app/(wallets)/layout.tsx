/**
 * Wallet Dashboard Layout
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import React from 'react';

export default function WalletsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {children}
    </div>
  );
}
