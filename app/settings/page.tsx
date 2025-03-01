'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import Link from 'next/link';
import { useState } from 'react';
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

  const [showApiKey, setShowApiKey] = useState(false);

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
          <div className='relative'>
            <input
              type={showApiKey ? 'text' : 'password'}
              id='apiKey'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className='bg-gray-700 p-2 pr-10 border border-gray-600 rounded w-full text-gray-100'
              placeholder='sk-...'
            />
            <button
              type='button'
              onClick={() => setShowApiKey(!showApiKey)}
              className='right-0 absolute inset-y-0 flex items-center px-3 text-gray-400 hover:text-gray-200 transition-colors'
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-5 h-5'
                >
                  <path d='M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z' />
                  <path d='M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z' />
                  <path d='M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z' />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-5 h-5'
                >
                  <path d='M12 15a3 3 0 100-6 3 3 0 000 6z' />
                  <path
                    fillRule='evenodd'
                    d='M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </button>
          </div>
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
