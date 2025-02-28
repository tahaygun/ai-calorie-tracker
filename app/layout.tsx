import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://calorie-tracker-ai.vercel.app'),
  title: {
    default: 'Free AI Calorie Tracker - No Account Needed',
    template: '%s | Free AI Calorie Tracker',
  },
  description:
    'Free, open-source calorie tracker powered by AI. Track your daily calories and nutrition with advanced food analysis. No account or signup required.',
  manifest: '/manifest.json',
  keywords: [
    'calorie tracker',
    'free calorie counter',
    'AI nutrition analysis',
    'food tracker',
    'diet tracker',
    'nutrition calculator',
    'meal planner',
    'open source calorie tracker',
    'no account calorie tracker',
    'AI food analysis',
  ],
  authors: [{ name: 'tahaygun', url: 'https://github.com/tahaygun' }],
  creator: 'tahaygun',
  openGraph: {
    type: 'website',
    title: 'Free AI Calorie Tracker - No Account Needed',
    description: 'Free, open-source calorie tracker powered by AI. Track your daily calories and nutrition instantly.',
    url: 'https://calorie-tracker-ai.vercel.app',
    siteName: 'AI Calorie Tracker',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'AI Calorie Tracker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Calorie Tracker - No Account Needed',
    description: 'Free, open-source calorie tracker powered by AI. Track your daily calories and nutrition instantly.',
    images: ['/icons/icon-512x512.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Calorie Tracker',
  },
  icons: {
    icon: '/icons/icon-512x512.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SettingsProvider>
          <ClientLayout>{children}</ClientLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}
