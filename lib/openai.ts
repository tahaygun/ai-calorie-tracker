// src/types/index.ts
export interface FoodInput {
  foodDescription: string;
  quantity?: number;
  unit?: string;
}

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

// src/services/openaiService.ts
import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.apiKey = apiKey;
  }

  private splitFoodDescription(description: string): string[] {
    // Split by commas and filter out empty strings
    return description
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  async analyzeFoodData(input: FoodInput): Promise<FoodItemNutrition[]> {
    try {
      const foodItems = this.splitFoodDescription(input.foodDescription);
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a nutritional expert. I will give you a list of food items. If the description is one food but with all ingredients, return one item. Return ONLY a JSON array where each item has 'item' and 'nutrition' fields. The nutrition object should have exactly these numeric fields: calories, protein, carbs, fat, fiber. 
              Example response for "2 eggs, 1 apple":
              [
                {
                  "item": "2 eggs",
                  "nutrition": {"calories": 150, "protein": 12, "carbs": 1, "fat": 10, "fiber": 0}
                },
                {
                  "item": "1 apple",
                  "nutrition": {"calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3, "fiber": 4}
                }
              ]`,
            },
            {
              role: 'user',
              content: `Analyze these food items: ${foodItems.join(', ')}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      try {
        const parsedData = JSON.parse(content.trim());
        // Validate the structure and ensure all numbers are valid
        const validatedData: FoodItemNutrition[] = parsedData.map((item: FoodItemNutrition) => ({
          item: item.item,
          nutrition: {
            calories: Number(item.nutrition.calories) || 0,
            protein: Number(item.nutrition.protein) || 0,
            carbs: Number(item.nutrition.carbs) || 0,
            fat: Number(item.nutrition.fat) || 0,
            fiber: Number(item.nutrition.fiber) || 0,
          },
        }));
        return validatedData;
      } catch (error) {
        console.error('Error parsing OpenAI response:', content, error);
        throw new Error('Invalid nutrition data format');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || error.message;
      return new Error(`OpenAI API Error: ${message}`);
    }
    return new Error('An unexpected error occurred');
  }
}
