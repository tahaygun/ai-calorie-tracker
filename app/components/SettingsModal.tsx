import { useEffect, useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  targetCalories: number;
  selectedModel: string;
  onSaveSettings: (settings: { apiKey: string; targetCalories: number; model: string }) => void;
}

export default function SettingsModal({ isOpen, onClose, apiKey, targetCalories, selectedModel, onSaveSettings }: SettingsModalProps) {
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newTargetCalories, setNewTargetCalories] = useState(targetCalories);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [customModel, setCustomModel] = useState('');
  const [isCustomModel, setIsCustomModel] = useState(false);

  useEffect(() => {
    setNewApiKey(apiKey);
    setNewTargetCalories(targetCalories);

    // Check if the selected model is not one of the standard options
    const isCustom: boolean = Boolean(selectedModel && selectedModel !== 'gpt-3.5-turbo' && selectedModel !== 'gpt-4');
    setIsCustomModel(isCustom);

    if (isCustom) {
      setCustomModel(selectedModel);
    } else {
      setModel(selectedModel || 'gpt-3.5-turbo');
    }
  }, [apiKey, targetCalories, selectedModel]);

  const handleSave = () => {
    onSaveSettings({
      apiKey: newApiKey,
      targetCalories: newTargetCalories,
      model: isCustomModel ? customModel : model,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-800 rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>Settings</h2>

        <div className='space-y-4'>
          {/* API Key Input */}
          <div>
            <label className='block text-sm font-medium mb-2'>OpenAI API Key</label>
            <div className='relative'>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder='sk-...'
                className='w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
              <button
                type='button'
                onClick={() => setShowApiKey(!showApiKey)}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300'
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <a
              href='https://platform.openai.com/api-keys'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-blue-400 hover:text-blue-300 mt-1 inline-block'
            >
              Get your API key
            </a>
          </div>

          {/* Model Selection */}
          <div>
            <label className='block text-sm font-medium mb-2'>AI Model</label>
            <select
              value={isCustomModel ? 'custom' : model}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomModel(true);
                } else {
                  setIsCustomModel(false);
                  setModel(e.target.value);
                }
              }}
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            >
              <option value='gpt-4o-mini'>GPT-4 (Mini, Recommended)</option>
              <option value='gpt-4o'>GPT-4 (Standard)</option>
              <option value='gpt-3.5-turbo'>GPT-3.5 Turbo (Faster, cheaper)</option>
              <option value='gpt-4'>GPT-4</option>
              <option value='custom'>Custom Model</option>
            </select>
          </div>

          {/* Custom Model Input */}
          {isCustomModel && (
            <div>
              <label className='block text-sm font-medium mb-2'>Custom Model Name</label>
              <input
                type='text'
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder='Enter model name (e.g., ft:gpt-3.5-turbo-...)'
                className='w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
          )}

          {/* Daily Target Calories */}
          <div>
            <label className='block text-sm font-medium mb-2'>Daily Target Calories</label>
            <input
              type='number'
              value={newTargetCalories}
              onChange={(e) => setNewTargetCalories(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder='2000'
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-4 mt-6'>
          <button onClick={onClose} className='px-4 py-2 text-gray-300 hover:text-white transition-colors'>
            Cancel
          </button>
          <button onClick={handleSave} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
