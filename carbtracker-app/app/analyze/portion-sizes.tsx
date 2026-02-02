import { useState, useEffect } from 'react';
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
import { FoodItem, PortionOption } from '@/types/api';

interface FoodWithOptions {
  id: string;
  name: string;
  carbs: number;
  portionOptions: PortionOption[];
}

export default function PortionSizesScreen() {
  const {
    currentImageUri,
    analysisResult,
    selectedFoodIds,
    portionSelections,
    setPortionSelection,
  } = useAnalysisStore();

  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);

  // Get selected foods with their portion options
  const selectedFoods: FoodWithOptions[] = [];

  if (analysisResult) {
    selectedFoodIds.forEach((selectedId) => {
      // Check if it's a main food or alternative
      if (selectedId.includes('_alt_')) {
        // It's an alternative
        const [foodId, , altIndex] = selectedId.split('_');
        const food = analysisResult.foods.find((f) => f.id === foodId);
        if (food && food.alternatives[parseInt(altIndex)]) {
          const alt = food.alternatives[parseInt(altIndex)];
          selectedFoods.push({
            id: selectedId,
            name: alt.name,
            carbs: alt.carbs,
            portionOptions: food.portion_options || [],
          });
        }
      } else {
        // It's a main food
        const food = analysisResult.foods.find((f) => f.id === selectedId);
        if (food) {
          selectedFoods.push({
            id: selectedId,
            name: food.most_likely.name,
            carbs: food.most_likely.carbs,
            portionOptions: food.portion_options || [],
          });
        }
      }
    });
  }

  const currentFood = selectedFoods[currentFoodIndex];

  const getSelectedPortion = (foodId: string) => {
    const selection = portionSelections.find((s) => s.foodId === foodId);
    return selection?.portionLabel || null;
  };

  // Pre-select "Regular" portion by default when moving to a new food
  useEffect(() => {
    if (currentFood && !getSelectedPortion(currentFood.id)) {
      const regularOption = currentFood.portionOptions.find(
        (opt) => opt.label === 'Regular'
      );
      if (regularOption) {
        setPortionSelection({
          foodId: currentFood.id,
          foodName: currentFood.name,
          portionLabel: regularOption.label,
          multiplier: regularOption.multiplier,
        });
      }
    }
  }, [currentFoodIndex, currentFood]);

  const handleSelectPortion = (option: PortionOption) => {
    if (currentFood) {
      setPortionSelection({
        foodId: currentFood.id,
        foodName: currentFood.name,
        portionLabel: option.label,
        multiplier: option.multiplier,
      });
    }
  };

  const handleNext = () => {
    if (currentFoodIndex < selectedFoods.length - 1) {
      setCurrentFoodIndex(currentFoodIndex + 1);
    } else {
      // All done, go to final estimate
      router.push('/analyze/final-estimate');
    }
  };

  const handleBack = () => {
    if (currentFoodIndex > 0) {
      setCurrentFoodIndex(currentFoodIndex - 1);
    } else {
      router.back();
    }
  };

  if (!currentFood) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No foods selected</Text>
      </View>
    );
  }

  const selectedPortion = getSelectedPortion(currentFood.id);
  const progress = (currentFoodIndex + 1) / selectedFoods.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portion Sizes</Text>
        <Text style={styles.headerSubtitle}>
          {currentFoodIndex + 1} of {selectedFoods.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Meal Photo */}
      <View style={styles.photoSection}>
        {currentImageUri && (
          <Image
            source={{ uri: currentImageUri }}
            style={styles.mealPhoto}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Question Section */}
      <ScrollView style={styles.questionSection} contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            How much {currentFood.name.toLowerCase()}?
          </Text>

          <View style={styles.optionsGrid}>
            {currentFood.portionOptions.map((option, index) => {
              const isSelected = selectedPortion === option.label;
              const isRegular = option.label === 'Regular';

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.portionOption,
                    isSelected && styles.portionOptionSelected,
                    isSelected && isRegular && styles.portionOptionRegularSelected,
                  ]}
                  onPress={() => handleSelectPortion(option)}
                >
                  <Text
                    style={[
                      styles.portionLabel,
                      isSelected && styles.portionLabelSelected,
                      isSelected && isRegular && styles.portionLabelRegularSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.portionCarbs,
                    isSelected && isRegular && styles.portionCarbsRegularSelected,
                  ]}>
                    ~{Math.round(currentFood.carbs * option.multiplier)}g
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Select the portion size that best matches what you see in the photo
          </Text>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedPortion && styles.continueButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedPortion}
        >
          <Text style={styles.continueText}>
            {currentFoodIndex < selectedFoods.length - 1
              ? 'Next Food'
              : 'See Estimate'}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingTop: 60,
    paddingHorizontal: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.md,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: DesignSystem.BorderRadius.round,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    ...DesignSystem.Typography.h3,
    flex: 1,
    marginLeft: DesignSystem.Spacing.md,
  },
  headerSubtitle: {
    ...DesignSystem.Typography.bodySmall,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.borderLight,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  photoSection: {
    height: '30%',
    width: '100%',
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  mealPhoto: {
    width: '100%',
    height: '100%',
  },
  questionSection: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.base,
  },
  questionCard: {
    ...DesignSystem.Card.base,
    padding: DesignSystem.Spacing.lg,
  },
  questionText: {
    ...DesignSystem.Typography.h3,
    marginBottom: DesignSystem.Spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: DesignSystem.Spacing.sm,
  },
  portionOption: {
    flex: 1,
    paddingHorizontal: DesignSystem.Spacing.sm,
    paddingVertical: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  portionOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  portionOptionRegularSelected: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  portionLabel: {
    ...DesignSystem.Typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  portionLabelSelected: {
    color: Colors.accentDark,
    fontWeight: '600',
  },
  portionLabelRegularSelected: {
    color: '#FFC107', // Yellow text
    fontWeight: '600',
  },
  portionCarbs: {
    ...DesignSystem.Typography.caption,
    textAlign: 'center',
    marginTop: 4,
    color: Colors.textSecondary,
  },
  portionCarbsRegularSelected: {
    color: '#FFC107', // Yellow text for carbs too
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoLight,
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.base,
    marginTop: DesignSystem.Spacing.base,
    gap: DesignSystem.Spacing.md,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  infoText: {
    ...DesignSystem.Typography.bodySmall,
    flex: 1,
    lineHeight: 20,
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
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    ...DesignSystem.Button.accentText,
  },
});
