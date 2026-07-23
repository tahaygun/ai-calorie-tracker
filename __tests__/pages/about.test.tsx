import AboutPage from '@/app/about/page';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AboutPage', () => {
  it('should render about title and main content sections', () => {
    render(<AboutPage />);

    expect(screen.getByText('About AI Calorie Tracker')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('100% Privacy-First')).toBeInTheDocument();
    expect(screen.getByText('Weight Progress Analytics')).toBeInTheDocument();
    expect(screen.getByText('Open Source Project')).toBeInTheDocument();
    expect(screen.getByText(/combine text and image/i)).toBeInTheDocument();

    const githubLink = screen.getByRole('link', { name: /View GitHub Repository/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/tahaygun/ai-calorie-tracker');
  });
});
