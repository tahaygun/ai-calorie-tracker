'use client';
import { useEffect, useState } from 'react';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
import SettingsModal from './components/SettingsModal';
import SettingsPrompt from './components/SettingsPrompt';
import type { FoodItemNutrition, NutritionData } from './lib/openai';
import type { MealEntry, NutritionTotals } from './lib/types';

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
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedMeals = localStorage.getItem(`meals_${today}`);
    const storedFavorites = localStorage.getItem('favorite_meals');
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedTargetCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model');

    if (storedMeals) setDailyMeals(JSON.parse(storedMeals));
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedTargetCalories) setTargetCalories(parseInt(storedTargetCalories));
    if (storedModel) setSelectedModel(storedModel);

    if (!storedApiKey) {
      setShowApiKeyPrompt(true);
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSaveSettings = (settings: { apiKey: string; targetCalories: number; model: string }) => {
    setApiKey(settings.apiKey);
    setTargetCalories(settings.targetCalories);
    setSelectedModel(settings.model);
    localStorage.setItem('openai_api_key', settings.apiKey);
    localStorage.setItem('target_calories', settings.targetCalories.toString());
    localStorage.setItem('selected_model', settings.model);
    setShowApiKeyPrompt(false);
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
          'X-OpenAI-Model': selectedModel,
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

  const calculateDailyTotals = (): NutritionTotals => {
    return dailyMeals.reduce(
      (totals, meal) => {
        const mealTotals = meal.items.reduce(
          (itemTotals: NutritionTotals, item: FoodItemNutrition) => ({
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

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
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

        {showApiKeyPrompt && <SettingsPrompt type='apiKey' onOpenSettings={() => setIsSettingsOpen(true)} />}
        {!targetCalories && <SettingsPrompt type='calorieTarget' onOpenSettings={() => setIsSettingsOpen(true)} />}

        <MealForm
          mealDescription={mealDescription}
          setMealDescription={setMealDescription}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          isLoading={isLoading}
        />

        {dailyMeals.length > 0 && targetCalories > 0 && (
          <div className='mt-4 mb-6'>
            <CalorieProgress totals={calculateDailyTotals()} targetCalories={targetCalories} />
          </div>
        )}

        {isEditing && editableItems.length > 0 && (
          <div className='mt-6'>
            <NutritionEditor
              items={editableItems}
              onUpdateItem={updateItemNutrition}
              onConfirm={handleConfirmMeal}
              onCancel={() => {
                setIsEditing(false);
                setEditableItems([]);
              }}
            />
          </div>
        )}

        <MealList meals={dailyMeals} onToggleFavorite={toggleFavorite} onDelete={handleDeleteMeal} isFavorite={isMealFavorite} />
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
        selectedModel={selectedModel}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
