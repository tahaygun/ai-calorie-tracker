import Home from '@/app/page';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Home (Dashboard) Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render settings prompts when API key and target calories are missing', () => {
    render(
      <SettingsProvider>
        <Home />
      </SettingsProvider>
    );

    expect(
      screen.getByText('Please configure your OpenAI API key in settings to enable meal analysis.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Set your daily calorie target in settings to track progress.')
    ).toBeInTheDocument();
  });

  it('should render meal form when API key is set', () => {
    localStorage.setItem('openai_api_key', 'sk-testkey');
    localStorage.setItem('target_calories', '2000');

    render(
      <SettingsProvider>
        <Home />
      </SettingsProvider>
    );

    expect(screen.getByLabelText('What did you eat?')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g., 2 eggs, 1 slice of toast with butter, 1 apple')
    ).toBeInTheDocument();
  });
});
