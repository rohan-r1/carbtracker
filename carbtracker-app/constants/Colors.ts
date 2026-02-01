// Stripe-inspired design system with CarbTracker branding
// Forest green & golden yellow color palette

export const Colors = {
  // Primary Brand Colors - Forest Green (from logo)
  primary: '#2d5016',           // Main forest green
  primaryDark: '#1f3810',        // Darker green for depth
  primaryLight: '#3d6b1f',       // Lighter green for hover states
  primarySubtle: '#e8f0e3',      // Very light green for backgrounds
  primaryGradientStart: '#2d5016',
  primaryGradientEnd: '#3d6b1f',

  // Accent Colors - Golden Yellow (from logo)
  accent: '#d4a522',             // Main golden yellow
  accentDark: '#b8901c',         // Darker gold
  accentLight: '#e6c04d',        // Lighter gold for highlights
  accentSubtle: '#fdf7e8',       // Very light yellow for backgrounds

  // Secondary/Success Colors
  secondary: '#3d6b1f',          // Medium green
  success: '#4ade80',            // Bright green for success states
  successSubtle: '#dcfce7',      // Light green background

  // Backgrounds - Stripe-style clean whites and subtle grays
  background: '#FFFFFF',         // Pure white main background
  backgroundSecondary: '#FAFAFA', // Subtle gray background
  backgroundTertiary: '#F5F5F5', // Slightly darker gray
  surface: '#FFFFFF',            // Card surfaces
  surfaceElevated: '#FAFAFA',    // Elevated cards/modals
  surfaceHover: '#F9FAFB',       // Hover state for surfaces

  // Text Colors - Stripe-style hierarchy with excellent contrast
  text: '#0A0A0A',               // Almost black for primary text
  textSecondary: '#525252',      // Medium gray for secondary text
  textTertiary: '#A3A3A3',       // Light gray for tertiary text
  textPlaceholder: '#D4D4D4',    // Placeholder text
  textInverse: '#FFFFFF',        // White text on dark backgrounds
  textOnPrimary: '#FFFFFF',      // White text on forest green
  textOnAccent: '#0A0A0A',       // Dark text on golden yellow

  // Borders & Dividers - Subtle Stripe-style
  border: '#E5E5E5',             // Standard border
  borderLight: '#F0F0F0',        // Lighter borders
  borderStrong: '#D4D4D4',       // Stronger borders for emphasis
  divider: '#E5E5E5',            // Divider lines

  // Semantic Colors - Clear and accessible
  error: '#DC2626',              // Red for errors
  errorLight: '#FEE2E2',         // Light red background
  warning: '#F59E0B',            // Amber for warnings
  warningLight: '#FEF3C7',       // Light amber background
  info: '#3B82F6',               // Blue for info
  infoLight: '#DBEAFE',          // Light blue background

  // Confidence levels (for carb estimates)
  confidenceHigh: '#4ade80',     // Bright green
  confidenceMedium: '#FBBF24',   // Yellow-amber
  confidenceLow: '#F87171',      // Coral red

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',
  overlayWhite: 'rgba(255, 255, 255, 0.9)',

  // Shadows - Stripe-style soft and subtle
  shadowColor: '#0A0A0A',
  shadowSubtle: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowStrong: 'rgba(0, 0, 0, 0.12)',

  // Interactive states
  hoverOverlay: 'rgba(0, 0, 0, 0.04)',
  pressedOverlay: 'rgba(0, 0, 0, 0.08)',
  focusRing: '#d4a522',          // Golden yellow focus ring
};
