import { MealEntry, WeightEntry } from '@/lib/types';

export interface UserData {
  settings: {
    targetCalories: number;
    selectedModel: string;
    debugMode: boolean;
    targetWeight: number;
    textAnalysisPrompt?: string;
    imageAnalysisPrompt?: string;
  };
  favorites: MealEntry[];
  mealHistory: Record<string, MealEntry[]>;
  weightEntries: WeightEntry[];
  [key: string]: unknown;
}

/**
 * Exports all user data from localStorage for a specific user
 */
export function exportUserData(userId: string): UserData {
  // Get all localStorage keys
  const keys = Object.keys(localStorage);

  // Extract meal history (keys like 'meals_userId_2023-01-01')
  const mealKeys = keys.filter(key => key.startsWith(`meals_${userId}_`));
  const mealHistory: Record<string, MealEntry[]> = {};

  mealKeys.forEach(key => {
    const date = key.replace(`meals_${userId}_`, '');
    const meals = JSON.parse(localStorage.getItem(key) || '[]') as MealEntry[];
    mealHistory[date] = meals;
  });

  // Extract settings
  const targetCalories = parseInt(localStorage.getItem(`target_calories_${userId}`) || '0');
  const selectedModel = localStorage.getItem(`selected_model_${userId}`) || 'gpt-4o-mini';
  const debugMode = localStorage.getItem(`debug_mode_${userId}`) === 'true';
  const targetWeight = parseFloat(localStorage.getItem(`target_weight_${userId}`) || '0');
  const textAnalysisPrompt = localStorage.getItem(`text_analysis_prompt_${userId}`) || undefined;
  const imageAnalysisPrompt = localStorage.getItem(`image_analysis_prompt_${userId}`) || undefined;

  // Extract favorites
  const favorites = JSON.parse(localStorage.getItem(`favorite_meals_${userId}`) || '[]') as MealEntry[];

  // Extract weight entries
  const weightEntries = JSON.parse(localStorage.getItem(`weight_entries_${userId}`) || '[]') as WeightEntry[];

  return {
    settings: {
      targetCalories,
      selectedModel,
      debugMode,
      targetWeight,
      textAnalysisPrompt,
      imageAnalysisPrompt,
    },
    favorites,
    mealHistory,
    weightEntries,
  };
}

/**
 * Imports user data into localStorage for a specific user
 */
export function importUserData(userData: UserData, userId: string): void {
  // Import settings
  localStorage.setItem(`target_calories_${userId}`, userData.settings.targetCalories.toString());
  localStorage.setItem(`selected_model_${userId}`, userData.settings.selectedModel);
  localStorage.setItem(`debug_mode_${userId}`, userData.settings.debugMode.toString());

  // Import target weight if present
  if ('targetWeight' in userData.settings) {
    localStorage.setItem(`target_weight_${userId}`, userData.settings.targetWeight.toString());
  }

  // Import prompt settings if available
  if (userData.settings.textAnalysisPrompt) {
    localStorage.setItem(`text_analysis_prompt_${userId}`, userData.settings.textAnalysisPrompt);
  }

  if (userData.settings.imageAnalysisPrompt) {
    localStorage.setItem(`image_analysis_prompt_${userId}`, userData.settings.imageAnalysisPrompt);
  }

  // Import favorites
  localStorage.setItem(`favorite_meals_${userId}`, JSON.stringify(userData.favorites));

  // Import meal history
  Object.entries(userData.mealHistory).forEach(([date, meals]) => {
    localStorage.setItem(`meals_${userId}_${date}`, JSON.stringify(meals));
  });

  // Import weight entries if present
  if ('weightEntries' in userData) {
    localStorage.setItem(`weight_entries_${userId}`, JSON.stringify(userData.weightEntries));
  }
}

/**
 * Validates imported user data
 */
export function validateUserData(data: unknown): {
  valid: boolean;
  message?: string;
} {
  if (!data || typeof data !== 'object' || data === null) {
    return { valid: false, message: 'No data provided or invalid data type' };
  }

  try {
    // Check for required top-level properties
    const userData = data as Record<string, unknown>;
    if (!('settings' in userData) || !('favorites' in userData) || !('mealHistory' in userData)) {
      return {
        valid: false,
        message: 'Invalid data format: missing required sections',
      };
    }

    // Check settings structure
    const settings = userData.settings as Record<string, unknown>;
    if (
      typeof settings.targetCalories !== 'number' ||
      typeof settings.selectedModel !== 'string' ||
      typeof settings.debugMode !== 'boolean'
    ) {
      return { valid: false, message: 'Invalid settings format' };
    }

    // Basic validation is sufficient - the app can handle some inconsistency
    return { valid: true };
  } catch (error) {
    return { valid: false, message: 'Error validating data: ' + String(error) };
  }
}