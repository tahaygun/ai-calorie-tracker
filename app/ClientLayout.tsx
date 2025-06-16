'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import AuthGuard from './components/AuthGuard';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  
  // Don't show navigation and footer on auth page
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap auth page with AuthGuard
  if (pathname === '/auth') {
    return <RootLayoutInner>{children}</RootLayoutInner>;
  }

  return (
    <AuthGuard>
      <RootLayoutInner>{children}</RootLayoutInner>
    </AuthGuard>
  );
}
