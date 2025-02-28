import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className='bg-gray-800 border-b border-gray-700'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='flex space-x-4 h-14'>
          <Link
            href='/'
            className={`inline-flex items-center px-3 ${
              pathname === '/' ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'
            }`}
          >
            Today
          </Link>
          <Link
            href='/history'
            className={`inline-flex items-center px-3 ${
              pathname === '/history' ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'
            }`}
          >
            History
          </Link>
          <Link
            href='/about'
            className={`inline-flex items-center px-3 ${
              pathname === '/about' ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
