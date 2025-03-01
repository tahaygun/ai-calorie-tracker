'use client';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useMeals } from '@/lib/hooks/useMeals';
import { useNutritionApi } from '@/lib/hooks/useNutritionApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { MealEntry } from '../lib/types';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
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
    updateItemName,
    removeItem,
  } = useMeals();

  const { apiKey, targetCalories } = useSettings();

  const { favorites, toggleFavorite, deleteFavorite, isMealFavorite } =
    useFavorites();
  const {
    isLoading,
    tokenUsage,
    analyzeMealDescription,
    analyzeMealImage,
    clearTokenUsage,
  } = useNutritionApi();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      router.push('/settings');
      return;
    }

    try {
      const nutritionData = await analyzeMealDescription(mealDescription);
      setEditableItems(nutritionData);
      setIsEditing(true);
    } catch (error) {
      console.error('Error analyzing meal:', error);
      alert('Error analyzing meal. Please check your API key and try again.');
    }
  };

  const handleImageUpload = async (imageFile: File) => {
    if (!apiKey) {
      router.push('/settings');
      return;
    }

    try {
      const nutritionData = await analyzeMealImage(imageFile);
      setEditableItems(nutritionData);
      setIsEditing(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please check your API key and try again.');
      // Reset the file input
      setResetImageUpload((prev) => prev + 1);
    }
  };

  const handleConfirmMeal = () => {
    // If meal description is empty, create one from the item names
    let finalDescription = mealDescription;
    if (!finalDescription && editableItems.length > 0) {
      finalDescription = editableItems.map((item) => item.item).join(', ');
    }

    addMeal({
      id: Date.now().toString(),
      description: finalDescription,
      items: editableItems,
      timestamp: new Date().toISOString(),
    });
    setMealDescription('');
    setEditableItems([]);
    setIsEditing(false);
    clearTokenUsage();
  };

  const handleSelectFavorite = (favorite: MealEntry) => {
    setMealDescription(favorite.description);
    setEditableItems(favorite.items);
    setIsEditing(true);
    setIsFavoritesOpen(false);
  };

  return (
    <div className='bg-gray-900 min-h-screen text-gray-100'>
      <main className='mx-auto p-4 max-w-2xl'>
        {!apiKey && <SettingsPrompt type='apiKey' />}
        {!targetCalories && <SettingsPrompt type='calorieTarget' />}

        <MealForm
          mealDescription={mealDescription}
          setMealDescription={setMealDescription}
          onSubmit={handleSubmit}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
          tokenUsage={tokenUsage || undefined}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          key={resetImageUpload}
        />

        {dailyMeals.length > 0 && targetCalories > 0 && (
          <div className='mt-4 mb-6'>
            <CalorieProgress
              totals={calculateDailyTotals()}
              targetCalories={targetCalories}
            />
          </div>
        )}

        {isEditing && editableItems.length > 0 && (
          <div className='mt-6'>
            <NutritionEditor
              items={editableItems}
              onUpdateItem={updateItemNutrition}
              onUpdateItemName={updateItemName}
              onRemoveItem={removeItem}
              onConfirm={handleConfirmMeal}
              onCancel={() => {
                setIsEditing(false);
                setEditableItems([]);
                clearTokenUsage();
              }}
            />
          </div>
        )}

        <MealList
          meals={dailyMeals}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteMeal}
          isFavorite={isMealFavorite}
        />

        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onDelete={deleteFavorite}
        />
      </main>
    </div>
  );
}
