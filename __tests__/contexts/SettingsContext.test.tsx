import { SettingsProvider, useSettings } from '@/lib/contexts/SettingsContext';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('SettingsContext & SettingsProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should throw error when useSettings is used outside SettingsProvider', () => {
    expect(() => renderHook(() => useSettings())).toThrow(
      'useSettings must be used within a SettingsProvider'
    );
  });

  it('should provide default settings and update values via setters', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SettingsProvider>{children}</SettingsProvider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.apiKey).toBe('');
    expect(result.current.selectedModel).toBe('gpt-5.6-terra');
    expect(result.current.targetCalories).toBe(0);

    act(() => {
      result.current.setApiKey('sk-new-api-key');
      result.current.setTargetCalories(2300);
      result.current.setTargetWeight(72.5);
      result.current.setSelectedModel('gpt-5.6-sol');
    });

    expect(result.current.apiKey).toBe('sk-new-api-key');
    expect(result.current.targetCalories).toBe(2300);
    expect(result.current.targetWeight).toBe(72.5);
    expect(result.current.selectedModel).toBe('gpt-5.6-sol');

    expect(localStorage.getItem('openai_api_key')).toBe('sk-new-api-key');
    expect(localStorage.getItem('target_calories')).toBe('2300');
    expect(localStorage.getItem('target_weight')).toBe('72.5');
    expect(localStorage.getItem('selected_model')).toBe('gpt-5.6-sol');
  });
});
