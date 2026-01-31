import { clsx } from 'clsx';
import { Moon, Sun, Bell, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
            isConnected
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          )}
        >
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
    </header>
  );
}
