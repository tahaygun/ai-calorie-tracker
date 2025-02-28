'use client';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useMeals } from '@/lib/hooks/useMeals';
import { useNutritionApi } from '@/lib/hooks/useNutritionApi';
import { useState } from 'react';
import type { MealEntry } from '../lib/types';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
import SettingsModal from './components/SettingsModal';
import SettingsPrompt from './components/SettingsPrompt';

export default function Home() {
  const {
    mealDescription,
    setMealDescription,
    dailyMeals,
    editableItems,
    setEditableItems,
    isEditing,
    setIsEditing,
    calculateDailyTotals,
    addMeal,
    deleteMeal,
    updateItemNutrition,
  } = useMeals();

  const {
    apiKey,
    targetCalories,
    selectedModel,
    customModelName,
    debugMode,
    showApiKeyPrompt,
    setApiKey,
    setTargetCalories,
    setSelectedModel,
    setCustomModelName,
    setDebugMode,
  } = useSettings();

  const { favorites, toggleFavorite, deleteFavorite, isMealFavorite } = useFavorites();
  const { isLoading, tokenUsage, analyzeMealDescription, analyzeMealImage, clearTokenUsage } = useNutritionApi();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    try {
      const nutritionData = await analyzeMealDescription(mealDescription);
      setEditableItems(nutritionData);
      setIsEditing(true);
    } catch (error) {
      console.error('Error analyzing meal:', error);
      alert('Failed to analyze meal. Please try again.');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    try {
      const nutritionData = await analyzeMealImage(file, mealDescription);
      setEditableItems(nutritionData);
      setIsEditing(true);
      if (!mealDescription) {
        const itemDescriptions = nutritionData.map((item) => item.item);
        setMealDescription(itemDescriptions.join(', '));
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    }
  };

  const handleConfirmMeal = () => {
    const newMeal: MealEntry = {
      id: crypto.randomUUID(),
      description: mealDescription,
      items: editableItems,
      timestamp: new Date().toISOString(),
    };
    addMeal(newMeal);
    setMealDescription('');
    setEditableItems([]);
    setIsEditing(false);
    clearTokenUsage();
    setResetImageUpload((prev) => prev + 1);
  };

  const handleSelectFavorite = (meal: MealEntry) => {
    const newMeal = {
      ...meal,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    addMeal(newMeal);
    setIsFavoritesOpen(false);
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
                clearTokenUsage();
              }}
            />
          </div>
        )}

        <MealList meals={dailyMeals} onToggleFavorite={toggleFavorite} onDelete={deleteMeal} isFavorite={isMealFavorite} />

        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onDelete={deleteFavorite}
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
          customModelName={customModelName}
          onCustomModelNameChange={setCustomModelName}
          debugMode={debugMode}
          onDebugModeChange={setDebugMode}
        />
      </main>
    </div>
  );
}
