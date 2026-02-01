import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { useAnalysisStore } from '@/store/analysisStore';

export default function LoadingScreen() {
  const { currentImageUri } = useAnalysisStore();

  return (
    <View style={styles.container}>
      {currentImageUri && (
        <Image source={{ uri: currentImageUri }} style={styles.image} />
      )}
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.title}>Analyzing your meal...</Text>
        <Text style={styles.subtitle}>
          Identifying foods and estimating carbs
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignSystem.Spacing.xxxl,
  },
  title: {
    ...DesignSystem.Typography.h2,
    color: Colors.textInverse,
    marginTop: DesignSystem.Spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    ...DesignSystem.Typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: DesignSystem.Spacing.sm,
    textAlign: 'center',
  },
});
