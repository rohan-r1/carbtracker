import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';

export default function SplashScreen() {
  useEffect(() => {
    async function init() {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');

        setTimeout(() => {
          if (hasSeenWelcome === 'true') {
            router.replace('/(home)' as any);
          } else {
            router.replace('/welcome');
          }
        }, 1500);
      } catch (error) {
        console.error('Error checking welcome status:', error);
        // Default to welcome screen on error
        setTimeout(() => {
          router.replace('/welcome');
        }, 1500);
      }
    }

    init();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>CT</Text>
          <Text style={styles.logoSubtext}>g</Text>
        </View>
        <Text style={styles.appName}>CarbTracker</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DesignSystem.Spacing.lg,
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
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
