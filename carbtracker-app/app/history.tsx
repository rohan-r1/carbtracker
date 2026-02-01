import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useMealsStore } from '@/store/mealsStore';
import { apiClient } from '@/services/api';
import { Meal } from '@/types/api';

// Group meals by date
function groupMealsByDate(meals: Meal[]): { date: string; meals: Meal[] }[] {
  const groups: { [key: string]: Meal[] } = {};

  meals.forEach((meal) => {
    const date = new Date(meal.created_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
  });

  return Object.entries(groups).map(([date, meals]) => ({ date, meals }));
}

function MealCard({ meal }: { meal: Meal }) {
  const time = new Date(meal.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity style={styles.mealCard}>
      {meal.photo_url ? (
        <Image source={{ uri: meal.photo_url }} style={styles.mealImage} />
      ) : (
        <View style={[styles.mealImage, styles.mealImagePlaceholder]}>
          <Ionicons name="image-outline" size={24} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.mealInfo}>
        <Text style={styles.mealDescription} numberOfLines={2}>
          {meal.description || 'Meal'}
        </Text>
        <Text style={styles.mealTime}>{time}</Text>
      </View>
      <View style={styles.carbsBadge}>
        <Text style={styles.carbsValue}>{meal.carbs_logged}g</Text>
        <Text style={styles.carbsLabel}>carbs</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { meals, loadFromStorage } = useMealsStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFromStorage(); // Load from local AsyncStorage
    setRefreshing(false);
  };

  // No useEffect needed - meals are already loaded from storage on app start

  const groupedMeals = groupMealsByDate(meals);

  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="nutrition-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Meals Yet</Text>
        <Text style={styles.emptyText}>
          Take a photo of your meal to get started with carb tracking.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={groupedMeals}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{item.date}</Text>
            {item.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignSystem.Spacing.lg,
    paddingVertical: DesignSystem.Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: DesignSystem.Spacing.xs,
  },
  headerTitle: {
    ...DesignSystem.Typography.h3,
    color: Colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignSystem.Spacing.xxxl,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    ...DesignSystem.Typography.h2,
    marginTop: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.sm,
  },
  emptyText: {
    ...DesignSystem.Typography.body,
    textAlign: 'center',
  },
  listContent: {
    padding: DesignSystem.Spacing.base,
  },
  dateGroup: {
    marginBottom: DesignSystem.Spacing.xl,
  },
  dateHeader: {
    ...DesignSystem.Typography.label,
    marginBottom: DesignSystem.Spacing.md,
    textTransform: 'uppercase',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    ...DesignSystem.Card.base,
    padding: DesignSystem.Spacing.md,
    marginBottom: DesignSystem.Spacing.sm,
  },
  mealImage: {
    width: 56,
    height: 56,
    borderRadius: DesignSystem.BorderRadius.md,
  },
  mealImagePlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
    marginLeft: DesignSystem.Spacing.md,
  },
  mealDescription: {
    ...DesignSystem.Typography.body,
    fontWeight: '500',
    marginBottom: 4,
  },
  mealTime: {
    ...DesignSystem.Typography.bodySmall,
  },
  carbsBadge: {
    alignItems: 'center',
    paddingHorizontal: DesignSystem.Spacing.md,
  },
  carbsValue: {
    ...DesignSystem.Typography.h3,
    color: Colors.accent,
  },
  carbsLabel: {
    ...DesignSystem.Typography.caption,
  },
});
