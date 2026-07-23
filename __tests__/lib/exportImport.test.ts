import { exportUserData, importUserData, validateUserData, UserData } from '@/lib/exportImport';
import { beforeEach, describe, expect, it } from 'vitest';

describe('exportImport utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('exportUserData', () => {
    it('should export stored settings, favorites, history, and weight entries from localStorage', () => {
      localStorage.setItem('openai_api_key', 'sk-testkey');
      localStorage.setItem('target_calories', '2200');
      localStorage.setItem('selected_model', 'gpt-5.6-sol');
      localStorage.setItem('custom_model', 'custom-1');
      localStorage.setItem('debug_mode', 'true');
      localStorage.setItem('target_weight', '70.5');
      localStorage.setItem('text_analysis_prompt', 'Custom prompt text');
      localStorage.setItem('image_analysis_prompt', 'Custom image prompt');
      localStorage.setItem(
        'favorite_meals',
        JSON.stringify([{ id: 'fav1', description: 'Fav Meal', items: [], timestamp: '2026-01-01' }])
      );
      localStorage.setItem(
        'meals_2026-07-24',
        JSON.stringify([{ id: 'm1', description: 'Oatmeal', items: [], timestamp: '2026-07-24' }])
      );
      localStorage.setItem(
        'weight_entries',
        JSON.stringify([{ id: 'w1', weight: 75.0, date: '2026-07-24' }])
      );

      const exported = exportUserData();

      expect(exported.settings.apiKey).toBe('sk-testkey');
      expect(exported.settings.targetCalories).toBe(2200);
      expect(exported.settings.selectedModel).toBe('gpt-5.6-sol');
      expect(exported.settings.customModelName).toBe('custom-1');
      expect(exported.settings.debugMode).toBe(true);
      expect(exported.settings.targetWeight).toBe(70.5);
      expect(exported.settings.textAnalysisPrompt).toBe('Custom prompt text');
      expect(exported.settings.imageAnalysisPrompt).toBe('Custom image prompt');
      expect(exported.favorites).toHaveLength(1);
      expect(exported.mealHistory['2026-07-24']).toHaveLength(1);
      expect(exported.weightEntries).toHaveLength(1);
    });

    it('should fall back to defaults when localStorage is empty', () => {
      const exported = exportUserData();
      expect(exported.settings.apiKey).toBe('');
      expect(exported.settings.targetCalories).toBe(0);
      expect(exported.settings.selectedModel).toBe('gpt-5.6-terra');
      expect(exported.settings.customModelName).toBe('');
      expect(exported.settings.debugMode).toBe(false);
      expect(exported.settings.targetWeight).toBe(0);
      expect(exported.favorites).toEqual([]);
      expect(exported.mealHistory).toEqual({});
      expect(exported.weightEntries).toEqual([]);
    });
  });

  describe('importUserData', () => {
    it('should import user data into localStorage without API key by default', () => {
      const payload: UserData = {
        settings: {
          apiKey: 'sk-should-not-import',
          targetCalories: 2500,
          selectedModel: 'gpt-5.6-luna',
          customModelName: '',
          debugMode: true,
          targetWeight: 80,
          textAnalysisPrompt: 'Imported text prompt',
          imageAnalysisPrompt: 'Imported image prompt',
        },
        favorites: [{ id: 'f1', description: 'Fav', items: [], timestamp: '2026-01-01' }],
        mealHistory: {
          '2026-07-20': [{ id: 'm1', description: 'Steak', items: [], timestamp: '2026-07-20' }],
        },
        weightEntries: [{ id: 'w1', weight: 81.2, date: '2026-07-20' }],
      };

      importUserData(payload);

      expect(localStorage.getItem('openai_api_key')).toBeNull();
      expect(localStorage.getItem('target_calories')).toBe('2500');
      expect(localStorage.getItem('selected_model')).toBe('gpt-5.6-luna');
      expect(localStorage.getItem('debug_mode')).toBe('true');
      expect(localStorage.getItem('target_weight')).toBe('80');
      expect(localStorage.getItem('text_analysis_prompt')).toBe('Imported text prompt');
      expect(localStorage.getItem('image_analysis_prompt')).toBe('Imported image prompt');
      expect(JSON.parse(localStorage.getItem('favorite_meals') || '[]')).toHaveLength(1);
      expect(JSON.parse(localStorage.getItem('meals_2026-07-20') || '[]')).toHaveLength(1);
      expect(JSON.parse(localStorage.getItem('weight_entries') || '[]')).toHaveLength(1);
    });

    it('should include API key when includeApiKey option is true', () => {
      const payload: UserData = {
        settings: {
          apiKey: 'sk-imported-key',
          targetCalories: 1800,
          selectedModel: 'gpt-5.6-terra',
          customModelName: '',
          debugMode: false,
          targetWeight: 65,
        },
        favorites: [],
        mealHistory: {},
        weightEntries: [],
      };

      importUserData(payload, { includeApiKey: true });

      expect(localStorage.getItem('openai_api_key')).toBe('sk-imported-key');
    });
  });

  describe('validateUserData', () => {
    it('should validate valid user data payloads', () => {
      const validData = {
        settings: {
          targetCalories: 2000,
          selectedModel: 'gpt-5.6-terra',
          customModelName: '',
          debugMode: false,
        },
        favorites: [],
        mealHistory: {},
      };

      const result = validateUserData(validData);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid or missing user data payloads', () => {
      expect(validateUserData(null).valid).toBe(false);
      expect(validateUserData('not-an-object').valid).toBe(false);
      expect(validateUserData({ settings: {} }).valid).toBe(false);
      expect(
        validateUserData({
          settings: {
            targetCalories: 'not-a-number',
            selectedModel: 'gpt-5.6-terra',
            customModelName: '',
            debugMode: false,
          },
          favorites: [],
          mealHistory: {},
        }).valid
      ).toBe(false);
    });
  });
});
