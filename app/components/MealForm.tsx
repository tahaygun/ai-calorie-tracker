import React from 'react';

interface MealFormProps {
  mealDescription: string;
  setMealDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  isLoading: boolean;
}

export default function MealForm({ mealDescription, setMealDescription, onSubmit, isEditing, isLoading }: MealFormProps) {
  return (
    <form onSubmit={onSubmit} className='space-y-3'>
      <div>
        <label htmlFor='mealDescription' className='block text-sm font-medium mb-1'>
          What did you eat? (Separate items with commas)
        </label>
        <textarea
          id='mealDescription'
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          className='w-full p-2 border rounded bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
          placeholder='Example: 2 eggs, 1 slice of toast, 1 apple'
          rows={3}
          required
        />
      </div>

      <button
        type='submit'
        className='w-full bg-blue-600 text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed'
        disabled={isEditing || isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Meal'}
      </button>
    </form>
  );
}
