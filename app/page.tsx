'use client';
import type { FoodItemNutrition, NutritionData } from '@/lib/openai';
import { useEffect, useState } from 'react';
import type { MealEntry, NutritionTotals } from '../lib/types';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
import SettingsModal from './components/SettingsModal';
import SettingsPrompt from './components/SettingsPrompt';

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
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [debugMode, setDebugMode] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const [tokenUsage, setTokenUsage] = useState<{
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
  } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedMeals = localStorage.getItem(`meals_${today}`);
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedTargetCalories = localStorage.getItem('target_calories');
    const storedModel = localStorage.getItem('selected_model');
    const storedDebugMode = localStorage.getItem('debug_mode');
    const storedFavorites = localStorage.getItem('favorite_meals');

    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyPrompt(true);
    }

    if (storedTargetCalories) {
      setTargetCalories(parseInt(storedTargetCalories));
    }

    if (storedMeals) {
      setDailyMeals(JSON.parse(storedMeals));
    }

    if (storedModel) {
      setSelectedModel(storedModel);
    }

    if (storedDebugMode) {
      setDebugMode(storedDebugMode === 'true');
    }

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('target_calories', targetCalories.toString());
    localStorage.setItem('selected_model', selectedModel);
    localStorage.setItem('debug_mode', debugMode.toString());
    localStorage.setItem('favorite_meals', JSON.stringify(favorites));
  }, [apiKey, targetCalories, selectedModel, debugMode, favorites]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`meals_${today}`, JSON.stringify(dailyMeals));
  }, [dailyMeals]);

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
          'X-Debug-Mode': debugMode ? 'true' : 'false',
        },
        body: JSON.stringify({ description: mealDescription }),
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        setEditableItems(data.nutritionData);
        setIsEditing(true);
        if (data.debugInfo) {
          setTokenUsage(data.debugInfo);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze meal');
      }
    } catch (error) {
      console.error('Error analyzing meal:', error);
      alert('Failed to analyze meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', mealDescription || 'Food image analysis');

      const response = await fetch('/api/meals/image', {
        method: 'POST',
        headers: {
          'X-OpenAI-Key': apiKey,
          'X-OpenAI-Model': selectedModel,
          'X-Debug-Mode': debugMode ? 'true' : 'false',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.nutritionData) {
        setEditableItems(data.nutritionData);
        setIsEditing(true);
        if (!mealDescription) {
          const itemDescriptions = data.nutritionData.map((item: FoodItemNutrition) => item.item);
          setMealDescription(itemDescriptions.join(', '));
        }
        if (data.debugInfo) {
          setTokenUsage(data.debugInfo);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMeal = () => {
    const newMeal: MealEntry = {
      id: crypto.randomUUID(),
      description: mealDescription,
      items: editableItems,
      timestamp: new Date().toISOString(),
    };
    setDailyMeals((prev) => [...prev, newMeal]);
    setMealDescription('');
    setEditableItems([]);
    setIsEditing(false);
    setTokenUsage(null);
    setResetImageUpload((prev) => prev + 1);
  };

  const handleDeleteMeal = (id: string) => {
    setDailyMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const toggleFavorite = (meal: MealEntry) => {
    const isFavorite = favorites.some((fav) => fav.id === meal.id);
    if (isFavorite) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== meal.id));
    } else {
      setFavorites((prev) => [...prev, meal]);
    }
  };

  const isMealFavorite = (id: string) => favorites.some((fav) => fav.id === id);

  const handleSelectFavorite = (meal: MealEntry) => {
    const newMeal = {
      ...meal,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setDailyMeals((prev) => [...prev, newMeal]);
    setIsFavoritesOpen(false);
  };

  const handleDeleteFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((meal) => meal.id !== id));
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
          onImageUpload={handleImageUpload}
          isEditing={isEditing}
          isLoading={isLoading}
          tokenUsage={tokenUsage || undefined}
          key={resetImageUpload}
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
                setTokenUsage(null);
              }}
            />
          </div>
        )}

        <MealList meals={dailyMeals} onToggleFavorite={toggleFavorite} onDelete={handleDeleteMeal} isFavorite={isMealFavorite} />

        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onDelete={handleDeleteFavorite}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          targetCalories={targetCalories}
          onTargetCaloriesChange={setTargetCalories}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          debugMode={debugMode}
          onDebugModeChange={setDebugMode}
        />
      </main>
    </div>
  );
}
