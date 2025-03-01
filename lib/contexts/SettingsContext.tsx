'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  targetWeight: number;
  setTargetWeight: (weight: number) => void;
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
  const [targetWeight, setTargetWeight] = useState(0);

  // Initialize values from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key') || '';
    const storedCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model') || 'gpt-4o-mini';
    const storedCustomModel = localStorage.getItem('custom_model') || '';
    const storedDebugMode = localStorage.getItem('debug_mode') === 'true';
    const storedTargetWeight = localStorage.getItem('target_weight');

    setApiKey(storedApiKey);
    setTargetCalories(storedCalories ? parseInt(storedCalories) : 0);
    setSelectedModel(storedModel);
    setCustomModelName(storedCustomModel);
    setDebugMode(storedDebugMode);
    setTargetWeight(storedTargetWeight ? parseFloat(storedTargetWeight) : 0);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('custom_model', customModelName);
    localStorage.setItem('debug_mode', debugMode.toString());
    localStorage.setItem('target_weight', targetWeight.toString());
  }, [
    apiKey,
    targetCalories,
    selectedModel,
    customModelName,
    debugMode,
    targetWeight,
  ]);

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
        targetWeight,
        setTargetWeight,
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
