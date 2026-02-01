// Stripe-inspired Design System
// Reusable styles, shadows, spacing, and typography

import { Platform } from 'react-native';
import { Colors } from './Colors';

// Typography - Stripe-style clean and readable
export const Typography = {
  // Display text (large headings)
  displayLarge: {
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 56,
    letterSpacing: -1,
    color: Colors.text,
  },
  displayMedium: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  displaySmall: {
    fontSize: 30,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: Colors.text,
  },

  // Headings
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
    color: Colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: Colors.text,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    color: Colors.text,
  },

  // Body text
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },

  // Labels and captions
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: Colors.textTertiary,
  },

  // Special
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  link: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
    color: Colors.primary,
  },
};

// Spacing - Consistent 4px grid system (Stripe uses 8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

// Border Radius - Stripe-style subtle rounded corners
export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 9999, // Fully rounded (pills)
};

// Shadows - Stripe's signature soft, elevated shadows
export const Shadows = {
  // Subtle shadow for cards
  subtle: Platform.select({
    ios: {
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),

  // Standard card shadow
  card: Platform.select({
    ios: {
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
  }),

  // Medium elevation (modals, floating buttons)
  medium: Platform.select({
    ios: {
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
  }),

  // Strong elevation (popups, dropdowns)
  strong: Platform.select({
    ios: {
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    },
    android: {
      elevation: 10,
    },
  }),

  // Intense elevation (full-screen modals)
  intense: Platform.select({
    ios: {
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
    },
  }),
};

// Card styles - Stripe's clean card design
export const Card = {
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.medium,
  },
  bordered: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interactive: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
};

// Button styles - Stripe-inspired buttons
export const Button = {
  // Primary button (forest green)
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  primaryText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },

  // Secondary button (outlined)
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  secondaryText: {
    ...Typography.button,
    color: Colors.text,
  },

  // Accent button (golden yellow)
  accent: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  accentText: {
    ...Typography.button,
    color: Colors.textOnAccent,
  },

  // Success button
  success: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  successText: {
    ...Typography.button,
    color: Colors.textInverse,
  },

  // Ghost button (text only)
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  ghostText: {
    ...Typography.button,
    color: Colors.primary,
  },

  // Large button variant
  large: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  largeText: {
    fontSize: 18,
  },

  // Small button variant
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  smallText: {
    fontSize: 14,
  },
};

// Input styles - Clean Stripe-style form inputs
export const Input = {
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: 15,
    color: Colors.text,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
};

// Badge styles
export const Badge = {
  base: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  primary: {
    backgroundColor: Colors.primarySubtle,
    color: Colors.primary,
  },
  accent: {
    backgroundColor: Colors.accentSubtle,
    color: Colors.accentDark,
  },
  success: {
    backgroundColor: Colors.successSubtle,
    color: Colors.success,
  },
  error: {
    backgroundColor: Colors.errorLight,
    color: Colors.error,
  },
  warning: {
    backgroundColor: Colors.warningLight,
    color: Colors.warning,
  },
};

// Layout helpers
export const Layout = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

export const DesignSystem = {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Card,
  Button,
  Input,
  Badge,
  Layout,
};
