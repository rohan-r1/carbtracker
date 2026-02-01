import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_API } from '@/constants/api';
import {
  AnalysisResponse,
  FinalEstimateRequest,
  FinalEstimateResponse,
  MealLogRequest,
  Meal,
} from '@/types/api';

// Mock data for testing without backend
const createMockAnalysisResponse = (imageUri: string, description?: string): AnalysisResponse => {
  // Generate more realistic mock foods
  const mockFoods = [
    { name: 'Chicken breast with rice', carbs: 42, alt: 'Grilled chicken with quinoa', altCarbs: 38 },
    { name: 'Pasta with tomato sauce', carbs: 58, alt: 'Spaghetti marinara', altCarbs: 55 },
    { name: 'Salad with chicken', carbs: 15, alt: 'Caesar salad', altCarbs: 22 },
    { name: 'Sandwich', carbs: 35, alt: 'Turkey sandwich', altCarbs: 32 },
    { name: 'Bowl with vegetables and protein', carbs: 40, alt: 'Rice bowl', altCarbs: 45 },
  ];

  const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];

  return {
    analysis_id: `mock-${Date.now()}`,
    foods: [
      {
        id: 'food-1',
        most_likely: {
          name: description || randomFood.name,
          confidence: 0.85,
          carbs: randomFood.carbs,
        },
        alternatives: [
          {
            name: randomFood.alt,
            confidence: 0.65,
            carbs: randomFood.altCarbs,
          },
        ],
        portion: 'Medium serving',
      },
    ],
    quick_tap_questions: [
      {
        id: 'q1',
        food_id: 'food-1',
        question: 'How large was the portion?',
        options: [
          { label: 'Small', carb_adjustment: -10 },
          { label: 'Medium', carb_adjustment: 0 },
          { label: 'Large', carb_adjustment: 15 },
        ],
        carb_impact: null,
      },
    ],
    preliminary_estimate: {
      min: randomFood.carbs - 10,
      max: randomFood.carbs + 10,
      likely: randomFood.carbs,
    },
  };
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // 60 seconds for image analysis
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async analyzeImage(
    imageUri: string,
    description?: string
  ): Promise<AnalysisResponse> {
    // Use mock data if backend not available
    if (USE_MOCK_API) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return createMockAnalysisResponse(imageUri, description);
    }

    const formData = new FormData();

    // Get file extension and mime type
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;

    // Append image file
    formData.append('image', {
      uri: imageUri,
      name: `meal.${fileType}`,
      type: mimeType,
    } as any);

    if (description) {
      formData.append('description', description);
    }

    const response = await this.client.post<AnalysisResponse>(
      API_ENDPOINTS.analyze,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async finalizeEstimate(
    request: FinalEstimateRequest
  ): Promise<FinalEstimateResponse> {
    // Use mock data if backend not available
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        analysis_id: request.analysis_id,
        total_carbs: request.manual_adjustment || 45,
        breakdown: request.food_confirmations.map(fc => ({
          name: fc.selected_name,
          carbs: Math.floor(Math.random() * 30) + 15,
          portion: 'Medium',
        })),
        confidence_level: 'Medium',
      };
    }

    const response = await this.client.post<FinalEstimateResponse>(
      API_ENDPOINTS.finalize(request.analysis_id),
      request
    );

    return response.data;
  }

  async logMeal(request: MealLogRequest): Promise<Meal> {
    // Use mock data if backend not available
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: `meal-${Date.now()}`,
        photo_url: null, // Will be filled with local URI by caller
        description: null, // Will be filled with local description by caller
        carbs_logged: request.final_carbs,
        created_at: new Date().toISOString(),
      };
    }

    const response = await this.client.post<Meal>(
      API_ENDPOINTS.logMeal,
      request
    );

    return response.data;
  }

  async getMeals(limit = 50, offset = 0): Promise<Meal[]> {
    // Use mock data if backend not available
    if (USE_MOCK_API) {
      return []; // Mock mode uses local storage only
    }

    const response = await this.client.get<Meal[]>(API_ENDPOINTS.meals, {
      params: { limit, offset },
    });

    return response.data;
  }

  async getMeal(mealId: string): Promise<Meal> {
    const response = await this.client.get<Meal>(
      API_ENDPOINTS.mealById(mealId)
    );

    return response.data;
  }

  async updateMeal(
    mealId: string,
    data: { carbs_logged?: number; description?: string }
  ): Promise<Meal> {
    const response = await this.client.put<Meal>(
      API_ENDPOINTS.mealById(mealId),
      null,
      { params: data }
    );

    return response.data;
  }

  async deleteMeal(mealId: string): Promise<void> {
    await this.client.delete(API_ENDPOINTS.mealById(mealId));
  }
}

export const apiClient = new ApiClient();
