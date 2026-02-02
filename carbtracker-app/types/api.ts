// API Types for CarbTracker

export interface QuickTapOption {
  label: string;
  carb_adjustment: number;
}

export interface QuickTapQuestion {
  id: string;
  food_id: string | null;
  question: string;
  options: QuickTapOption[];
  carb_impact: number | null;
}

export interface FoodAlternative {
  name: string;
  confidence: number;
  carbs: number;
}

export interface PortionOption {
  label: string;
  multiplier: number;
}

export interface FoodItem {
  id: string;
  most_likely: FoodAlternative;
  alternatives: FoodAlternative[];
  portion: string | null;
  portion_options: PortionOption[];
}

export interface PreliminaryEstimate {
  min: number;
  max: number;
  likely: number;
}

export interface AnalysisResponse {
  analysis_id: string;
  foods: FoodItem[];
  quick_tap_questions: QuickTapQuestion[] | null;
  preliminary_estimate: PreliminaryEstimate;
}

export interface FoodConfirmation {
  food_id: string;
  selected_name: string;
}

export interface QuickTapAnswer {
  question_id: string;
  answer: string;
}

export interface FinalEstimateRequest {
  analysis_id: string;
  food_confirmations: FoodConfirmation[];
  quick_tap_answers: QuickTapAnswer[];
  manual_adjustment?: number;
}

export interface FoodBreakdown {
  name: string;
  carbs: number;
  portion: string | null;
}

export interface FinalEstimateResponse {
  analysis_id: string;
  total_carbs: number;
  breakdown: FoodBreakdown[];
  confidence_level: 'High' | 'Medium' | 'Low';
}

export interface MealLogRequest {
  analysis_id: string;
  final_carbs: number;
}

export interface Meal {
  id: string;
  photo_url: string | null;
  description: string | null;
  carbs_logged: number | null;
  created_at: string;
}
