'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import Link from 'next/link';
import { useState } from 'react';
import DataPortability from '../components/DataPortability';

export default function SettingsPage() {
  const {
    apiKey,
    setApiKey,
    targetCalories,
    setTargetCalories,
    selectedModel,
    setSelectedModel,
    customModelName,
    setCustomModelName,
    debugMode,
    setDebugMode,
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useSettings();

  const [newReminderTime, setNewReminderTime] = useState('12:00');
  const [newReminderDays, setNewReminderDays] = useState([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ]);
  const [newReminderMessage, setNewReminderMessage] = useState(
    'Time to log your calories!'
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const daysOfWeek = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' },
  ];

  const handleDayToggle = (day: string) => {
    setNewReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddReminder = () => {
    if (newReminderTime) {
      addReminder({
        time: newReminderTime,
        days: newReminderDays,
        enabled: true,
        message: newReminderMessage || 'Time to log your calories!',
      });
      setShowAddForm(false);
      setNewReminderTime('12:00');
      setNewReminderDays([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ]);
      setNewReminderMessage('Time to log your calories!');
    }
  };

  const handleToggleReminder = (id: string, enabled: boolean) => {
    updateReminder(id, { enabled });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  };

  // Format time for display (convert 24h to 12h format)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format days for display
  const formatDays = (days: string[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 0) return 'Never';
    if (
      days.length === 5 &&
      days.includes('monday') &&
      days.includes('tuesday') &&
      days.includes('wednesday') &&
      days.includes('thursday') &&
      days.includes('friday')
    )
      return 'Weekdays';
    if (
      days.length === 2 &&
      days.includes('saturday') &&
      days.includes('sunday')
    )
      return 'Weekends';

    return days
      .map((day) => daysOfWeek.find((d) => d.id === day)?.label)
      .join(', ');
  };

  return (
    <div className='mx-auto p-6 max-w-2xl'>
      <div className='space-y-5 bg-gray-800 shadow-lg p-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold text-xl'>Settings</h1>
          <Link
            href='/'
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors'
          >
            Back to Tracker
          </Link>
        </div>

        <div>
          <label htmlFor='apiKey' className='block mb-1 font-medium text-sm'>
            OpenAI API Key
          </label>
          <input
            type='password'
            id='apiKey'
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
            placeholder='sk-...'
          />
          <p className='mt-1 text-gray-400 text-xs'>
            Your API key is stored locally in your browser and never sent to our
            servers.
          </p>
        </div>

        <div>
          <label
            htmlFor='targetCalories'
            className='block mb-1 font-medium text-sm'
          >
            Daily Calorie Target
          </label>
          <input
            type='number'
            id='targetCalories'
            value={targetCalories || ''}
            onChange={(e) => setTargetCalories(parseInt(e.target.value) || 0)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
            placeholder='2000'
          />
        </div>

        <div>
          <label htmlFor='model' className='block mb-1 font-medium text-sm'>
            OpenAI Model
          </label>
          <select
            id='model'
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
          >
            <option value='gpt-4o-mini'>gpt-4o-mini (Mini, Recommended)</option>
            <option value='gpt-4o'>gpt-4o (Standard)</option>
            <option value='gpt-3.5-turbo'>
              GPT-3.5 Turbo (Faster, cheaper)
            </option>
            <option value='gpt-4'>GPT-4</option>
            <option value='custom'>Custom Model</option>
          </select>
        </div>

        {selectedModel === 'custom' && (
          <div>
            <label
              htmlFor='customModel'
              className='block mb-1 font-medium text-sm'
            >
              Custom Model Name
            </label>
            <input
              type='text'
              id='customModel'
              value={customModelName}
              onChange={(e) => setCustomModelName(e.target.value)}
              className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
              placeholder='Enter custom model name'
            />
          </div>
        )}

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='debugMode'
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className='bg-gray-700 border-gray-600 rounded focus:ring-blue-500 text-blue-500'
          />
          <label htmlFor='debugMode' className='font-medium text-sm'>
            Debug Mode (Show raw OpenAI response and token usage)
          </label>
        </div>

        {/* Reminders Section */}
        <div className='pt-5 border-gray-700 border-t'>
          <h2 className='mb-3 font-semibold text-lg'>Reminders</h2>

          <div className='flex items-center gap-2 mb-4'>
            <input
              type='checkbox'
              id='notificationsEnabled'
              checked={notificationsEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  requestNotificationPermission();
                } else {
                  setNotificationsEnabled(false);
                }
              }}
              className='bg-gray-700 border-gray-600 rounded focus:ring-blue-500 text-blue-500'
            />
            <label
              htmlFor='notificationsEnabled'
              className='font-medium text-sm'
            >
              Enable Notifications
            </label>
          </div>

          {notificationsEnabled && (
            <>
              {/* List existing reminders */}
              {reminders.length > 0 && (
                <div className='space-y-2 mb-4'>
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className='flex justify-between items-center bg-gray-700 p-3 rounded'
                    >
                      <div>
                        <div className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={reminder.enabled}
                            onChange={(e) =>
                              handleToggleReminder(
                                reminder.id,
                                e.target.checked
                              )
                            }
                            className='bg-gray-700 border-gray-600 rounded focus:ring-blue-500 text-blue-500'
                          />
                          <span className='font-medium'>
                            {formatTime(reminder.time)}
                          </span>
                        </div>
                        <div className='text-gray-400 text-sm'>
                          {formatDays(reminder.days)}
                        </div>
                        <div className='mt-1 text-sm'>{reminder.message}</div>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className='text-red-400 hover:text-red-300 text-sm'
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add reminder button/form */}
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full text-sm transition-colors'
                >
                  Add Reminder
                </button>
              ) : (
                <div className='space-y-3 bg-gray-700 p-4 rounded'>
                  <div>
                    <label
                      htmlFor='reminderTime'
                      className='block mb-1 font-medium text-sm'
                    >
                      Time
                    </label>
                    <input
                      type='time'
                      id='reminderTime'
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
                    />
                  </div>

                  <div>
                    <label className='block mb-1 font-medium text-sm'>
                      Days
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.id}
                          type='button'
                          onClick={() => handleDayToggle(day.id)}
                          className={`px-2 py-1 rounded text-xs ${
                            newReminderDays.includes(day.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='reminderMessage'
                      className='block mb-1 font-medium text-sm'
                    >
                      Message
                    </label>
                    <input
                      type='text'
                      id='reminderMessage'
                      value={newReminderMessage}
                      onChange={(e) => setNewReminderMessage(e.target.value)}
                      placeholder='Time to log your calories!'
                      className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
                    />
                  </div>

                  <div className='flex justify-end gap-2'>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className='bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReminder}
                      className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm'
                    >
                      Save Reminder
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Data Portability Section */}
      <div className='bg-gray-800 shadow-lg mt-5 p-6 rounded-lg'>
        <h2 className='mb-3 font-semibold text-lg'>Data Portability</h2>
        <DataPortability />
      </div>
    </div>
  );
}
