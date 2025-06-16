'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
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
  const { user } = useAuth();
  const [targetCalories, setTargetCalories] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [debugMode, setDebugMode] = useState(false);
  const [targetWeight, setTargetWeight] = useState(0);
  const [textAnalysisPrompt, setTextAnalysisPrompt] = useState(
    `Analyze the following meal description and provide nutritional information for each item. Combine them if you think they are the same item. If it is a meal, combine them and provide the nutritional information for the meal. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Estimate the grams of each item if it is not mentioned. Be precise and realistic with the values. If the description is not clear, provide the best guess.`
  );
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState(
    `Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. If it is a meal, combine them and provide the nutritional information for the meal as one item, don't split into ingredients. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Be precise and realistic with the values. Estimate the grams of each item if it is not mentioned.`
  );

  // Initialize values from localStorage when user is available
  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    const storedCalories = localStorage.getItem(`target_calories_${userId}`);
    const storedModel = localStorage.getItem(`selected_model_${userId}`) || 'gpt-4o-mini';
    const storedDebugMode = localStorage.getItem(`debug_mode_${userId}`) === 'true';
    const storedTargetWeight = localStorage.getItem(`target_weight_${userId}`);
    const storedTextPrompt = localStorage.getItem(`text_analysis_prompt_${userId}`);
    const storedImagePrompt = localStorage.getItem(`image_analysis_prompt_${userId}`);

    setTargetCalories(storedCalories ? parseInt(storedCalories) : 0);
    setSelectedModel(storedModel);
    setDebugMode(storedDebugMode);
    setTargetWeight(storedTargetWeight ? parseFloat(storedTargetWeight) : 0);
    if (storedTextPrompt) setTextAnalysisPrompt(storedTextPrompt);
    if (storedImagePrompt) setImageAnalysisPrompt(storedImagePrompt);
  }, [user]);

  // Save settings whenever they change
  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    localStorage.setItem(`target_calories_${userId}`, targetCalories.toString());
    localStorage.setItem(`selected_model_${userId}`, selectedModel);
    localStorage.setItem(`debug_mode_${userId}`, debugMode.toString());
    localStorage.setItem(`target_weight_${userId}`, targetWeight.toString());
    localStorage.setItem(`text_analysis_prompt_${userId}`, textAnalysisPrompt);
    localStorage.setItem(`image_analysis_prompt_${userId}`, imageAnalysisPrompt);
  }, [
    user,
    targetCalories,
    selectedModel,
    debugMode,
    targetWeight,
    textAnalysisPrompt,
    imageAnalysisPrompt,
  ]);

  return (
    <SettingsContext.Provider
      value={{
        targetCalories,
        setTargetCalories,
        selectedModel,
        setSelectedModel,
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