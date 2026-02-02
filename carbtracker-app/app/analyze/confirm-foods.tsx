import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';
import { FoodItem, FoodAlternative } from '@/types/api';

function ConfidenceBadge({ confidence }: { confidence: number }) {
  let color = Colors.confidenceHigh;
  let label = 'High';

  if (confidence < 60) {
    color = Colors.confidenceLow;
    label = 'Low';
  } else if (confidence < 85) {
    color = Colors.confidenceMedium;
    label = 'Medium';
  }

  return (
    <View style={[styles.confidenceBadge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.confidenceText, { color }]}>{label}</Text>
    </View>
  );
}

interface FoodOptionProps {
  food: FoodAlternative;
  isSelected: boolean;
  onSelect: () => void;
}

function FoodOption({ food, isSelected, onSelect }: FoodOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.foodOption, isSelected && styles.foodOptionSelected]}
      onPress={onSelect}
    >
      <View style={styles.foodOptionContent}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodCarbs}>{food.carbs}g carbs</Text>
      </View>
      <View style={styles.foodOptionRight}>
        <ConfidenceBadge confidence={food.confidence} />
        <View
          style={[
            styles.radioCircle,
            isSelected && styles.radioCircleSelected,
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface FoodCardProps {
  food: FoodItem;
  selectedName: string;
  onSelectFood: (name: string) => void;
}

function FoodCard({ food, selectedName, onSelectFood }: FoodCardProps) {
  const allOptions = [
    food.most_likely,
    ...food.alternatives,
  ];

  return (
    <View style={styles.foodCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>What is this?</Text>
          {food.portion && (
            <Text style={styles.portionText}>Portion: {food.portion}</Text>
          )}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {allOptions.map((option, index) => (
          <FoodOption
            key={`${food.id}-${index}`}
            food={option}
            isSelected={selectedName === option.name}
            onSelect={() => onSelectFood(option.name)}
          />
        ))}
      </View>
    </View>
  );
}

export default function ConfirmFoodsScreen() {
  const {
    currentImageUri,
    analysisResult,
    foodConfirmations,
    setFoodConfirmation,
  } = useAnalysisStore();


  // Initialize selections with most likely options
  const getSelectedName = (food: FoodItem) => {
    const existing = foodConfirmations.find((c) => c.food_id === food.id);
    return existing?.selected_name || food.most_likely.name;
  };

  const handleContinue = () => {
    // Save all selections
    analysisResult?.foods.forEach((food) => {
      const selected = getSelectedName(food);
      setFoodConfirmation(food.id, selected);
    });

    // Check if there are quick-tap questions
    if (
      analysisResult?.quick_tap_questions &&
      analysisResult.quick_tap_questions.length > 0
    ) {
      router.push('/analyze/quick-tap');
    } else {
      router.push('/analyze/final-estimate');
    }
  };

  if (!analysisResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis results found</Text>
      </View>
    );
  }

  // Calculate preliminary total
  const preliminaryTotal = analysisResult.foods.reduce((sum, food) => {
    const selected = getSelectedName(food);
    const option = [food.most_likely, ...food.alternatives].find(
      (o) => o.name === selected
    );
    return sum + (option?.carbs || 0);
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header with image preview */}
      <View style={styles.header}>
        {currentImageUri && (
          <Image source={{ uri: currentImageUri }} style={styles.headerImage} />
        )}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Foods</Text>
        </View>
      </View>

      {/* Preliminary estimate */}
      <View style={styles.estimateBar}>
        <Text style={styles.estimateLabel}>Preliminary Estimate</Text>
        <Text style={styles.estimateValue}>{preliminaryTotal}g</Text>
      </View>

      {/* Food cards */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {analysisResult.foods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            selectedName={getSelectedName(food)}
            onSelectFood={(name) => setFoodConfirmation(food.id, name)}
          />
        ))}
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...DesignSystem.Typography.body,
    color: Colors.error,
  },
  header: {
    height: 180,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: DesignSystem.BorderRadius.round,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...DesignSystem.Typography.h2,
    color: Colors.textInverse,
    marginLeft: DesignSystem.Spacing.md,
  },
  estimateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: DesignSystem.Spacing.lg,
    paddingVertical: DesignSystem.Spacing.md,
  },
  estimateLabel: {
    ...DesignSystem.Typography.label,
    color: 'rgba(0,0,0,0.7)',
  },
  estimateValue: {
    ...DesignSystem.Typography.displaySmall,
    color: Colors.textOnAccent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.base,
  },
  foodCard: {
    ...DesignSystem.Card.base,
    padding: DesignSystem.Spacing.lg,
    marginBottom: DesignSystem.Spacing.base,
  },
  cardHeader: {
    marginBottom: DesignSystem.Spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    ...DesignSystem.Typography.h4,
    marginBottom: 4,
  },
  portionText: {
    ...DesignSystem.Typography.bodySmall,
  },
  optionsContainer: {
    gap: DesignSystem.Spacing.sm,
  },
  foodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  foodOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  foodOptionContent: {
    flex: 1,
  },
  foodName: {
    ...DesignSystem.Typography.body,
    fontWeight: '500',
  },
  foodCarbs: {
    ...DesignSystem.Typography.bodySmall,
    marginTop: 2,
  },
  foodOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.Spacing.md,
  },
  confidenceBadge: {
    ...DesignSystem.Badge.base,
  },
  confidenceText: {
    ...DesignSystem.Badge.text,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: DesignSystem.BorderRadius.round,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: DesignSystem.BorderRadius.round,
    backgroundColor: Colors.accent,
  },
  footer: {
    padding: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.xxxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...DesignSystem.Shadows.medium,
  },
  continueButton: {
    ...DesignSystem.Button.accent,
    paddingVertical: DesignSystem.Spacing.base,
    flexDirection: 'row',
    gap: DesignSystem.Spacing.sm,
  },
  continueText: {
    ...DesignSystem.Button.accentText,
  },
});
