import { AuthProvider } from '@/lib/contexts/AuthContext';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import { Analytics } from '@vercel/analytics/react';
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
  metadataBase: new URL('https://ai-calorietracker.vercel.app'),
  title: {
    default: 'AI Calorie Tracker - Smart Nutrition Tracking',
    template: '%s | AI Calorie Tracker',
  },
  description:
    'AI-powered calorie tracker with smart food analysis. Track your daily calories and nutrition with advanced AI technology. Secure user accounts and personalized tracking.',
  manifest: '/manifest.json',
  keywords: [
    'calorie tracker',
    'AI nutrition analysis',
    'food tracker',
    'diet tracker',
    'nutrition calculator',
    'meal planner',
    'AI food analysis',
    'personalized nutrition',
    'smart calorie counting',
  ],
  authors: [{ name: 'tahaygun', url: 'https://github.com/tahaygun' }],
  creator: 'tahaygun',
  openGraph: {
    type: 'website',
    title: 'AI Calorie Tracker - Smart Nutrition Tracking',
    description:
      'AI-powered calorie tracker with smart food analysis. Track your daily calories and nutrition with advanced AI technology.',
    url: 'https://ai-calorietracker.vercel.app',
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
    title: 'AI Calorie Tracker - Smart Nutrition Tracking',
    description:
      'AI-powered calorie tracker with smart food analysis. Track your daily calories and nutrition with advanced AI technology.',
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
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        <AuthProvider>
          <SettingsProvider>
            <ClientLayout>{children}</ClientLayout>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}