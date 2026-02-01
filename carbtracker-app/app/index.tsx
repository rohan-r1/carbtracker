import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useRootNavigationState } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const [isChecking, setIsChecking] = useState(true);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    async function checkWelcomeStatus() {
      if (!rootNavigationState?.key) return;

      try {
        // TEMPORARY: Always show welcome screen for testing
        // TODO: Re-enable auto-skip after reviewing design
        setIsChecking(false);

        /* COMMENTED OUT FOR TESTING - UNCOMMENT LATER
        const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
        if (hasSeenWelcome === 'true') {
          // User has seen welcome before, go straight to tabs
          router.replace('/(tabs)');
        } else {
          // First time, show welcome screen
          setIsChecking(false);
        }
        */
      } catch (error) {
        console.error('Error checking welcome status:', error);
        setIsChecking(false);
      }
    }

    checkWelcomeStatus();
  }, [rootNavigationState?.key]);

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving welcome status:', error);
      router.replace('/(tabs)');
    }
  };

  // Show nothing while checking
  if (isChecking) {
    return null;
  }

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Subtle overlay for depth */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* App Icon/Logo Area - Stripe-style clean */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>CT</Text>
            <Text style={styles.logoSubtext}>g</Text>
          </View>
          <Text style={styles.appName}>CarbTracker</Text>
          <Text style={styles.tagline}>AI-powered carb estimation for better control</Text>
        </View>

        {/* Features List - Stripe-style clean cards */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="camera-outline"
            title="Snap a Photo"
            description="Point your camera at any meal"
          />
          <FeatureItem
            icon="sparkles-outline"
            title="Instant Estimate"
            description="AI analyzes and estimates carbs in seconds"
          />
          <FeatureItem
            icon="checkmark-circle-outline"
            title="Track History"
            description="Build your personal meal library"
          />
        </View>

        {/* Medical Disclaimer - Prominent and clear */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerIcon}>
            <Ionicons name="alert-circle-outline" size={24} color={Colors.warning} />
          </View>
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Important Medical Notice</Text>
            <Text style={styles.disclaimerText}>
              This app provides carbohydrate estimates for informational purposes only. It is not a
              medical device. Always consult your healthcare provider for insulin dosing decisions.
              Verify estimates when possible.
            </Text>
          </View>
        </View>

        {/* Get Started Button - Stripe-style prominent CTA */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.textOnAccent} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={24} color={Colors.accent} />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    flex: 1,
    paddingHorizontal: DesignSystem.Spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: DesignSystem.Spacing.huge,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DesignSystem.Spacing.xl,
    ...DesignSystem.Shadows.medium,
    position: 'relative',
  },
  logoText: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.textOnAccent,
    letterSpacing: -1,
  },
  logoSubtext: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.textOnAccent,
    position: 'absolute',
    right: 18,
    bottom: 22,
  },
  appName: {
    ...DesignSystem.Typography.displayMedium,
    color: Colors.textInverse,
    marginBottom: DesignSystem.Spacing.xs,
  },
  tagline: {
    ...DesignSystem.Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    paddingHorizontal: DesignSystem.Spacing.xl,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: DesignSystem.Spacing.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.base,
    gap: DesignSystem.Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: DesignSystem.BorderRadius.md,
    backgroundColor: Colors.textInverse,
    justifyContent: 'center',
    alignItems: 'center',
    ...DesignSystem.Shadows.subtle,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...DesignSystem.Typography.h4,
    color: Colors.textInverse,
    marginBottom: 2,
  },
  featureDescription: {
    ...DesignSystem.Typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: DesignSystem.BorderRadius.lg,
    padding: DesignSystem.Spacing.base,
    gap: DesignSystem.Spacing.md,
    marginBottom: DesignSystem.Spacing.xl,
    ...DesignSystem.Shadows.card,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  disclaimerIcon: {
    paddingTop: 2,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    ...DesignSystem.Typography.label,
    color: Colors.text,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  disclaimerText: {
    ...DesignSystem.Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: DesignSystem.Spacing.base,
    borderRadius: DesignSystem.BorderRadius.lg,
    gap: DesignSystem.Spacing.sm,
    ...DesignSystem.Shadows.medium,
  },
  getStartedText: {
    ...DesignSystem.Typography.button,
    color: Colors.textOnAccent,
  },
});
