'use client';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useMeals } from '@/lib/hooks/useMeals';
import { useNutritionApi } from '@/lib/hooks/useNutritionApi';
import type { FoodItemNutrition } from '@/lib/openai';
import { useState } from 'react';
import type { MealEntry } from '../lib/types';
import AuthGuard from './components/AuthGuard';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
import SettingsPrompt from './components/SettingsPrompt';
import { useSettings } from '@/lib/contexts/SettingsContext';

function HomePage() {
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
    updateMeal,
    updateItemNutrition,
    updateItemName,
    removeItem,
  } = useMeals();

  const { targetCalories } = useSettings();

  const { favorites, toggleFavorite, deleteFavorite, isMealFavorite } = useFavorites();
  const { isLoading, tokenUsage, analyzeMealDescription, analyzeMealImage, clearTokenUsage } =
    useNutritionApi();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setEditableItems([]);
      setIsEditing(false);
      const nutritionData = await analyzeMealDescription(mealDescription);
      setEditableItems(nutritionData);
      setIsEditing(true);
    } catch (error) {
      console.error('Error analyzing meal:', error);
      alert('Error analyzing meal. Please try again.');
    }
  };

  const handleImageUpload = async (imageFile: File) => {
    try {
      const nutritionData = await analyzeMealImage(imageFile, mealDescription);
      setEditableItems(nutritionData);
      setIsEditing(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please try again.');
      // Reset the file input
      setResetImageUpload(prev => prev + 1);
    }
  };

  const handleConfirmMeal = (adjustedItems: FoodItemNutrition[]) => {
    // If meal description is empty, create one from the item names
    let finalDescription = mealDescription;
    if (!finalDescription && adjustedItems.length > 0) {
      finalDescription = adjustedItems.map(item => item.item).join(', ');
    }

    // If we're editing an existing meal, update it
    if (editingMealId) {
      updateMeal(editingMealId, {
        description: finalDescription,
        items: adjustedItems,
      });
      setEditingMealId(null);
    } else {
      // Create and add a new meal
      addMeal({
        id: Date.now().toString(),
        description: finalDescription,
        items: adjustedItems,
        timestamp: new Date().toISOString(),
      });
    }

    // Reset state
    setMealDescription('');
    setEditableItems([]);
    setIsEditing(false);
    clearTokenUsage();
  };

  const handleEditMeal = (meal: MealEntry) => {
    setMealDescription(meal.description);
    setEditableItems(meal.items);
    setIsEditing(true);
    setEditingMealId(meal.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFavorite = (favorite: MealEntry) => {
    setMealDescription(favorite.description);
    setEditableItems(favorite.items);
    setIsEditing(true);
    setIsFavoritesOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <main className="mx-auto p-4 max-w-2xl">
        {!targetCalories && <SettingsPrompt type="calorieTarget" />}

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
          <div className="mt-4 mb-6">
            <CalorieProgress totals={calculateDailyTotals()} targetCalories={targetCalories} />
          </div>
        )}

        {isEditing && editableItems.length > 0 && (
          <div className="mt-6">
            {editingMealId && (
              <div className="bg-blue-900/30 mb-3 p-2 border border-blue-700/50 rounded text-blue-300 text-sm">
                <p>Editing meal - make your changes and click "Confirm" to save</p>
              </div>
            )}
            <NutritionEditor
              items={editableItems}
              onUpdateItem={updateItemNutrition}
              onUpdateItemName={updateItemName}
              onRemoveItem={removeItem}
              onConfirm={handleConfirmMeal}
              onCancel={() => {
                setIsEditing(false);
                setEditableItems([]);
                setEditingMealId(null);
                clearTokenUsage();
              }}
            />
          </div>
        )}

        <MealList
          meals={dailyMeals}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteMeal}
          onEdit={handleEditMeal}
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

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}