'use client';
import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useState } from 'react';
import FavoritesModal from './components/FavoritesModal';
import Navigation from './components/Navigation';
import SettingsModal from './components/SettingsModal';

interface MealEntry {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  timestamp: string;
}

export default function Home() {
  const [mealDescription, setMealDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dailyMeals, setDailyMeals] = useState<MealEntry[]>([]);
  const [editableItems, setEditableItems] = useState<FoodItemNutrition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<MealEntry[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [targetCalories, setTargetCalories] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedMeals = localStorage.getItem(`meals_${today}`);
    const storedFavorites = localStorage.getItem('favorite_meals');
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedTargetCalories = localStorage.getItem('target_calories');

    if (storedMeals) {
      setDailyMeals(JSON.parse(storedMeals));
    }
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyPrompt(true);
      setIsSettingsOpen(true);
    }
    if (storedTargetCalories) {
      setTargetCalories(parseInt(storedTargetCalories));
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    setShowApiKeyPrompt(false);
  };

  const handleSaveTargetCalories = (calories: number) => {
    setTargetCalories(calories);
    localStorage.setItem('target_calories', calories.toString());
  };

  const saveMealToStorage = (meal: MealEntry) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedMeals = [...dailyMeals, meal];
    localStorage.setItem(`meals_${today}`, JSON.stringify(updatedMeals));
    setDailyMeals(updatedMeals);
  };

  const toggleFavorite = (meal: MealEntry) => {
    const isFavorite = favorites.some((fav) => fav.id === meal.id);
    let updatedFavorites: MealEntry[];

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== meal.id);
    } else {
      updatedFavorites = [...favorites, meal];
    }

    localStorage.setItem('favorite_meals', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const isMealFavorite = (mealId: string) => {
    return favorites.some((fav) => fav.id === mealId);
  };

  const addFavoriteToToday = (meal: MealEntry) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    saveMealToStorage(newMeal);
    setIsFavoritesOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-Key': apiKey,
        },
        body: JSON.stringify({ description: mealDescription }),
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        setEditableItems(data.nutritionData);
        setIsEditing(true);
      } else {
        throw new Error(data.error || 'Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
      alert('Failed to log meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMeal = () => {
    if (editableItems.length > 0) {
      const newMeal: MealEntry = {
        id: Date.now().toString(),
        description: mealDescription,
        items: editableItems,
        timestamp: new Date().toISOString(),
      };
      saveMealToStorage(newMeal);
      setMealDescription('');
      setEditableItems([]);
      setIsEditing(false);
    }
  };

  const handleDeleteMeal = (mealId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedMeals = dailyMeals.filter((meal) => meal.id !== mealId);
    localStorage.setItem(`meals_${today}`, JSON.stringify(updatedMeals));
    setDailyMeals(updatedMeals);
  };

  const calculateDailyTotals = () => {
    return dailyMeals.reduce(
      (totals, meal) => {
        const mealTotals = meal.items.reduce(
          (itemTotals, item) => ({
            calories: itemTotals.calories + item.nutrition.calories,
            protein: itemTotals.protein + item.nutrition.protein,
            carbs: itemTotals.carbs + item.nutrition.carbs,
            fat: itemTotals.fat + item.nutrition.fat,
            fiber: itemTotals.fiber + item.nutrition.fiber,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );
        return {
          calories: totals.calories + mealTotals.calories,
          protein: totals.protein + mealTotals.protein,
          carbs: totals.carbs + mealTotals.carbs,
          fat: totals.fat + mealTotals.fat,
          fiber: totals.fiber + mealTotals.fiber,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const updateItemNutrition = (itemIndex: number, field: keyof NutritionData, value: number) => {
    setEditableItems((items) =>
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              nutrition: {
                ...item.nutrition,
                [field]: value,
              },
            }
          : item
      )
    );
  };

  const calorieProgress = () => {
    const totals = calculateDailyTotals();
    const calories = Math.round(totals.calories);
    if (!targetCalories) return null;

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
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <Navigation />
      <main className='max-w-2xl mx-auto p-4'>
        <div className='flex justify-end gap-2 mb-4'>
          <button
            onClick={() => setIsFavoritesOpen(true)}
            className='bg-gray-700 text-sm py-1.5 px-3 rounded hover:bg-gray-600 transition-colors'
          >
            Favorite Meals
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className='bg-gray-700 text-sm py-1.5 px-3 rounded hover:bg-gray-600 transition-colors'
          >
            Settings
          </button>
        </div>

        {showApiKeyPrompt && (
          <div className='mb-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded'>
            <p className='text-sm text-yellow-200'>
              Please set your OpenAI API key in settings.{' '}
              <button onClick={() => setIsSettingsOpen(true)} className='text-yellow-400 hover:text-yellow-300 underline'>
                Open Settings
              </button>
            </p>
          </div>
        )}

        {!targetCalories && (
          <div className='mb-4 p-3 bg-blue-900/50 border border-blue-700 rounded'>
            <p className='text-sm text-blue-200'>
              Set your daily calorie target in settings to track your progress.{' '}
              <button onClick={() => setIsSettingsOpen(true)} className='text-blue-400 hover:text-blue-300 underline'>
                Open Settings
              </button>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-3'>
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

        {dailyMeals.length > 0 && <div className='mt-4 mb-6'>{calorieProgress()}</div>}

        {isEditing && editableItems.length > 0 && (
          <div className='mt-6 p-3 bg-gray-800 rounded border border-gray-700'>
            <h2 className='text-sm font-semibold mb-2'>Verify Nutrition Information</h2>
            <div className='space-y-3'>
              {editableItems.map((item, itemIndex) => (
                <div key={itemIndex} className='p-3 bg-gray-700 rounded'>
                  <p className='text-sm mb-2'>{item.item}</p>
                  <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm'>
                    {Object.entries(item.nutrition).map(([key, value]) => (
                      <div key={key}>
                        <label className='text-xs text-gray-400 block'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                          type='number'
                          value={value}
                          onChange={(e) => updateItemNutrition(itemIndex, key as keyof NutritionData, parseFloat(e.target.value) || 0)}
                          className='w-full p-1 border rounded bg-gray-600 border-gray-500 text-gray-100'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex gap-2 mt-3'>
              <button onClick={handleConfirmMeal} className='bg-green-600 text-sm py-1.5 px-3 rounded hover:bg-green-700 transition-colors'>
                Confirm & Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableItems([]);
                }}
                className='bg-gray-600 text-sm py-1.5 px-3 rounded hover:bg-gray-700 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {dailyMeals.length > 0 && (
          <div className='mt-6'>
            <h3 className='text-sm font-semibold mb-2'>Logged Meals</h3>
            <div className='space-y-3'>
              {dailyMeals.map((meal) => (
                <div key={meal.id} className='p-3 bg-gray-800 rounded border border-gray-700'>
                  <div className='flex justify-between items-start gap-3 mb-2'>
                    <p className='text-sm'>{meal.description}</p>
                    <div className='flex gap-2 shrink-0'>
                      <button
                        onClick={() => toggleFavorite(meal)}
                        className={`text-xl leading-none ${
                          isMealFavorite(meal.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                        }`}
                      >
                        ★
                      </button>
                      <button onClick={() => handleDeleteMeal(meal.id)} className='text-sm text-red-400 hover:text-red-300'>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    {meal.items.map((item, index) => (
                      <div key={index} className='bg-gray-700 p-2 rounded'>
                        <p className='text-sm mb-1'>{item.item}</p>
                        <div className='grid grid-cols-5 gap-2 text-xs text-gray-300'>
                          <div>
                            <span className='text-gray-400'>Cal</span> {item.nutrition.calories}
                          </div>
                          <div>
                            <span className='text-gray-400'>P</span> {item.nutrition.protein}g
                          </div>
                          <div>
                            <span className='text-gray-400'>C</span> {item.nutrition.carbs}g
                          </div>
                          <div>
                            <span className='text-gray-400'>F</span> {item.nutrition.fat}g
                          </div>
                          <div>
                            <span className='text-gray-400'>Fb</span> {item.nutrition.fiber}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onAddFavorite={addFavoriteToToday}
        onRemoveFavorite={(id) => toggleFavorite(favorites.find((f) => f.id === id)!)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        targetCalories={targetCalories}
        onSaveApiKey={handleSaveApiKey}
        onSaveTargetCalories={handleSaveTargetCalories}
      />
    </div>
  );
}
