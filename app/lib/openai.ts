export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItemNutrition {
  item: string;
  nutrition: NutritionData;
}
