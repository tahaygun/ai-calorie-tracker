'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface Reminder {
  id: string;
  time: string; // Format: "HH:MM"
  days: string[]; // Days of week: "monday", "tuesday", etc.
  enabled: boolean;
  message: string;
}

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  customModelName: string;
  setCustomModelName: (name: string) => void;
  debugMode: boolean;
  setDebugMode: (debug: boolean) => void;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Omit<Reminder, 'id'>>) => void;
  deleteReminder: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [targetCalories, setTargetCalories] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [customModelName, setCustomModelName] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Initialize values from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key') || '';
    const storedCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model') || 'gpt-4o-mini';
    const storedCustomModel = localStorage.getItem('custom_model') || '';
    const storedDebugMode = localStorage.getItem('debug_mode') === 'true';
    const storedReminders = localStorage.getItem('reminders');

    setApiKey(storedApiKey);
    setTargetCalories(storedCalories ? parseInt(storedCalories) : 0);
    setSelectedModel(storedModel);
    setCustomModelName(storedCustomModel);
    setDebugMode(storedDebugMode);
    setReminders(storedReminders ? JSON.parse(storedReminders) : []);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('custom_model', customModelName);
    localStorage.setItem('debug_mode', debugMode.toString());
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [
    apiKey,
    targetCalories,
    selectedModel,
    customModelName,
    debugMode,
    reminders,
  ]);

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
    };
    setReminders((prev) => [...prev, newReminder]);
  };

  const updateReminder = (
    id: string,
    reminderUpdate: Partial<Omit<Reminder, 'id'>>
  ) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...reminderUpdate } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
