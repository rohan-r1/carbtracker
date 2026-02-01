import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '@/types/api';

interface MealsState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setMeals: (meals: Meal[]) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (mealId: string, updates: Partial<Meal>) => void;
  removeMeal: (mealId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const MEALS_STORAGE_KEY = 'carbtracker_meals';

export const useMealsStore = create<MealsState>((set, get) => ({
  meals: [],
  isLoading: false,
  error: null,

  setMeals: (meals) => {
    set({ meals });
    get().saveToStorage();
  },

  addMeal: (meal) => {
    set((state) => ({
      meals: [meal, ...state.meals],
    }));
    get().saveToStorage();
  },

  updateMeal: (mealId, updates) => {
    set((state) => ({
      meals: state.meals.map((m) =>
        m.id === mealId ? { ...m, ...updates } : m
      ),
    }));
    get().saveToStorage();
  },

  removeMeal: (mealId) => {
    set((state) => ({
      meals: state.meals.filter((m) => m.id !== mealId),
    }));
    get().saveToStorage();
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(MEALS_STORAGE_KEY);
      if (stored) {
        set({ meals: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load meals from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      await AsyncStorage.setItem(
        MEALS_STORAGE_KEY,
        JSON.stringify(get().meals)
      );
    } catch (error) {
      console.error('Failed to save meals to storage:', error);
    }
  },
}));
