import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import {
  AnalysisResponse,
  FinalEstimateRequest,
  FinalEstimateResponse,
  MealLogRequest,
  Meal,
} from '@/types/api';

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
    const response = await this.client.post<FinalEstimateResponse>(
      API_ENDPOINTS.finalize(request.analysis_id),
      request
    );

    return response.data;
  }

  async logMeal(request: MealLogRequest): Promise<Meal> {
    const response = await this.client.post<Meal>(
      API_ENDPOINTS.logMeal,
      request
    );

    return response.data;
  }

  async getMeals(limit = 50, offset = 0): Promise<Meal[]> {
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
