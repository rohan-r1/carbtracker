import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { DesignSystem } from '@/constants/DesignSystem';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingsItem({ icon, title, subtitle, onPress, showChevron = true }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingsIcon}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && onPress && (
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="About">
        <SettingsItem
          icon="information-circle-outline"
          title="Version"
          subtitle="1.0.0"
          showChevron={false}
        />
      </SettingsSection>

      <SettingsSection title="Legal">
        <SettingsItem
          icon="document-text-outline"
          title="Privacy Policy"
          onPress={() => Linking.openURL('https://carbtracker.app/privacy')}
        />
        <SettingsItem
          icon="shield-checkmark-outline"
          title="Terms of Service"
          onPress={() => Linking.openURL('https://carbtracker.app/terms')}
        />
      </SettingsSection>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="warning-outline" size={20} color={Colors.warning} />
        <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          CarbTracker provides carbohydrate estimates for informational purposes only.
          It is not a medical device and should not be used as a substitute for
          professional medical advice, diagnosis, or treatment.
        </Text>
        <Text style={styles.disclaimerText}>
          Always consult with your healthcare provider or diabetes care team before
          making insulin dosing decisions.
        </Text>
        <Text style={styles.disclaimerText}>
          Carbohydrate estimates may not be accurate for all foods. Use your judgment
          and verify estimates when possible.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  section: {
    marginTop: DesignSystem.Spacing.xl,
  },
  sectionTitle: {
    ...DesignSystem.Typography.label,
    textTransform: 'uppercase',
    marginLeft: DesignSystem.Spacing.base,
    marginBottom: DesignSystem.Spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignSystem.Spacing.md,
    paddingHorizontal: DesignSystem.Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: DesignSystem.BorderRadius.md,
    backgroundColor: Colors.accentSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContent: {
    flex: 1,
    marginLeft: DesignSystem.Spacing.md,
  },
  settingsTitle: {
    ...DesignSystem.Typography.body,
  },
  settingsSubtitle: {
    ...DesignSystem.Typography.bodySmall,
    marginTop: 2,
  },
  disclaimer: {
    margin: DesignSystem.Spacing.base,
    padding: DesignSystem.Spacing.lg,
    backgroundColor: Colors.warningLight,
    borderRadius: DesignSystem.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  disclaimerTitle: {
    ...DesignSystem.Typography.h4,
    marginTop: DesignSystem.Spacing.sm,
    marginBottom: DesignSystem.Spacing.sm,
  },
  disclaimerText: {
    ...DesignSystem.Typography.bodySmall,
    lineHeight: 20,
    marginBottom: DesignSystem.Spacing.sm,
  },
});
