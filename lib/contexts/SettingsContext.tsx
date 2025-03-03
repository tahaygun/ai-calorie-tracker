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
  targetWeight: number;
  setTargetWeight: (weight: number) => void;
  textAnalysisPrompt: string;
  setTextAnalysisPrompt: (prompt: string) => void;
  imageAnalysisPrompt: string;
  setImageAnalysisPrompt: (prompt: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [targetCalories, setTargetCalories] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [customModelName, setCustomModelName] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [targetWeight, setTargetWeight] = useState(0);
  const [textAnalysisPrompt, setTextAnalysisPrompt] = useState(
    `Analyze the following meal description and provide nutritional information for each item. Combine them if you think they are the same item. If it is a meal, combine them and provide the nutritional information for the meal. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Estimate the grams of each item if it is not mentioned. Be precise and realistic with the values. If the description is not clear, provide the best guess.`
  );
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState(
    `Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. If it is a meal, combine them and provide the nutritional information for the meal as one item, don't split into ingredients. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Be precise and realistic with the values. Estimate the grams of each item if it is not mentioned.`
  );

  // Initialize values from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key') || '';
    const storedCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model') || 'gpt-4o-mini';
    const storedCustomModel = localStorage.getItem('custom_model') || '';
    const storedDebugMode = localStorage.getItem('debug_mode') === 'true';
    const storedTargetWeight = localStorage.getItem('target_weight');
    const storedTextPrompt = localStorage.getItem('text_analysis_prompt');
    const storedImagePrompt = localStorage.getItem('image_analysis_prompt');

    setApiKey(storedApiKey);
    setTargetCalories(storedCalories ? parseInt(storedCalories) : 0);
    setSelectedModel(storedModel);
    setCustomModelName(storedCustomModel);
    setDebugMode(storedDebugMode);
    setTargetWeight(storedTargetWeight ? parseFloat(storedTargetWeight) : 0);
    if (storedTextPrompt) setTextAnalysisPrompt(storedTextPrompt);
    if (storedImagePrompt) setImageAnalysisPrompt(storedImagePrompt);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('custom_model', customModelName);
    localStorage.setItem('debug_mode', debugMode.toString());
    localStorage.setItem('target_weight', targetWeight.toString());
    localStorage.setItem('text_analysis_prompt', textAnalysisPrompt);
    localStorage.setItem('image_analysis_prompt', imageAnalysisPrompt);
  }, [
    apiKey,
    targetCalories,
    selectedModel,
    customModelName,
    debugMode,
    targetWeight,
    textAnalysisPrompt,
    imageAnalysisPrompt,
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
