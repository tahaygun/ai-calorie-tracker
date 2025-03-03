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
    <div className="border-gray-700 bg-gray-800 p-3 border rounded">
      <div className="flex justify-between items-baseline mb-1.5">
        <div className="font-medium text-sm">
          {calories} / {targetCalories} kcal
        </div>
        <div className={`text-sm ${textColor}`}>
          {isOver ? `${Math.abs(remaining)} over` : `${remaining} left`}
        </div>
      </div>
      <div className="bg-gray-700 rounded h-2 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="gap-2 grid grid-cols-4 mt-2 text-center text-gray-400 text-xs">
        {Object.entries(totals)
          .filter(([key]) => key !== 'calories')
          .map(([key, value]) => (
            <div key={key}>
              <span className="block font-medium text-gray-300">{Math.round(value)}g</span>
              <small>{key.toUpperCase()}</small>
            </div>
          ))}
      </div>
    </div>
  );
}
