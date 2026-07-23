import SettingsPage from '@/app/settings/page';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render settings form elements and toggle API key visibility', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();

    const apiKeyInput = screen.getByLabelText('OpenAI API Key') as HTMLInputElement;
    expect(apiKeyInput.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /Show API key/i });
    fireEvent.click(toggleButton);

    expect(apiKeyInput.type).toBe('text');
  });

  it('should update calorie target and weight target inputs', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    const calorieInput = screen.getByLabelText('Daily Calorie Target (kcal)') as HTMLInputElement;
    const weightInput = screen.getByLabelText('Target Weight (kg)') as HTMLInputElement;

    fireEvent.change(calorieInput, { target: { value: '2500' } });
    fireEvent.change(weightInput, { target: { value: '82.5' } });

    expect(calorieInput.value).toBe('2500');
    expect(weightInput.value).toBe('82.5');
    expect(localStorage.getItem('target_calories')).toBe('2500');
    expect(localStorage.getItem('target_weight')).toBe('82.5');
  });
});
