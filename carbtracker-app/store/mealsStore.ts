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
const MIGRATION_VERSION_KEY = 'carbtracker_migration_version';
const CURRENT_MIGRATION_VERSION = 1;

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
      const migrationVersion = await AsyncStorage.getItem(MIGRATION_VERSION_KEY);
      const currentVersion = migrationVersion ? parseInt(migrationVersion) : 0;

      const stored = await AsyncStorage.getItem(MEALS_STORAGE_KEY);
      if (stored) {
        let meals: Meal[] = JSON.parse(stored);

        // Migration 1: Clear stale meal data with timestamp/description bugs
        if (currentVersion < 1) {
          console.log('Migration: Clearing stale meal data to fix timestamp/description bugs');
          meals = [];  // Clear all meals (one-time fix)
          await AsyncStorage.setItem(MIGRATION_VERSION_KEY, '1');
        }

        set({ meals });
      } else if (currentVersion < 1) {
        // No stored meals, but still mark migration as complete
        await AsyncStorage.setItem(MIGRATION_VERSION_KEY, '1');
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
