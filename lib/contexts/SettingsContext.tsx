'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (_key: string) => void;
  targetCalories: number;
  setTargetCalories: (_calories: number) => void;
  selectedModel: string;
  setSelectedModel: (_model: string) => void;
  customModelName: string;
  setCustomModelName: (_name: string) => void;
  debugMode: boolean;
  setDebugMode: (_debug: boolean) => void;
  targetWeight: number;
  setTargetWeight: (_weight: number) => void;
  textAnalysisPrompt: string;
  setTextAnalysisPrompt: (_prompt: string) => void;
  imageAnalysisPrompt: string;
  setImageAnalysisPrompt: (_prompt: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultTextPrompt = `Analyze the following meal description and provide nutritional information for each item. Combine them if you think they are the same item. If it is a meal, combine them and provide the nutritional information for the meal. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Estimate the grams of each item if it is not mentioned. Be precise and realistic with the values. If the description is not clear, provide the best guess.`;

const defaultImagePrompt = `Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. If it is a meal, combine them and provide the nutritional information for the meal as one item, don't split into ingredients. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Be precise and realistic with the values. Estimate the grams of each item if it is not mentioned.`;

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useLocalStorage<string>('openai_api_key', '');
  const [targetCalories, setTargetCalories] = useLocalStorage<number>('target_calories', 0);
  const [selectedModel, setSelectedModel] = useLocalStorage<string>('selected_model', 'gpt-5.6-terra');
  const [customModelName, setCustomModelName] = useLocalStorage<string>('custom_model', '');
  const [debugMode, setDebugMode] = useLocalStorage<boolean>('debug_mode', false);
  const [targetWeight, setTargetWeight] = useLocalStorage<number>('target_weight', 0);
  const [textAnalysisPrompt, setTextAnalysisPrompt] = useLocalStorage<string>(
    'text_analysis_prompt',
    defaultTextPrompt
  );
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useLocalStorage<string>(
    'image_analysis_prompt',
    defaultImagePrompt
  );

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
        textAnalysisPrompt,
        setTextAnalysisPrompt,
        imageAnalysisPrompt,
        setImageAnalysisPrompt,
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
