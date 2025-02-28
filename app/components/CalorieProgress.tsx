interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CalorieProgressProps {
  totals: NutritionTotals;
  targetCalories: number;
}

export default function CalorieProgress({ totals, targetCalories }: CalorieProgressProps) {
  const calories = Math.round(totals.calories);
  const percentage = Math.min((calories / targetCalories) * 100, 100);
  const remaining = targetCalories - calories;
  const isOver = remaining < 0;

  let barColor = 'bg-green-500';
  let textColor = 'text-green-400';
  if (isOver) {
    barColor = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (remaining < targetCalories * 0.1) {
    barColor = 'bg-yellow-500';
    textColor = 'text-yellow-400';
  }

  return (
    <div className='p-3 bg-gray-800 rounded border border-gray-700'>
      <div className='flex justify-between items-baseline mb-1.5'>
        <div className='text-sm font-medium'>
          {calories} / {targetCalories} kcal
        </div>
        <div className={`text-sm ${textColor}`}>{isOver ? `${Math.abs(remaining)} over` : `${remaining} left`}</div>
      </div>
      <div className='h-2 bg-gray-700 rounded overflow-hidden'>
        <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
      <div className='mt-2 grid grid-cols-4 gap-2 text-center text-xs text-gray-400'>
        {Object.entries(totals)
          .filter(([key]) => key !== 'calories')
          .map(([key, value]) => (
            <div key={key}>
              <span className='block font-medium text-gray-300'>{Math.round(value)}g</span>
              {key.charAt(0).toUpperCase()}
            </div>
          ))}
      </div>
    </div>
  );
}
