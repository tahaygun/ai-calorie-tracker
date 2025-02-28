import OpenAI from 'openai';

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

export interface OpenAIServiceConfig {
  apiKey: string;
  model: string;
  debug?: boolean;
}

export interface AnalysisResponse {
  data: FoodItemNutrition[];
  debugInfo?: {
    rawResponse: unknown;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
  };
}

export class OpenAIService {
  private client: OpenAI;
  private model: string;
  private debug: boolean;

  constructor(config: OpenAIServiceConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
    this.debug = config.debug || false;
  }

  async analyzeFoodData(description: string): Promise<AnalysisResponse> {
    const prompt = `Analyze the following meal description and provide nutritional information for each item. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values. Meal description: "${description}"`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    const parsedResponse = JSON.parse(content);
    const result: AnalysisResponse = {
      data: parsedResponse.meal || [],
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: parsedResponse,
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
      };
    }

    return result;
  }

  async analyzeImageData(base64Image: string, description?: string): Promise<AnalysisResponse> {
    const prompt = description
      ? `Analyze this food image and the provided description: "${description}". Provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values.`
      : 'Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values.';

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    const parsedResponse = JSON.parse(content);
    const result: AnalysisResponse = {
      data: parsedResponse.items || [],
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: parsedResponse,
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
      };
    }

    return result;
  }
}
