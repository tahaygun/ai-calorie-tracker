import OpenAI from 'openai';
import { DEFAULT_IMAGE_PROMPT, DEFAULT_TEXT_PROMPT, EXAMPLE_RESPONSE } from './constants/prompts';

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
  textAnalysisPrompt?: string;
  imageAnalysisPrompt?: string;
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
        content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
      }>;
      temperature: number;
      response_format: { type: string };
      max_tokens?: number;
    };
  };
}

export class OpenAIService {
  private client: OpenAI;
  private model: string;
  private debug: boolean;
  private textAnalysisPrompt: string;
  private imageAnalysisPrompt: string;

  constructor(config: OpenAIServiceConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
    this.debug = config.debug || false;
    this.textAnalysisPrompt = config.textAnalysisPrompt || DEFAULT_TEXT_PROMPT;
    this.imageAnalysisPrompt = config.imageAnalysisPrompt || DEFAULT_IMAGE_PROMPT;
  }

  async analyzeFoodData(description: string): Promise<AnalysisResponse> {
    const prompt = `${this.textAnalysisPrompt}
    ${EXAMPLE_RESPONSE}
    
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

  async analyzeImageData(base64Image: string, description?: string): Promise<AnalysisResponse> {
    const prompt = description
      ? `${this.imageAnalysisPrompt} Use this provided description as helper: "${description}".`
      : this.imageAnalysisPrompt;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt + EXAMPLE_RESPONSE },
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
