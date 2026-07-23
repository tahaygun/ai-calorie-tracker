import WeightPage from '@/app/weight/page';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('WeightPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render weight tracker page header and log form', async () => {
    render(
      <SettingsProvider>
        <WeightPage />
      </SettingsProvider>
    );

    expect(screen.getByText('Weight Tracker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText(/Log Weight Entry/i)).toBeInTheDocument();
    expect(screen.getByText('Weight Log History')).toBeInTheDocument();
  });
});
