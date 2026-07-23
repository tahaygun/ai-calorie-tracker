import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Today' },
  { href: '/history', label: 'History' },
  { href: '/weight', label: 'Weight' },
  { href: '/about', label: 'About' },
  { href: '/settings', label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20">
      <div className="mx-auto px-4 max-w-2xl">
        <div className="flex justify-between items-center h-14">
          <nav className="flex space-x-1 sm:space-x-2">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent opacity-90 hidden sm:block">
            AI Calorie Tracker
          </div>
        </div>
      </div>
    </header>
  );
}
