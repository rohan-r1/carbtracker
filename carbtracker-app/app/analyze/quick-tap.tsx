import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';
import { QuickTapQuestion, QuickTapOption } from '@/types/api';

interface QuestionCardProps {
  question: QuickTapQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onSkip: () => void;
}

function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSkip,
}: QuestionCardProps) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question}</Text>

      {question.carb_impact && (
        <Text style={styles.impactText}>
          Could affect estimate by up to {question.carb_impact}g
        </Text>
      )}

      <View style={styles.optionsGrid}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option.label && styles.optionButtonSelected,
            ]}
            onPress={() => onSelectAnswer(option.label)}
          >
            <Text
              style={[
                styles.optionLabel,
                selectedAnswer === option.label && styles.optionLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            {option.carb_adjustment !== 0 && (
              <Text
                style={[
                  styles.optionAdjustment,
                  option.carb_adjustment > 0
                    ? styles.adjustmentPositive
                    : styles.adjustmentNegative,
                ]}
              >
                {option.carb_adjustment > 0 ? '+' : ''}
                {option.carb_adjustment}g
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Skip this question</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function QuickTapScreen() {
  const { analysisResult, quickTapAnswers, setQuickTapAnswer } =
    useAnalysisStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = analysisResult?.quick_tap_questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const getSelectedAnswer = (questionId: string) => {
    const existing = quickTapAnswers.find((a) => a.question_id === questionId);
    return existing?.answer || null;
  };

  const handleSelectAnswer = (answer: string) => {
    if (currentQuestion) {
      setQuickTapAnswer(currentQuestion.id, answer);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push('/analyze/final-estimate');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  // Handle no current question in useEffect to avoid render-time navigation
  useEffect(() => {
    // Only navigate if we have valid analysis data
    if (analysisResult && !currentQuestion && questions.length === 0) {
      router.push('/analyze/final-estimate');
    }
  }, [currentQuestion, questions.length, analysisResult]);

  if (!currentQuestion) {
    return null;
  }

  const progress = (currentQuestionIndex + 1) / questions.length;
  const selectedAnswer = getSelectedAnswer(currentQuestion.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Questions</Text>
        <Text style={styles.headerSubtitle}>
          {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Question */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          onSkip={handleSkip}
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            These questions help improve accuracy. Skip any you're unsure about.
          </Text>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAnswer && styles.continueButtonDisabled,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.continueText}>
            {currentQuestionIndex < questions.length - 1
              ? 'Next Question'
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
    backgroundColor: Colors.backgroundSecondary,
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
  scrollView: {
    flex: 1,
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
    marginBottom: DesignSystem.Spacing.sm,
  },
  impactText: {
    ...DesignSystem.Typography.bodySmall,
    marginBottom: DesignSystem.Spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignSystem.Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: DesignSystem.Spacing.base,
    paddingVertical: DesignSystem.Spacing.md,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: '45%',
    flexGrow: 1,
  },
  optionButtonSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  optionLabel: {
    ...DesignSystem.Typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: Colors.accentDark,
    fontWeight: '600',
  },
  optionAdjustment: {
    ...DesignSystem.Typography.caption,
    textAlign: 'center',
    marginTop: 4,
  },
  adjustmentPositive: {
    color: Colors.error,
  },
  adjustmentNegative: {
    color: Colors.success,
  },
  skipButton: {
    marginTop: DesignSystem.Spacing.base,
    padding: DesignSystem.Spacing.md,
    alignItems: 'center',
  },
  skipText: {
    ...DesignSystem.Typography.bodySmall,
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
    opacity: 0.7,
  },
  continueText: {
    ...DesignSystem.Button.accentText,
  },
});
