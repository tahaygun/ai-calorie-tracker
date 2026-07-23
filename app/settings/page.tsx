'use client';

import { DEFAULT_IMAGE_PROMPT, DEFAULT_TEXT_PROMPT } from '@/lib/constants/prompts';
import { useSettings } from '@/lib/contexts/SettingsContext';
import React, { useState } from 'react';
import { FaCog, FaEye, FaEyeSlash, FaUndo } from 'react-icons/fa';
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
    <div className="min-h-screen text-slate-100 pb-12">
      <main className="mx-auto p-4 sm:p-6 max-w-2xl space-y-6">
        <div className="pb-4 border-b border-slate-800/80">
          <h1 className="font-bold text-2xl text-slate-100 flex items-center gap-2.5">
            <FaCog className="w-5 h-5 text-blue-400" />
            <span>Settings</span>
          </h1>
          <p className="text-xs text-slate-400">Configure your OpenAI credentials, targets, and custom AI prompts</p>
        </div>

        {/* Credentials & Goals Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-blue-400">Credentials & Daily Goals</h2>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block mb-1 font-semibold text-xs text-slate-300">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="apiKey"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 pr-10 text-sm outline-none font-mono"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-0 inset-y-0 flex items-center px-3 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Calorie Target */}
            <div>
              <label htmlFor="targetCalories" className="block mb-1 font-semibold text-xs text-slate-300">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                id="targetCalories"
                value={targetCalories || ''}
                onChange={e => setTargetCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-mono"
                placeholder="2000"
              />
            </div>

            {/* Target Weight */}
            <div>
              <label htmlFor="targetWeight" className="block mb-1 font-semibold text-xs text-slate-300">
                Target Weight (kg)
              </label>
              <input
                type="number"
                id="targetWeight"
                value={targetWeight || ''}
                onChange={e => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-mono"
                step="0.1"
                placeholder="75.0"
              />
            </div>
          </div>
        </div>

        {/* Model Selection Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-emerald-400">AI Model Configuration</h2>

          <div>
            <label htmlFor="model" className="block mb-1 font-semibold text-xs text-slate-300">
              OpenAI Model Choice
            </label>
            <select
              id="model"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-sans"
            >
              <option value="gpt-5.6-terra">GPT-5.6 Terra (Recommended)</option>
              <option value="gpt-5.6-luna">GPT-5.6 Luna (Lowest Cost)</option>
              <option value="gpt-5.6-sol">GPT-5.6 Sol (Highest Accuracy)</option>
              <option value="gpt-5.5">GPT-5.5 (Legacy)</option>
              <option value="gpt-5.4">GPT-5.4 (Legacy)</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>

          {selectedModel === 'custom' && (
            <div>
              <label htmlFor="customModel" className="block mb-1 font-semibold text-xs text-slate-300">
                Custom Model Identifier
              </label>
              <input
                type="text"
                id="customModel"
                value={customModelName}
                onChange={e => setCustomModelName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-mono"
                placeholder="ft:gpt-4o-mini..."
              />
            </div>
          )}
        </div>

        {/* Custom Prompts Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-purple-400">AI Prompt Customization</h2>

          {/* Text Prompt */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="textAnalysisPrompt" className="font-semibold text-xs text-slate-300">
                Text Analysis System Prompt
              </label>
              <button
                type="button"
                onClick={() => setTextAnalysisPrompt(DEFAULT_TEXT_PROMPT)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                title="Reset to default prompt"
              >
                <FaUndo className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
            <textarea
              id="textAnalysisPrompt"
              value={textAnalysisPrompt}
              onChange={e => setTextAnalysisPrompt(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-3 text-xs outline-none font-mono h-28"
              placeholder="Enter text analysis prompt..."
            />
          </div>

          {/* Image Prompt */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="imageAnalysisPrompt" className="font-semibold text-xs text-slate-300">
                Image Analysis System Prompt
              </label>
              <button
                type="button"
                onClick={() => setImageAnalysisPrompt(DEFAULT_IMAGE_PROMPT)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                title="Reset to default prompt"
              >
                <FaUndo className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
            <textarea
              id="imageAnalysisPrompt"
              value={imageAnalysisPrompt}
              onChange={e => setImageAnalysisPrompt(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-3 text-xs outline-none font-mono h-28"
              placeholder="Enter image analysis prompt..."
            />
          </div>

          {/* Debug Mode */}
          <div className="pt-2 border-t border-slate-800/80">
            <label htmlFor="debugMode" className="flex items-center text-xs text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                id="debugMode"
                checked={debugMode}
                onChange={e => setDebugMode(e.target.checked)}
                className="mr-2 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500/20"
              />
              Enable Debug Mode (Display raw token counts & OpenAI payload logs)
            </label>
          </div>
        </div>

        {/* Data Portability */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md">
          <DataPortability />
        </div>
      </main>
    </div>
  );
}
