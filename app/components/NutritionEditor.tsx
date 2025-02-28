import type { FoodItemNutrition, NutritionData } from '@/lib/openai';

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (itemIndex: number, field: keyof NutritionData, value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NutritionEditor({ items, onUpdateItem, onConfirm, onCancel }: NutritionEditorProps) {
  return (
    <div className='p-3 bg-gray-800 rounded border border-gray-700'>
      <h2 className='text-sm font-semibold mb-2'>Verify Nutrition Information</h2>
      <div className='space-y-3'>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className='p-3 bg-gray-700 rounded'>
            <p className='text-sm mb-2'>{item.item}</p>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm'>
              {Object.entries(item.nutrition).map(([key, value]) => (
                <div key={key}>
                  <label className='text-xs text-gray-400 block'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type='number'
                    value={value}
                    onChange={(e) => onUpdateItem(itemIndex, key as keyof NutritionData, parseFloat(e.target.value) || 0)}
                    className='w-full p-1 border rounded bg-gray-600 border-gray-500 text-gray-100'
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='mt-3 border-t border-gray-600 pt-3'>
        <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm'>
          {Object.keys(items[0]?.nutrition || {}).map((key) => {
            const total = items.reduce((sum, item) => sum + (item.nutrition[key as keyof NutritionData] || 0), 0);
            return (
              <div key={key} className='bg-gray-900 px-2 py-1.5 rounded flex flex-col items-center'>
                <div className='text-gray-400 text-xs'>Total {key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className='font-bold text-green-400'>{total.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='flex gap-2 mt-3'>
        <button onClick={onConfirm} className='bg-green-600 text-sm py-1.5 px-3 rounded hover:bg-green-700 transition-colors'>
          Confirm & Save
        </button>
        <button onClick={onCancel} className='bg-gray-600 text-sm py-1.5 px-3 rounded hover:bg-gray-700 transition-colors'>
          Cancel
        </button>
      </div>
    </div>
  );
}
