'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
  showApiKeyPrompt: boolean;
  setShowApiKeyPrompt: (prompt: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || '';
    }
    return '';
  });

  const [targetCalories, setTargetCalories] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('target_calories');
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  });

  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected_model') || 'gpt-4o-mini';
    }
    return 'gpt-4o-mini';
  });

  const [customModelName, setCustomModelName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('custom_model') || '';
    }
    return '';
  });

  const [debugMode, setDebugMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('debug_mode') === 'true';
    }
    return false;
  });

  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(() => !apiKey);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('custom_model', customModelName);
    localStorage.setItem('debug_mode', debugMode.toString());
  }, [apiKey, targetCalories, selectedModel, customModelName, debugMode]);

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
        showApiKeyPrompt,
        setShowApiKeyPrompt,
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
