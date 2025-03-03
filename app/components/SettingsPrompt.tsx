'use client';

import Link from 'next/link';

interface SettingsPromptProps {
  type: 'apiKey' | 'calorieTarget';
}

export default function SettingsPrompt({ type }: SettingsPromptProps) {
  const isApiKey = type === 'apiKey';
  const bgColor = isApiKey ? 'bg-yellow-900/50' : 'bg-blue-900/50';
  const borderColor = isApiKey ? 'border-yellow-700' : 'border-blue-700';
  const textColor = isApiKey ? 'text-yellow-200' : 'text-blue-200';
  const linkColor = isApiKey
    ? 'text-yellow-400 hover:text-yellow-300'
    : 'text-blue-400 hover:text-blue-300';
  const message = isApiKey
    ? 'Please set your OpenAI API key in settings.'
    : 'Set your daily calorie target in settings to track your progress.';

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
