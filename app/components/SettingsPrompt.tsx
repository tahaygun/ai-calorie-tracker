'use client';

import Link from 'next/link';

interface SettingsPromptProps {
  type: 'calorieTarget';
}

export default function SettingsPrompt({ type }: SettingsPromptProps) {
  const bgColor = 'bg-blue-900/50';
  const borderColor = 'border-blue-700';
  const textColor = 'text-blue-200';
  const linkColor = 'text-blue-400 hover:text-blue-300';
  const message = 'Set your daily calorie target in settings to track your progress.';

  return (
    <div className={`mb-4 p-3 ${bgColor} border ${borderColor} rounded`}>
      <p className={`text-sm ${textColor}`}>
        {message}{' '}
        <Link href="/settings" className={`${linkColor} underline`}>
          Open Settings
        </Link>
      </p>
    </div>
  );
}