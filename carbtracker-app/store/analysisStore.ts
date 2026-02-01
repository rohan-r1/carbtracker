import { create } from 'zustand';
import {
  AnalysisResponse,
  FoodConfirmation,
  QuickTapAnswer,
  FinalEstimateResponse,
} from '@/types/api';

interface AnalysisState {
  // Current photo being analyzed
  currentImageUri: string | null;
  description: string | null;

  // Analysis results
  analysisResult: AnalysisResponse | null;
  finalEstimate: FinalEstimateResponse | null;

  // User selections
  foodConfirmations: FoodConfirmation[];
  quickTapAnswers: QuickTapAnswer[];
  manualAdjustment: number;

  // Loading states
  isAnalyzing: boolean;
  isFinalizing: boolean;

  // Actions
  setCurrentImage: (uri: string | null) => void;
  setDescription: (desc: string | null) => void;
  setAnalysisResult: (result: AnalysisResponse | null) => void;
  setFinalEstimate: (estimate: FinalEstimateResponse | null) => void;
  setFoodConfirmation: (foodId: string, selectedName: string) => void;
  setQuickTapAnswer: (questionId: string, answer: string) => void;
  setManualAdjustment: (adjustment: number) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setIsFinalizing: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentImageUri: null,
  description: null,
  analysisResult: null,
  finalEstimate: null,
  foodConfirmations: [],
  quickTapAnswers: [],
  manualAdjustment: 0,
  isAnalyzing: false,
  isFinalizing: false,
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  ...initialState,

  setCurrentImage: (uri) => set({ currentImageUri: uri }),

  setDescription: (desc) => set({ description: desc }),

  setAnalysisResult: (result) => set({ analysisResult: result }),

  setFinalEstimate: (estimate) => set({ finalEstimate: estimate }),

  setFoodConfirmation: (foodId, selectedName) =>
    set((state) => {
      const existing = state.foodConfirmations.find(
        (c) => c.food_id === foodId
      );
      if (existing) {
        return {
          foodConfirmations: state.foodConfirmations.map((c) =>
            c.food_id === foodId ? { ...c, selected_name: selectedName } : c
          ),
        };
      }
      return {
        foodConfirmations: [
          ...state.foodConfirmations,
          { food_id: foodId, selected_name: selectedName },
        ],
      };
    }),

  setQuickTapAnswer: (questionId, answer) =>
    set((state) => {
      const existing = state.quickTapAnswers.find(
        (a) => a.question_id === questionId
      );
      if (existing) {
        return {
          quickTapAnswers: state.quickTapAnswers.map((a) =>
            a.question_id === questionId ? { ...a, answer } : a
          ),
        };
      }
      return {
        quickTapAnswers: [
          ...state.quickTapAnswers,
          { question_id: questionId, answer },
        ],
      };
    }),

  setManualAdjustment: (adjustment) => set({ manualAdjustment: adjustment }),

  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),

  setIsFinalizing: (loading) => set({ isFinalizing: loading }),

  reset: () => set(initialState),
}));
