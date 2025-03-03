import { MealEntry, WeightEntry } from '@/lib/types';

export interface UserData {
  settings: {
    apiKey: string;
    targetCalories: number;
    selectedModel: string;
    customModelName: string;
    debugMode: boolean;
    targetWeight: number;
  };
  favorites: MealEntry[];
  mealHistory: Record<string, MealEntry[]>;
  weightEntries: WeightEntry[];
  [key: string]: unknown; // Add index signature
}

/**
 * Exports all user data from localStorage
 */
export function exportUserData(): UserData {
  // Get all localStorage keys
  const keys = Object.keys(localStorage);

  // Extract meal history (keys like 'meals_2023-01-01')
  const mealKeys = keys.filter(key => key.startsWith('meals_'));
  const mealHistory: Record<string, MealEntry[]> = {};

  mealKeys.forEach(key => {
    const date = key.replace('meals_', '');
    const meals = JSON.parse(localStorage.getItem(key) || '[]') as MealEntry[];
    mealHistory[date] = meals;
  });

  // Extract settings
  const apiKey = localStorage.getItem('openai_api_key') || '';
  const targetCalories = parseInt(localStorage.getItem('target_calories') || '0');
  const selectedModel = localStorage.getItem('selected_model') || 'gpt-4o-mini';
  const customModelName = localStorage.getItem('custom_model') || '';
  const debugMode = localStorage.getItem('debug_mode') === 'true';
  const targetWeight = parseFloat(localStorage.getItem('target_weight') || '0');

  // Extract favorites
  const favorites = JSON.parse(localStorage.getItem('favorite_meals') || '[]') as MealEntry[];

  // Extract weight entries
  const weightEntries = JSON.parse(localStorage.getItem('weight_entries') || '[]') as WeightEntry[];

  return {
    settings: {
      apiKey,
      targetCalories,
      selectedModel,
      customModelName,
      debugMode,
      targetWeight,
    },
    favorites,
    mealHistory,
    weightEntries,
  };
}

/**
 * Imports user data into localStorage
 */
export function importUserData(userData: UserData, options = { includeApiKey: false }): void {
  // Import settings
  if (options.includeApiKey) {
    localStorage.setItem('openai_api_key', userData.settings.apiKey);
  }

  localStorage.setItem('target_calories', userData.settings.targetCalories.toString());
  localStorage.setItem('selected_model', userData.settings.selectedModel);
  localStorage.setItem('custom_model', userData.settings.customModelName);
  localStorage.setItem('debug_mode', userData.settings.debugMode.toString());

  // Import target weight if present (handling backward compatibility)
  if ('targetWeight' in userData.settings) {
    localStorage.setItem('target_weight', userData.settings.targetWeight.toString());
  }

  // Import favorites
  localStorage.setItem('favorite_meals', JSON.stringify(userData.favorites));

  // Import meal history
  Object.entries(userData.mealHistory).forEach(([date, meals]) => {
    localStorage.setItem(`meals_${date}`, JSON.stringify(meals));
  });

  // Import weight entries if present (handling backward compatibility)
  if ('weightEntries' in userData) {
    localStorage.setItem('weight_entries', JSON.stringify(userData.weightEntries));
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
      typeof settings.customModelName !== 'string' ||
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
