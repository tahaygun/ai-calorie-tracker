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
const exampleResponse = ` Example response: {"meal":[{"item":"vanillestange","nutrition":{"calories":2,"protein":4,"carbs":40,"fat":10,"fiber":2}},{"item":"yumurta","nutrition":{"calories":70,"protein":6,"carbs":1,"fat":5,"fiber":0}}]}.`;
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
    const prompt = `Analyze the following meal description and provide nutritional information for each item. Combine them if you think they are the same item or they are a meal together. Format the response as a JSON array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values. If the description is not clear, provide the best guess. 
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
      data: parsedResponse.meal || [],
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
      ? `Analyze this food image with the provided description together: "${description}". Provide nutritional information for each visible item on the image, even if it is not listed in the description. Use the description as helper. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values.`
      : 'Analyze this food image and provide nutritional information for each visible item. Format the response as a JSON object with an "items" array where each object has "item" and "nutrition" properties. The "nutrition" object should have "calories", "protein", "carbs", "fat", and "fiber" (all in grams except calories). Be precise and realistic with the values.';

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
      data: parsedResponse.items || [],
    };

    if (this.debug) {
      result.debugInfo = {
        rawResponse: response,
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
