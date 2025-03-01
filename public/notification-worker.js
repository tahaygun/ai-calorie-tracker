// Notification Service Worker
// This worker handles scheduling and sending notifications even when the app is offline

// Store for active notification timers
const activeTimers = new Map();

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_REMINDERS') {
    updateReminders(event.data.reminders);
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
    // Get reminders from storage and set them up
    self.registration.active &&
      self.clients.claim().then(() => {
        // Request reminders from main thread if available
        self.clients.matchAll().then((clients) => {
          if (clients.length > 0) {
            clients[0].postMessage({
              type: 'GET_REMINDERS',
            });
          }
        });
      })
  );
});
