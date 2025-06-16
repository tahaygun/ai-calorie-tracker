'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Navigation() {
  const pathname = usePathname();
  const { user, userProfile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 border-gray-700 border-b">
      <div className="mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="flex justify-between items-center h-14">
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
              href="/subscription"
              className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm ${
                pathname === '/subscription'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Subscription
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

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm"
            >
              <FiUser className="h-5 w-5 mr-2" />
              <span className="hidden sm:block">
                {userProfile?.displayName || user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="sm:hidden">
                {(userProfile?.displayName || user?.email?.split('@')[0] || 'User').slice(0, 1).toUpperCase()}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{userProfile?.displayName || 'User'}</div>
                  <div className="text-gray-500">{user?.email}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {userProfile?.subscription.tier.toUpperCase()} Plan
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/usage"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  API Usage
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="inline h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}
