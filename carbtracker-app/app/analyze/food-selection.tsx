import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';

interface FoodOption {
  id: string;
  name: string;
  carbs: number;
  confidence: number;
  isAlternative: boolean;
  parentName?: string;
}

export default function FoodSelectionScreen() {
  const {
    currentImageUri,
    analysisResult,
    selectedFoodIds,
    setSelectedFoodIds,
    setDescription,
    description,
  } = useAnalysisStore();

  const [localDescription, setLocalDescription] = useState(description || '');
  const [requiresDescription, setRequiresDescription] = useState(false);

  // Build flat list of all food options (most likely + alternatives)
  const allFoodOptions: FoodOption[] = [];

  if (analysisResult) {
    analysisResult.foods.forEach((food) => {
      // Add most likely
      allFoodOptions.push({
        id: food.id,
        name: food.most_likely.name,
        carbs: food.most_likely.carbs,
        confidence: food.most_likely.confidence,
        isAlternative: false,
      });

      // Add alternatives
      food.alternatives.forEach((alt, index) => {
        allFoodOptions.push({
          id: `${food.id}_alt_${index}`,
          name: alt.name,
          carbs: alt.carbs,
          confidence: alt.confidence,
          isAlternative: true,
          parentName: food.most_likely.name,
        });
      });
    });
  }

  // Check if description is required (any food with confidence < 70)
  useEffect(() => {
    if (analysisResult) {
      const hasLowConfidence = analysisResult.foods.some(
        (food) => food.most_likely.confidence < 70
      );
      setRequiresDescription(hasLowConfidence);
    }
  }, [analysisResult]);

  const toggleFoodSelection = (foodId: string) => {
    if (selectedFoodIds.includes(foodId)) {
      setSelectedFoodIds(selectedFoodIds.filter((id) => id !== foodId));
    } else {
      setSelectedFoodIds([...selectedFoodIds, foodId]);
    }
  };

  const handleContinue = () => {
    if (selectedFoodIds.length === 0) {
      return; // Need at least one food selected
    }

    if (requiresDescription && !localDescription.trim()) {
      return; // Description required but not provided
    }

    // Save description to store
    setDescription(localDescription || null);

    // Navigate to portion sizes
    router.push('/analyze/portion-sizes');
  };

  if (!analysisResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis results found</Text>
      </View>
    );
  }

  const canContinue = selectedFoodIds.length > 0 &&
    (!requiresDescription || localDescription.trim().length > 0);

  return (
    <View style={styles.container}>
      {/* Header with image */}
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
          <Text style={styles.headerTitle}>What's in your meal?</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Info text */}
        <Text style={styles.infoText}>
          Select all the foods you see (tap to select/deselect)
        </Text>

        {/* Food options - checkboxes */}
        <View style={styles.foodList}>
          {allFoodOptions.map((option) => {
            const isSelected = selectedFoodIds.includes(option.id);

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.foodOption,
                  isSelected && styles.foodOptionSelected,
                  option.isAlternative && styles.foodOptionAlternative,
                ]}
                onPress={() => toggleFoodSelection(option.id)}
              >
                <View style={styles.checkbox}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={Colors.accent} />
                  )}
                </View>
                <View style={styles.foodOptionContent}>
                  <Text style={styles.foodName}>{option.name}</Text>
                  {option.isAlternative && option.parentName && (
                    <Text style={styles.alternativeNote}>
                      (alternative to {option.parentName})
                    </Text>
                  )}
                  <Text style={styles.foodCarbs}>{option.carbs}g carbs</Text>
                </View>
                <Text style={styles.confidenceText}>{option.confidence}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Conditional description field */}
        {requiresDescription && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              {' '}Help us identify uncertain items:
            </Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="e.g., Chicken curry with rice, or Mixed berry smoothie..."
              placeholderTextColor={Colors.textSecondary}
              value={localDescription}
              onChangeText={setLocalDescription}
              multiline
              numberOfLines={2}
            />
            <Text style={styles.descriptionHint}>
              This helps improve carb accuracy for complex meals
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <View style={styles.selectionCount}>
          <Text style={styles.selectionCountText}>
            {selectedFoodIds.length} {selectedFoodIds.length === 1 ? 'item' : 'items'} selected
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.base,
  },
  infoText: {
    ...DesignSystem.Typography.body,
    textAlign: 'center',
    marginBottom: DesignSystem.Spacing.lg,
    color: Colors.textSecondary,
  },
  foodList: {
    gap: DesignSystem.Spacing.sm,
  },
  foodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: DesignSystem.Spacing.md,
  },
  foodOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  foodOptionAlternative: {
    marginLeft: DesignSystem.Spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: DesignSystem.BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodOptionContent: {
    flex: 1,
  },
  foodName: {
    ...DesignSystem.Typography.body,
    fontWeight: '600',
  },
  alternativeNote: {
    ...DesignSystem.Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  foodCarbs: {
    ...DesignSystem.Typography.bodySmall,
    marginTop: 2,
  },
  confidenceText: {
    ...DesignSystem.Typography.caption,
    color: Colors.textSecondary,
  },
  descriptionSection: {
    marginTop: DesignSystem.Spacing.xl,
    padding: DesignSystem.Spacing.md,
    backgroundColor: Colors.warningLight,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  descriptionLabel: {
    ...DesignSystem.Typography.label,
    color: Colors.text,
    marginBottom: DesignSystem.Spacing.sm,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderRadius: DesignSystem.BorderRadius.md,
    padding: DesignSystem.Spacing.md,
    ...DesignSystem.Typography.body,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionHint: {
    ...DesignSystem.Typography.caption,
    marginTop: DesignSystem.Spacing.xs,
    color: Colors.textSecondary,
  },
  footer: {
    padding: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.xxxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...DesignSystem.Shadows.medium,
  },
  selectionCount: {
    marginBottom: DesignSystem.Spacing.sm,
  },
  selectionCountText: {
    ...DesignSystem.Typography.bodySmall,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  continueButton: {
    ...DesignSystem.Button.accent,
    paddingVertical: DesignSystem.Spacing.base,
    flexDirection: 'row',
    gap: DesignSystem.Spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    ...DesignSystem.Button.accentText,
  },
});
