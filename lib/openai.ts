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
    request: {
      model: string;
      messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content:
          | string
          | Array<{ type: string; text?: string; image_url?: { url: string } }>;
      }>;
      temperature: number;
      response_format: { type: string };
      max_tokens?: number;
    };
  };
}
const exampleResponse = ` Example response: {"meal":[{"item":"vanillestange","nutrition":{"calories":2,"protein":4,"carbs":40,"fat":10,"fiber":2,"grams"50}},{"item":"yumurta","nutrition":{"calories":70,"protein":6,"carbs":1,"fat":5,"fiber":0,"grams"75}}]}.`;
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
    const prompt = `Analyze the following meal description and provide nutritional information for each item. Combine them if you think they are the same item. If it is a meal, combine them and provide the nutritional information for the meal. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Estimate the grams of each item if it is not mentioned. Be precise and realistic with the values. If the description is not clear, provide the best guess. 
    ${exampleResponse}
    
    Meal description: "${description}"`;

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
      data: parsedResponse.meal || parsedResponse.items || [],
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: parsedResponse,
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        request: {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        },
      };
    }

    return result;
  }

  async analyzeImageData(
    base64Image: string,
    description?: string
  ): Promise<AnalysisResponse> {
    const prompt = description
      ? `Analyze this food image with this provided description together: "${description}". Provide nutritional information for each visible item on the image. Use the description as helper. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. If it is a meal, combine them and provide the nutritional information for the meal as one item, don't split into ingredients. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Be precise and realistic with the values. Estimate the grams of each item if it is not mentioned.`
      : 'Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. If it is a meal, combine them and provide the nutritional information for the meal as one item, don\'t split into ingredients. The "nutrition" object should have "calories", "protein", "carbs", "fat", "grams", and "fiber" (all in grams except calories). Be precise and realistic with the values. Estimate the grams of each item if it is not mentioned.';

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt + exampleResponse },
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
      data: parsedResponse.items || parsedResponse.meal || [],
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: JSON.parse(content),
        totalTokens: response.usage?.total_tokens || 0,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        request: {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64`,
                  },
                },
              ],
            },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
          max_tokens: 1000,
        },
      };
    }

    return result;
  }
}
