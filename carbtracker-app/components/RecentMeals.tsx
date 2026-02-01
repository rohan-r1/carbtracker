import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useMealsStore } from '@/store/mealsStore';

export function RecentMeals() {
  const { meals } = useMealsStore();
  const recentMeals = meals.slice(0, 4);

  if (recentMeals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No meals yet. Take your first photo!</Text>
        </View>
      </View>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const now = Date.now();
    const timestamp = new Date(dateString).getTime();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const truncateDescription = (text: string | null) => {
    if (!text) return 'Meal';
    const words = text.split(' ');
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentMeals.map((meal) => (
        <View key={meal.id} style={styles.mealCard}>
          <View style={styles.thumbnailContainer}>
            {meal.photo_url ? (
              <Image source={{ uri: meal.photo_url }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                <Ionicons name="image-outline" size={24} color={Colors.textTertiary} />
              </View>
            )}
          </View>

          <View style={styles.mealInfo}>
            <Text style={styles.mealDescription}>
              {truncateDescription(meal.description)}
            </Text>
            <Text style={styles.mealTime}>
              {formatTimeAgo(meal.created_at)}
            </Text>
          </View>

          <View style={styles.carbsBadge}>
            <Text style={styles.carbsText}>{meal.carbs_logged}g</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: DesignSystem.Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: DesignSystem.Spacing.xxl,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    marginTop: DesignSystem.Spacing.md,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: DesignSystem.BorderRadius.md,
    padding: DesignSystem.Spacing.sm,
    marginBottom: DesignSystem.Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 72,
    ...DesignSystem.Shadows.subtle,
  },
  thumbnailContainer: {
    marginRight: DesignSystem.Spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: DesignSystem.BorderRadius.md,
  },
  placeholderThumbnail: {
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  carbsBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignSystem.BorderRadius.sm,
  },
  carbsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});
