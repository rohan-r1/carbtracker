import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';
import { RecentMeals } from '@/components/RecentMeals';
import { useMealsStore } from '@/store/mealsStore';

export default function HomeScreen() {
  const { loadFromStorage } = useMealsStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadFromStorage();
    setRefreshing(false);
  }, [loadFromStorage]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CarbTracker</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Take Photo Button */}
          <TouchableOpacity
            style={styles.takePhotoButtonContainer}
            onPress={() => router.push('/camera')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.takePhotoButton}
            >
              <Ionicons name="camera" size={32} color={Colors.textInverse} />
              <Text style={styles.takePhotoText}>Take Photo</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Recent Meals */}
          <RecentMeals />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.Spacing.lg,
    paddingVertical: DesignSystem.Spacing.md,
    height: 60,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  settingsButton: {
    padding: DesignSystem.Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.lg,
  },
  takePhotoButtonContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  takePhotoButton: {
    height: 120,
    borderRadius: DesignSystem.BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: DesignSystem.Spacing.md,
  },
  takePhotoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
