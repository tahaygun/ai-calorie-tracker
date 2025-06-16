'use client';

import { DEFAULT_IMAGE_PROMPT, DEFAULT_TEXT_PROMPT } from '@/lib/constants/prompts';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import DataPortability from '../components/DataPortability';

function SettingsPage() {
  const {
    targetCalories,
    setTargetCalories,
    selectedModel,
    setSelectedModel,
    debugMode,
    setDebugMode,
    targetWeight,
    setTargetWeight,
    textAnalysisPrompt,
    setTextAnalysisPrompt,
    imageAnalysisPrompt,
    setImageAnalysisPrompt,
  } = useSettings();

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="space-y-6 mx-auto p-4 max-w-2xl">
        <h1 className="mb-6 font-bold text-2xl">Settings</h1>

        {/* Calorie Target */}
        <div>
          <label htmlFor="targetCalories" className="block mb-1 font-medium text-sm">
            Daily Calorie Target
          </label>
          <input
            type="number"
            id="targetCalories"
            value={targetCalories || ''}
            onChange={e => setTargetCalories(parseInt(e.target.value) || 0)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
            placeholder="2000"
          />
        </div>

        {/* Target Weight */}
        <div>
          <label htmlFor="targetWeight" className="block mb-1 font-medium text-sm">
            Target Weight (kg)
          </label>
          <input
            type="number"
            id="targetWeight"
            value={targetWeight || ''}
            onChange={e => setTargetWeight(parseFloat(e.target.value) || 0)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
            step="0.1"
            placeholder="75.0"
          />
        </div>

        {/* Model Selection */}
        <div>
          <label htmlFor="model" className="block mb-1 font-medium text-sm">
            AI Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
          >
            <option value="gpt-4o-mini">gpt-4o-mini (Recommended)</option>
            <option value="gpt-4o">gpt-4o (Standard)</option>
            <option value="gpt-4.1">GPT-4.1 (Most Accurate)</option>
          </select>
          <p className="mt-1 text-gray-400 text-sm">
            Model selection affects analysis quality and processing speed.
          </p>
        </div>

        {/* Text Analysis Prompt */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="textAnalysisPrompt" className="font-medium text-sm">
              Text Analysis Prompt
            </label>
            <button
              onClick={() => setTextAnalysisPrompt(DEFAULT_TEXT_PROMPT)}
              className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 text-xs transition-colors"
              title="Reset to default prompt"
            >
              Reset
            </button>
          </div>
          <textarea
            id="textAnalysisPrompt"
            value={textAnalysisPrompt}
            onChange={e => setTextAnalysisPrompt(e.target.value)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full h-32 text-gray-100"
            placeholder="Enter the prompt for analyzing text descriptions"
          />
          <p className="mt-1 text-gray-400 text-sm">
            This prompt is used when analyzing meal descriptions. Leave empty to use the default
            prompt.
          </p>
        </div>

        {/* Image Analysis Prompt */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="imageAnalysisPrompt" className="font-medium text-sm">
              Image Analysis Prompt
            </label>
            <button
              onClick={() => setImageAnalysisPrompt(DEFAULT_IMAGE_PROMPT)}
              className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 text-xs transition-colors"
              title="Reset to default prompt"
            >
              Reset
            </button>
          </div>
          <textarea
            id="imageAnalysisPrompt"
            value={imageAnalysisPrompt}
            onChange={e => setImageAnalysisPrompt(e.target.value)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full h-32 text-gray-100"
            placeholder="Enter the prompt for analyzing food images"
          />
          <p className="mt-1 text-gray-400 text-sm">
            This prompt is used when analyzing food images. Leave empty to use the default prompt.
          </p>
        </div>

        {/* Debug Mode */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="debugMode"
            checked={debugMode}
            onChange={e => setDebugMode(e.target.checked)}
            className="bg-gray-700 border-gray-600 rounded focus:ring-blue-500 text-blue-500"
          />
          <label htmlFor="debugMode" className="font-medium text-sm">
            Debug Mode (Show raw AI response and token usage)
          </label>
        </div>

        {/* Data import/export */}
        <div className="pt-5 border-gray-700 border-t">
          <h2 className="mb-3 font-semibold text-lg">Data</h2>
          <DataPortability />
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  );
}