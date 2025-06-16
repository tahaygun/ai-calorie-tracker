'use client';

import { DEFAULT_IMAGE_PROMPT, DEFAULT_TEXT_PROMPT } from '@/lib/constants/prompts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import DataPortability from '../components/DataPortability';

export default function SettingsPage() {
  const { userProfile, updateUserProfile } = useAuth();
  const [targetCalories, setTargetCalories] = useState(2000);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [debugMode, setDebugMode] = useState(false);
  const [targetWeight, setTargetWeight] = useState(70);
  const [textAnalysisPrompt, setTextAnalysisPrompt] = useState(DEFAULT_TEXT_PROMPT);
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState(DEFAULT_IMAGE_PROMPT);
  const [saving, setSaving] = useState(false);

  // Load settings from user profile
  useEffect(() => {
    if (userProfile) {
      setTargetCalories(userProfile.targetCalories);
      setTargetWeight(userProfile.targetWeight);
      setSelectedModel(userProfile.settings.selectedModel);
      setDebugMode(userProfile.settings.debugMode);
      setTextAnalysisPrompt(userProfile.settings.textAnalysisPrompt || DEFAULT_TEXT_PROMPT);
      setImageAnalysisPrompt(userProfile.settings.imageAnalysisPrompt || DEFAULT_IMAGE_PROMPT);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      await updateUserProfile({
        targetCalories,
        targetWeight,
        settings: {
          selectedModel,
          debugMode,
          textAnalysisPrompt,
          imageAnalysisPrompt,
        },
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetPrompts = () => {
    setTextAnalysisPrompt(DEFAULT_TEXT_PROMPT);
    setImageAnalysisPrompt(DEFAULT_IMAGE_PROMPT);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="space-y-6 mx-auto p-4 max-w-2xl">
        <h1 className="mb-6 font-bold text-2xl">Settings</h1>

        {/* Subscription Info */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <h2 className="text-lg font-medium text-blue-300 mb-2">Subscription Status</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Plan: </span>
              <span className="text-blue-300 capitalize font-medium">{userProfile.subscription.tier}</span>
            </div>
            <div>
              <span className="text-gray-400">Status: </span>
              <span className={`capitalize font-medium ${
                userProfile.subscription.status === 'active' ? 'text-green-400' :
                userProfile.subscription.status === 'past_due' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {userProfile.subscription.status}
              </span>
            </div>
            <div>
              <span className="text-gray-400">API Usage: </span>
              <span className="text-blue-300">{userProfile.apiUsage.currentMonth} this month</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <label htmlFor="targetCalories" className="block mb-1 font-medium text-sm">
            Target Daily Calories
          </label>
          <input
            type="number"
            id="targetCalories"
            value={targetCalories}
            onChange={e => setTargetCalories(Number(e.target.value))}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
            min="1000"
            max="5000"
          />
        </div>

        <div>
          <label htmlFor="targetWeight" className="block mb-1 font-medium text-sm">
            Target Weight (kg)
          </label>
          <input
            type="number"
            id="targetWeight"
            value={targetWeight}
            onChange={e => setTargetWeight(Number(e.target.value))}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
            min="30"
            max="200"
            step="0.1"
          />
        </div>

        {/* AI Model Selection */}
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
            <option value="gpt-4o-mini">GPT-4O Mini (Recommended)</option>
            <option value="gpt-4o">GPT-4O</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
          <p className="mt-1 text-gray-400 text-xs">
            Different models have varying accuracy and speed. GPT-4O Mini offers the best balance.
          </p>
        </div>

        {/* Debug Mode */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="debugMode"
            checked={debugMode}
            onChange={e => setDebugMode(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="debugMode" className="font-medium text-sm">
            Debug Mode
          </label>
          <p className="ml-2 text-gray-400 text-xs">
            Show additional information about API responses
          </p>
        </div>

        {/* Custom Prompts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="textPrompt" className="block font-medium text-sm">
              Text Analysis Prompt
            </label>
            <button
              onClick={resetPrompts}
              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
            >
              Reset to Default
            </button>
          </div>
          <textarea
            id="textPrompt"
            value={textAnalysisPrompt}
            onChange={e => setTextAnalysisPrompt(e.target.value)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100 h-24"
            placeholder="Custom prompt for text-based meal analysis..."
          />
          <p className="mt-1 text-gray-400 text-xs">
            Customize how AI analyzes text descriptions of meals
          </p>
        </div>

        <div>
          <label htmlFor="imagePrompt" className="block mb-1 font-medium text-sm">
            Image Analysis Prompt
          </label>
          <textarea
            id="imagePrompt"
            value={imageAnalysisPrompt}
            onChange={e => setImageAnalysisPrompt(e.target.value)}
            className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100 h-24"
            placeholder="Custom prompt for image-based meal analysis..."
          />
          <p className="mt-1 text-gray-400 text-xs">
            Customize how AI analyzes images of food
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Data Management */}
        <DataPortability />
      </div>
    </div>
  );
}
