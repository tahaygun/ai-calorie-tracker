'use client';

import Footer from './components/Footer';
import Navigation from './components/Navigation';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
