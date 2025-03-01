import { Reminder } from './contexts/SettingsContext';

// Type to represent various notification states
export type NotificationPermission = 'default' | 'denied' | 'granted';

// Interface for the notification manager
interface NotificationManager {
  isSupported: boolean;
  registerServiceWorker: () => Promise<boolean>;
  getPermissionStatus: () => NotificationPermission | null;
  requestPermission: () => Promise<NotificationPermission | null>;
  updateReminders: (reminders: Reminder[]) => void;
}

/**
 * Create and return a notification manager
 */
export function createNotificationManager(): NotificationManager {
  // Check if notifications are supported
  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator;

  let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Register the notification service worker
   */
  const registerServiceWorker = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      serviceWorkerRegistration = await navigator.serviceWorker.register(
        '/notification-worker.js'
      );

      // Setup listener for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'GET_REMINDERS') {
          // When service worker requests reminders, get from localStorage and send
          const storedReminders = localStorage.getItem('reminders');
          const reminders = storedReminders ? JSON.parse(storedReminders) : [];

          if (serviceWorkerRegistration?.active) {
            serviceWorkerRegistration.active.postMessage({
              type: 'UPDATE_REMINDERS',
              reminders,
            });
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to register notification service worker:', error);
      return false;
    }
  };

  /**
   * Get current notification permission status
   */
  const getPermissionStatus = (): NotificationPermission | null => {
    if (!isSupported) return null;
    return Notification.permission as NotificationPermission;
  };

  /**
   * Request notification permission
   */
  const requestPermission =
    async (): Promise<NotificationPermission | null> => {
      if (!isSupported) return null;

      try {
        const permission = await Notification.requestPermission();
        return permission as NotificationPermission;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
      }
    };

  /**
   * Update reminders in the service worker
   */
  const updateReminders = (reminders: Reminder[]): void => {
    if (!isSupported || !serviceWorkerRegistration?.active) return;

    // Send the reminder updates to the service worker
    serviceWorkerRegistration.active.postMessage({
      type: 'UPDATE_REMINDERS',
      reminders: reminders.filter((r) => r.enabled),
    });
  };

  return {
    isSupported,
    registerServiceWorker,
    getPermissionStatus,
    requestPermission,
    updateReminders,
  };
}

// Singleton instance for easy import throughout the app
let notificationManagerInstance: NotificationManager | null = null;

export function getNotificationManager(): NotificationManager {
  if (!notificationManagerInstance) {
    notificationManagerInstance = createNotificationManager();
  }
  return notificationManagerInstance;
}
