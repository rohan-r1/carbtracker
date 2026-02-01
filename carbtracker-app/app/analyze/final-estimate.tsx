import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';
import { useMealsStore } from '@/store/mealsStore';
import { apiClient } from '@/services/api';

function AdjustmentSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const largeAdjustments = [-10, -5, 0, +5, +10, +15, +20];
  const fineAdjustments = [-1, +1];

  const handleAdjustment = (increment: number) => {
    onChange(value + increment);
  };

  return (
    <View style={styles.adjustmentContainer}>
      <Text style={styles.adjustmentTitle}>Manual Adjustment</Text>

      {/* Show current adjustment if non-zero */}
      {value !== 0 && (
        <View style={styles.currentAdjustmentDisplay}>
          <Text style={styles.currentAdjustmentText}>
            Current adjustment: {value > 0 ? '+' : ''}{value}g
          </Text>
        </View>
      )}

      {/* Quick Adjustments */}
      <Text style={styles.adjustmentSubtitle}>Quick Adjustments</Text>
      <View style={styles.adjustmentButtons}>
        {largeAdjustments.map((adj) => (
          <TouchableOpacity
            key={adj}
            style={[
              styles.adjustmentButton,
              value === adj && styles.adjustmentButtonSelected,
            ]}
            onPress={() => onChange(adj)}
          >
            <Text
              style={[
                styles.adjustmentText,
                value === adj && styles.adjustmentTextSelected,
              ]}
            >
              {adj > 0 ? `+${adj}` : adj}g
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fine-Tune */}
      <Text style={styles.adjustmentSubtitle}>Fine-Tune (±1g)</Text>
      <View style={styles.fineTuneButtons}>
        {fineAdjustments.map((adj) => (
          <TouchableOpacity
            key={adj}
            style={styles.fineTuneButton}
            onPress={() => handleAdjustment(adj)}
          >
            <Text style={styles.fineTuneText}>
              {adj > 0 ? `+${adj}` : adj}g
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function FinalEstimateScreen() {
  const {
    analysisResult,
    foodConfirmations,
    quickTapAnswers,
    manualAdjustment,
    setManualAdjustment,
    setFinalEstimate,
    isFinalizing,
    setIsFinalizing,
    reset,
  } = useAnalysisStore();

  const { addMeal } = useMealsStore();
  const [isLogging, setIsLogging] = useState(false);

  if (!analysisResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis results found</Text>
      </View>
    );
  }

  // Calculate total from confirmed foods
  const calculateTotal = () => {
    let total = 0;

    analysisResult.foods.forEach((food) => {
      const confirmation = foodConfirmations.find((c) => c.food_id === food.id);
      const selectedName = confirmation?.selected_name || food.most_likely.name;

      const allOptions = [food.most_likely, ...food.alternatives];
      const selected = allOptions.find((o) => o.name === selectedName);
      total += selected?.carbs || 0;
    });

    // Add quick-tap adjustments
    if (analysisResult.quick_tap_questions) {
      analysisResult.quick_tap_questions.forEach((question) => {
        const answer = quickTapAnswers.find(
          (a) => a.question_id === question.id
        );
        if (answer) {
          const option = question.options.find(
            (o) => o.label === answer.answer
          );
          total += option?.carb_adjustment || 0;
        }
      });
    }

    // Add manual adjustment
    total += manualAdjustment;

    return Math.max(0, Math.round(total));
  };

  const totalCarbs = calculateTotal();

  // Build breakdown
  const breakdown = analysisResult.foods.map((food) => {
    const confirmation = foodConfirmations.find((c) => c.food_id === food.id);
    const selectedName = confirmation?.selected_name || food.most_likely.name;
    const allOptions = [food.most_likely, ...food.alternatives];
    const selected = allOptions.find((o) => o.name === selectedName);

    return {
      name: selectedName,
      carbs: selected?.carbs || 0,
      portion: food.portion,
    };
  });

  const handleLogMeal = async () => {
    setIsLogging(true);

    try {
      // First finalize the estimate on the server
      const finalResult = await apiClient.finalizeEstimate({
        analysis_id: analysisResult.analysis_id,
        food_confirmations: foodConfirmations,
        quick_tap_answers: quickTapAnswers,
        manual_adjustment: manualAdjustment,
      });

      setFinalEstimate(finalResult);

      // Then log the meal
      const meal = await apiClient.logMeal({
        analysis_id: analysisResult.analysis_id,
        final_carbs: totalCarbs,
      });

      addMeal(meal);

      // Reset loading state before navigation to prevent state update on unmounted component
      setIsLogging(false);

      Alert.alert('Meal Logged!', `${totalCarbs}g carbs logged successfully.`, [
        {
          text: 'OK',
          onPress: () => {
            reset();
            router.replace('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      setIsLogging(false);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Final Estimate</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Big number display */}
        <View style={styles.mainEstimate}>
          <Text style={styles.carbsValue}>{totalCarbs}</Text>
          <Text style={styles.carbsUnit}>grams carbs</Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownRow}>
              <View style={styles.breakdownInfo}>
                <Text style={styles.breakdownName}>{item.name}</Text>
                {item.portion && (
                  <Text style={styles.breakdownPortion}>{item.portion}</Text>
                )}
              </View>
              <Text style={styles.breakdownCarbs}>{item.carbs}g</Text>
            </View>
          ))}

          {quickTapAnswers.length > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownName}>Quick-tap adjustments</Text>
              <Text style={styles.breakdownCarbs}>
                {quickTapAnswers.reduce((sum, answer) => {
                  const question = analysisResult.quick_tap_questions?.find(
                    (q) => q.id === answer.question_id
                  );
                  const option = question?.options.find(
                    (o) => o.label === answer.answer
                  );
                  return sum + (option?.carb_adjustment || 0);
                }, 0)}
                g
              </Text>
            </View>
          )}

          {manualAdjustment !== 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownName}>Manual adjustment</Text>
              <Text style={styles.breakdownCarbs}>
                {manualAdjustment > 0 ? '+' : ''}
                {manualAdjustment}g
              </Text>
            </View>
          )}
        </View>

        {/* Manual adjustment */}
        <AdjustmentSlider
          value={manualAdjustment}
          onChange={setManualAdjustment}
        />

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={18} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            This is an estimate only. Always verify with nutrition labels when
            available and consult your healthcare provider for insulin dosing.
          </Text>
        </View>
      </ScrollView>

      {/* Log button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logButton}
          onPress={handleLogMeal}
          disabled={isLogging}
        >
          {isLogging ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.logButtonText}>Log {totalCarbs}g Carbs</Text>
            </>
          )}
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
    paddingTop: 60,
    paddingHorizontal: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.base,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.base,
  },
  mainEstimate: {
    backgroundColor: Colors.primary,
    borderRadius: DesignSystem.BorderRadius.xl,
    padding: DesignSystem.Spacing.xxxl,
    alignItems: 'center',
    marginBottom: DesignSystem.Spacing.xl,
    ...DesignSystem.Shadows.card,
  },
  carbsValue: {
    fontSize: 80,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    letterSpacing: -2,
  },
  carbsUnit: {
    ...DesignSystem.Typography.h4,
    color: 'rgba(255,255,255,0.85)',
    marginTop: DesignSystem.Spacing.xs,
  },
  breakdownCard: {
    ...DesignSystem.Card.base,
    marginBottom: DesignSystem.Spacing.xl,
    padding: DesignSystem.Spacing.lg,
  },
  breakdownTitle: {
    ...DesignSystem.Typography.h4,
    marginBottom: DesignSystem.Spacing.base,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DesignSystem.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownName: {
    ...DesignSystem.Typography.body,
  },
  breakdownPortion: {
    ...DesignSystem.Typography.bodySmall,
    marginTop: 2,
  },
  breakdownCarbs: {
    ...DesignSystem.Typography.h4,
    color: Colors.primary,
  },
  adjustmentContainer: {
    ...DesignSystem.Card.base,
    marginBottom: DesignSystem.Spacing.xl,
    padding: DesignSystem.Spacing.lg,
  },
  adjustmentTitle: {
    ...DesignSystem.Typography.h4,
    marginBottom: DesignSystem.Spacing.md,
  },
  adjustmentButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignSystem.Spacing.sm,
  },
  adjustmentButton: {
    paddingHorizontal: DesignSystem.Spacing.md,
    paddingVertical: DesignSystem.Spacing.sm,
    borderRadius: DesignSystem.BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  adjustmentButtonSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
    ...DesignSystem.Shadows.subtle,
  },
  adjustmentText: {
    ...DesignSystem.Typography.label,
    color: Colors.text,
  },
  adjustmentTextSelected: {
    color: Colors.accentDark,
    fontWeight: '600',
  },
  adjustmentSubtitle: {
    ...DesignSystem.Typography.label,
    marginTop: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.sm,
    textTransform: 'uppercase',
  },
  currentAdjustmentDisplay: {
    backgroundColor: Colors.accentSubtle,
    paddingVertical: DesignSystem.Spacing.sm,
    paddingHorizontal: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.md,
    marginBottom: DesignSystem.Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  currentAdjustmentText: {
    ...DesignSystem.Typography.label,
    color: Colors.accentDark,
  },
  fineTuneButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DesignSystem.Spacing.md,
  },
  fineTuneButton: {
    paddingHorizontal: DesignSystem.Spacing.xl,
    paddingVertical: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    minWidth: 90,
    alignItems: 'center',
    ...DesignSystem.Shadows.subtle,
  },
  fineTuneText: {
    ...DesignSystem.Typography.button,
    fontSize: 18,
    color: Colors.primary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DesignSystem.Spacing.sm,
    backgroundColor: Colors.infoLight,
    padding: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.base,
    borderRadius: DesignSystem.BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  disclaimerText: {
    ...DesignSystem.Typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.xxxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...DesignSystem.Shadows.medium,
  },
  logButton: {
    ...DesignSystem.Button.accent,
    paddingVertical: DesignSystem.Spacing.lg,
    flexDirection: 'row',
    gap: DesignSystem.Spacing.sm,
  },
  logButtonText: {
    ...DesignSystem.Button.accentText,
    fontSize: 18,
  },
});
