'use client';

import Footer from './components/Footer';
import Navigation from './components/Navigation';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />
      <div className='flex-grow'>{children}</div>
      <Footer />
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
