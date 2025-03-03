'use client';

import {
  DEFAULT_IMAGE_PROMPT,
  DEFAULT_TEXT_PROMPT,
} from '@/lib/constants/prompts';
import { useSettings } from '@/lib/contexts/SettingsContext';
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
    targetWeight,
    setTargetWeight,
    textAnalysisPrompt,
    setTextAnalysisPrompt,
    imageAnalysisPrompt,
    setImageAnalysisPrompt,
  } = useSettings();

  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className='bg-gray-900 min-h-screen text-gray-100'>
      <div className='space-y-6 mx-auto p-4 max-w-2xl'>
        <h1 className='mb-6 font-bold text-2xl'>Settings</h1>

        {/* API Key */}
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
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Calorie Target */}
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

        {/* Target Weight */}
        <div>
          <label
            htmlFor='targetWeight'
            className='block mb-1 font-medium text-sm'
          >
            Target Weight (kg)
          </label>
          <input
            type='number'
            id='targetWeight'
            value={targetWeight || ''}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
            step='0.1'
            placeholder='75.0'
          />
        </div>

        {/* Model Selection */}
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

        {/* Custom Model Name */}
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

        {/* Text Analysis Prompt */}
        <div>
          <div className='flex justify-between items-center mb-1'>
            <label htmlFor='textAnalysisPrompt' className='font-medium text-sm'>
              Text Analysis Prompt
            </label>
            <button
              onClick={() => setTextAnalysisPrompt(DEFAULT_TEXT_PROMPT)}
              className='bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 text-xs transition-colors'
              title='Reset to default prompt'
            >
              Reset
            </button>
          </div>
          <textarea
            id='textAnalysisPrompt'
            value={textAnalysisPrompt}
            onChange={(e) => setTextAnalysisPrompt(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full h-32 text-gray-100'
            placeholder='Enter the prompt for analyzing text descriptions'
          />
          <p className='mt-1 text-gray-400 text-sm'>
            This prompt is used when analyzing meal descriptions. Leave empty to
            use the default prompt.
          </p>
        </div>

        {/* Image Analysis Prompt */}
        <div>
          <div className='flex justify-between items-center mb-1'>
            <label
              htmlFor='imageAnalysisPrompt'
              className='font-medium text-sm'
            >
              Image Analysis Prompt
            </label>
            <button
              onClick={() => setImageAnalysisPrompt(DEFAULT_IMAGE_PROMPT)}
              className='bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 text-xs transition-colors'
              title='Reset to default prompt'
            >
              Reset
            </button>
          </div>
          <textarea
            id='imageAnalysisPrompt'
            value={imageAnalysisPrompt}
            onChange={(e) => setImageAnalysisPrompt(e.target.value)}
            className='bg-gray-700 p-2 border border-gray-600 rounded w-full h-32 text-gray-100'
            placeholder='Enter the prompt for analyzing food images'
          />
          <p className='mt-1 text-gray-400 text-sm'>
            This prompt is used when analyzing food images. Leave empty to use
            the default prompt.
          </p>
        </div>

        {/* Debug Mode */}
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
