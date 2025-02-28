interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  targetCalories: number;
  onTargetCaloriesChange: (value: number) => void;
  selectedModel: string;
  onModelChange: (value: string) => void;
  debugMode: boolean;
  onDebugModeChange: (value: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  targetCalories,
  onTargetCaloriesChange,
  selectedModel,
  onModelChange,
  debugMode,
  onDebugModeChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-4'>
        <h2 className='text-lg font-semibold'>Settings</h2>

        <div>
          <label htmlFor='apiKey' className='block text-sm font-medium mb-1'>
            OpenAI API Key
          </label>
          <input
            type='password'
            id='apiKey'
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className='w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100'
            placeholder='sk-...'
          />
        </div>

        <div>
          <label htmlFor='targetCalories' className='block text-sm font-medium mb-1'>
            Daily Calorie Target
          </label>
          <input
            type='number'
            id='targetCalories'
            value={targetCalories || ''}
            onChange={(e) => onTargetCaloriesChange(parseInt(e.target.value) || 0)}
            className='w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100'
            placeholder='2000'
          />
        </div>

        <div>
          <label htmlFor='model' className='block text-sm font-medium mb-1'>
            OpenAI Model
          </label>
          <select
            id='model'
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className='w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100'
          >
            <option value='gpt-3.5-turbo'>GPT-3.5 Turbo</option>
            <option value='gpt-4'>GPT-4</option>
            <option value='gpt-4-vision-preview'>GPT-4 Vision</option>
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='debugMode'
            checked={debugMode}
            onChange={(e) => onDebugModeChange(e.target.checked)}
            className='rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500'
          />
          <label htmlFor='debugMode' className='text-sm font-medium'>
            Debug Mode (Show raw OpenAI response and token usage)
          </label>
        </div>

        <div className='flex justify-end gap-2'>
          <button onClick={onClose} className='bg-blue-600 text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
