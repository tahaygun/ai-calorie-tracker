// Notification Service Worker
// This worker handles scheduling and sending notifications even when the app is offline

// Store for active notification timers
const activeTimers = new Map();

// IndexedDB setup
const DB_NAME = 'calorieTrackerDB';
const STORE_NAME = 'reminders';
let db;

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Save reminders to IndexedDB
async function saveRemindersToIndexedDB(reminders) {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing reminders
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      // Add each reminder
      if (Array.isArray(reminders)) {
        reminders.forEach((reminder) => {
          if (reminder.enabled) {
            store.add(reminder);
          }
        });
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    };
  });
}

// Get reminders from IndexedDB
async function getRemindersFromIndexedDB() {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_REMINDERS') {
    // Save reminders to IndexedDB and update active timers
    saveRemindersToIndexedDB(event.data.reminders)
      .then(() => updateReminders(event.data.reminders))
      .catch((error) => console.error('Error saving reminders:', error));
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Focus on the main app window or open if closed
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Function to update reminders when settings change
function updateReminders(reminders) {
  // Clear all existing timers
  for (const [id, timer] of activeTimers.entries()) {
    clearInterval(timer);
    activeTimers.delete(id);
  }

  // Set up new timers for each enabled reminder
  if (Array.isArray(reminders)) {
    reminders.forEach((reminder) => {
      if (reminder.enabled) {
        scheduleReminder(reminder);
      }
    });
  }
}

// Function to schedule a reminder
function scheduleReminder(reminder) {
  const checkInterval = 60 * 1000; // Check every minute

  const timer = setInterval(() => {
    const now = new Date();

    // Check if reminder should trigger right now
    if (shouldTriggerReminder(reminder, now)) {
      showNotification(reminder);
    }
  }, checkInterval);

  activeTimers.set(reminder.id, timer);
}

// Function to determine if a reminder should trigger now
function shouldTriggerReminder(reminder, now) {
  // Get day of week (lowercase)
  const dayOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][now.getDay()];

  // Check if current day is in the reminder days
  if (!reminder.days.includes(dayOfWeek)) {
    return false;
  }

  // Parse reminder time
  const [reminderHours, reminderMinutes] = reminder.time.split(':').map(Number);

  // Check if current time matches reminder time (within the minute)
  return (
    now.getHours() === reminderHours && now.getMinutes() === reminderMinutes
  );
}

// Function to show a notification
function showNotification(reminder) {
  self.registration.showNotification('Calorie Tracker Reminder', {
    body: reminder.message || 'Time to log your calories!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      timestamp: new Date().getTime(),
      reminderId: reminder.id,
    },
  });
}

// Initial setup when service worker activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    initDB()
      .then(() => self.clients.claim())
      .then(() => {
        // Try to get clients first
        return self.clients.matchAll().then((clients) => {
          if (clients.length > 0) {
            // If clients exist, request reminders from main thread
            clients[0].postMessage({ type: 'GET_REMINDERS' });
            return Promise.resolve();
          } else {
            // If no clients, load reminders from IndexedDB
            return getRemindersFromIndexedDB().then((reminders) => {
              if (reminders && reminders.length > 0) {
                updateReminders(reminders);
              }
            });
          }
        });
      })
  );
});

// Periodically check for reminders (backup mechanism)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-reminders') {
    event.waitUntil(
      getRemindersFromIndexedDB().then((reminders) => {
        if (reminders && reminders.length > 0) {
          updateReminders(reminders);
        }
      })
    );
  }
});
