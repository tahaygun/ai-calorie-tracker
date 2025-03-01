import type { FoodItemNutrition, NutritionData } from '@/lib/openai';

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (
    itemIndex: number,
    field: keyof NutritionData,
    value: number
  ) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NutritionEditor({
  items,
  onUpdateItem,
  onConfirm,
  onCancel,
}: NutritionEditorProps) {
  return (
    <div className='border-gray-700 bg-gray-800 p-3 border rounded'>
      <h2 className='mb-2 font-semibold text-sm'>
        Verify Nutrition Information
      </h2>
      <div className='space-y-3'>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className='bg-gray-700 p-2.5 rounded'>
            <p className='mb-1.5 font-medium text-sm'>{item.item}</p>
            <div className='gap-2 grid grid-cols-3 md:grid-cols-5'>
              {Object.entries(item.nutrition).map(([key, value]) => (
                <div key={key} className='flex flex-col'>
                  <label className='mb-0.5 text-gray-400 text-xs'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type='number'
                    value={value}
                    onChange={(e) =>
                      onUpdateItem(
                        itemIndex,
                        key as keyof NutritionData,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='border-gray-500 bg-gray-600 px-2 py-1 border rounded w-full text-gray-100 text-sm'
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className='border-gray-600 mt-2.5 pt-2 border-t'>
          <div className='gap-2 grid grid-cols-3 md:grid-cols-5 text-xs'>
            {Object.keys(items[0]?.nutrition || {}).map((key) => {
              const total = items.reduce(
                (sum, item) =>
                  sum + (item.nutrition[key as keyof NutritionData] || 0),
                0
              );
              return (
                <div
                  key={key}
                  className='flex flex-col items-center bg-gray-900 px-2 py-1.5 rounded'
                >
                  <span className='text-gray-400'>
                    Total {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className='font-bold text-green-400 text-sm'>
                    {total.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className='flex gap-2 mt-3'>
        <button
          onClick={onConfirm}
          className='bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded font-medium text-sm transition-colors'
        >
          Confirm & Save
        </button>
        <button
          onClick={onCancel}
          className='bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
