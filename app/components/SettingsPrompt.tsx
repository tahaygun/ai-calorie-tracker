'use client';

import Link from 'next/link';
import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface SettingsPromptProps {
  type: 'apiKey' | 'calorieTarget';
}

export default function SettingsPrompt({ type }: SettingsPromptProps) {
  const isApiKey = type === 'apiKey';
  const containerStyle = isApiKey
    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
    : 'bg-blue-500/10 border-blue-500/30 text-blue-200';
  const linkStyle = isApiKey
    ? 'text-amber-400 hover:text-amber-300'
    : 'text-blue-400 hover:text-blue-300';
  const message = isApiKey
    ? 'Please configure your OpenAI API key in settings to enable meal analysis.'
    : 'Set your daily calorie target in settings to track progress.';

  return (
    <div className={`p-4 border rounded-2xl ${containerStyle} flex items-center justify-between gap-3 shadow-md backdrop-blur-sm`}>
      <div className="flex items-center gap-2.5 text-xs font-medium">
        {isApiKey ? <FaExclamationTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <FaInfoCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
        <span>{message}</span>
      </div>
      <Link
        href="/settings"
        className={`px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-semibold ${linkStyle} transition-all whitespace-nowrap active:scale-[0.97]`}
      >
        Settings
      </Link>
    </div>
  );
}
