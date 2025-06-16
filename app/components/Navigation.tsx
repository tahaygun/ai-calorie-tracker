'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 border-gray-700 border-b">
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
        <div className="flex flex-wrap justify-between items-center space-x-2 sm:space-x-4 h-auto min-h-14">
          <div className="flex space-x-2 sm:space-x-4">
            <Link
              href="/"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Today
            </Link>
            <Link
              href="/history"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/history'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              History
            </Link>
            <Link
              href="/weight"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/weight'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Weight
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/about'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/settings"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/settings'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Settings
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm hidden sm:inline">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-2 py-1 text-sm"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}