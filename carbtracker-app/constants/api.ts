// API Configuration
// Change this to your actual API URL when deploying

// Enable mock mode for testing without backend
export const USE_MOCK_API = false; // Backend is running!

// TEMPORARY: Testing with production backend
// For local development with Expo Go on physical device,
// use your computer's local IP address
export const API_BASE_URL = 'https://carb-tracker.up.railway.app'; // TESTING: Always use production
// export const API_BASE_URL = __DEV__
//   ? 'http://192.168.4.38:8000' // Your local IP
//   : 'https://carb-tracker.up.railway.app'; // Railway production URL

export const API_ENDPOINTS = {
  analyze: '/api/v1/analyze',
  finalize: (analysisId: string) => `/api/v1/analyze/${analysisId}/finalize`,
  meals: '/api/v1/meals',
  mealById: (mealId: string) => `/api/v1/meals/${mealId}`,
  logMeal: '/api/v1/meals/log',
};
