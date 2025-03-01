'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import Link from 'next/link';
import DataPortability from '../components/DataPortability';

export default function SettingsPage() {
  const {
    apiKey,
    setApiKey,
    targetCalories,
    setTargetCalories,
    selectedModel,
    setSelectedModel,
    customModelName,
    setCustomModelName,
    debugMode,
    setDebugMode,
  } = useSettings();

  return (
    <div className='mx-auto p-6 max-w-2xl'>
      <div className='space-y-5 bg-gray-800 shadow-lg p-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold text-xl'>Settings</h1>
          <Link
            href='/'
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors'
          >
            Back to Tracker
          </Link>
        </div>

        <div>
          <label htmlFor='apiKey' className='block mb-1 font-medium text-sm'>
            OpenAI API Key
          </label>
          <input
            type='password'
            id='apiKey'
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
            placeholder='sk-...'
          />
          <p className='mt-1 text-gray-400 text-xs'>
            Your API key is stored locally in your browser and never sent to our
            servers.
          </p>
        </div>

        <div>
          <label
            htmlFor='targetCalories'
            className='block mb-1 font-medium text-sm'
          >
            Daily Calorie Target
          </label>
          <input
            type='number'
            id='targetCalories'
            value={targetCalories || ''}
            onChange={(e) => setTargetCalories(parseInt(e.target.value) || 0)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
            placeholder='2000'
          />
        </div>

        <div>
          <label htmlFor='model' className='block mb-1 font-medium text-sm'>
            OpenAI Model
          </label>
          <select
            id='model'
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
          >
            <option value='gpt-4o-mini'>gpt-4o-mini (Mini, Recommended)</option>
            <option value='gpt-4o'>gpt-4o (Standard)</option>
            <option value='gpt-3.5-turbo'>
              GPT-3.5 Turbo (Faster, cheaper)
            </option>
            <option value='gpt-4'>GPT-4</option>
            <option value='custom'>Custom Model</option>
          </select>
        </div>

        {selectedModel === 'custom' && (
          <div>
            <label
              htmlFor='customModel'
              className='block mb-1 font-medium text-sm'
            >
              Custom Model Name
            </label>
            <input
              type='text'
              id='customModel'
              value={customModelName}
              onChange={(e) => setCustomModelName(e.target.value)}
              className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
              placeholder='Enter custom model name'
            />
          </div>
        )}

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='debugMode'
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className='bg-gray-700 border-gray-600 rounded focus:ring-blue-500 text-blue-500'
          />
          <label htmlFor='debugMode' className='font-medium text-sm'>
            Debug Mode (Show raw OpenAI response and token usage)
          </label>
        </div>

        {/* Data import/export */}
        <div className='pt-5 border-gray-700 border-t'>
          <h2 className='mb-3 font-semibold text-lg'>Data</h2>
          <DataPortability />
        </div>
      </div>
    </div>
  );
}
