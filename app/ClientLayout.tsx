'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import { getNotificationManager } from '@/lib/notificationManager';
import { useEffect } from 'react';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { reminders, notificationsEnabled } = useSettings();

  // Initialize notification system
  useEffect(() => {
    const notificationManager = getNotificationManager();

    // Only proceed if notifications are supported and enabled
    if (notificationManager.isSupported && notificationsEnabled) {
      // Register the service worker
      notificationManager.registerServiceWorker().then((success) => {
        if (success) {
          console.log('Notification service worker registered successfully');
          // Update reminders in the service worker
          notificationManager.updateReminders(reminders);
        }
      });
    }
  }, [notificationsEnabled]);

  // Update service worker when reminders change
  useEffect(() => {
    if (notificationsEnabled) {
      const notificationManager = getNotificationManager();
      notificationManager.updateReminders(reminders);
    }
  }, [reminders, notificationsEnabled]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navigation />
      <div className='flex-grow'>{children}</div>
      <Footer />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
