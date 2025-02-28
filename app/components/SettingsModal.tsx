import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  targetCalories: number;
  onSaveApiKey: (key: string) => void;
  onSaveTargetCalories: (calories: number) => void;
}

export default function SettingsModal({ isOpen, onClose, apiKey, targetCalories, onSaveApiKey, onSaveTargetCalories }: SettingsModalProps) {
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newTargetCalories, setNewTargetCalories] = useState(targetCalories);

  const handleSave = () => {
    onSaveApiKey(newApiKey);
    onSaveTargetCalories(newTargetCalories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-800 rounded-lg w-full max-w-md'>
        <div className='p-3 border-b border-gray-700 flex justify-between items-center'>
          <h2 className='text-sm font-semibold'>Settings</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-300'>
            ✕
          </button>
        </div>

        <div className='p-3'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>OpenAI API Key</label>
              <div className='relative'>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder='sk-...'
                  className='w-full p-2 pr-10 border rounded bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                />
                <button
                  type='button'
                  onClick={() => setShowApiKey(!showApiKey)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300'
                >
                  {showApiKey ? '🔒' : '👁️'}
                </button>
              </div>
              <p className='mt-1 text-xs text-gray-400'>
                Your API key is stored locally.{' '}
                <a
                  href='https://platform.openai.com/api-keys'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-400 hover:text-blue-300'
                >
                  Get your API key →
                </a>
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Daily Target Calories</label>
              <input
                type='number'
                value={newTargetCalories}
                onChange={(e) => setNewTargetCalories(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder='2000'
                className='w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
              />
              <p className='mt-1 text-xs text-gray-400'>Set your daily calorie target to track your progress</p>
            </div>
          </div>

          <div className='mt-4 flex gap-2 justify-end'>
            <button onClick={onClose} className='px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 transition-colors'>
              Cancel
            </button>
            <button onClick={handleSave} className='px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 transition-colors'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
