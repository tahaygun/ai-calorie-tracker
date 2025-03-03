import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 border-gray-700 border-b">
      <div className="mx-auto px-2 sm:px-4 max-w-2xl">
        <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 h-auto min-h-14">
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
      </div>
    </nav>
  );
}
