# CarbTracker Design Guidelines

**Last Updated:** February 1, 2026

This document defines the visual design system for CarbTracker. **Always reference this file when making frontend UX changes.**

---

## Color Palette

### Primary Colors - Forest Green (Brand Identity)

**Use these greens for primary actions, branding, and success states:**

- **`Colors.primary`** (`#2d5016`) - Main forest green
  - ✅ Primary buttons, headers, brand elements
  - ✅ Success states, confirmation screens
  - ✅ **DEFAULT GREEN FOR HIGHLIGHTED ELEMENTS**
  - Example: Final estimate screen uses this green

- **`Colors.primaryDark`** (`#1f3810`) - Darker green
  - ✅ Hover states, pressed states
  - ✅ Text on light backgrounds when emphasis needed

- **`Colors.primaryLight`** (`#3d6b1f`) - Lighter green
  - ✅ Secondary green elements
  - ✅ Gradients with primary

- **`Colors.primarySubtle`** (`#e8f0e3`) - Very light green
  - ✅ Background tints, subtle highlights

### Accent Colors - Golden Yellow

- **`Colors.accent`** (`#d4a522`) - Main golden yellow
  - ✅ Secondary actions, highlights
  - ✅ Call-to-action buttons
  - ✅ Progress indicators

- **`Colors.accentDark`** (`#b8901c`) - Darker gold
  - ✅ Selected text on accent backgrounds

### Semantic Colors

- **`Colors.success`** (`#4ade80`) - Bright green
  - ⚠️ **DO NOT use for primary elements** (too fluorescent)
  - ✅ Success messages, positive feedback only
  - ❌ NOT for buttons or main UI elements

- **`Colors.error`** (`#DC2626`) - Red
  - ✅ Error states, destructive actions

- **`Colors.warning`** (`#F59E0B`) - Amber
  - ✅ Warnings, required fields

- **`Colors.info`** (`#3B82F6`) - Blue
  - ✅ Informational messages, tips

### Backgrounds & Surfaces

- **`Colors.background`** (`#FFFFFF`) - Pure white
  - ✅ Main screen backgrounds

- **`Colors.backgroundSecondary`** (`#FAFAFA`) - Subtle gray
  - ✅ Section backgrounds, alternating rows

- **`Colors.surface`** (`#FFFFFF`) - White
  - ✅ Cards, elevated elements

### Text Colors

- **`Colors.text`** (`#0A0A0A`) - Almost black
  - ✅ Primary text, headings

- **`Colors.textSecondary`** (`#525252`) - Medium gray
  - ✅ Secondary text, labels

- **`Colors.textTertiary`** (`#A3A3A3`) - Light gray
  - ✅ Captions, hints, disabled text

- **`Colors.textOnPrimary`** (`#FFFFFF`) - White
  - ✅ Text on forest green backgrounds

- **`Colors.textOnAccent`** (`#0A0A0A`) - Dark
  - ✅ Text on golden yellow backgrounds

### Borders

- **`Colors.border`** (`#E5E5E5`) - Standard border
- **`Colors.borderLight`** (`#F0F0F0`) - Lighter borders
- **`Colors.borderStrong`** (`#D4D4D4`) - Emphasis borders

---

## Typography

### Hierarchy

```typescript
// Large titles
DesignSystem.Typography.displayLarge  // 48px, bold
DesignSystem.Typography.displayMedium // 36px, bold
DesignSystem.Typography.displaySmall  // 30px, bold

// Headings
DesignSystem.Typography.h1  // 28px, bold
DesignSystem.Typography.h2  // 24px, semibold
DesignSystem.Typography.h3  // 20px, semibold
DesignSystem.Typography.h4  // 18px, semibold

// Body
DesignSystem.Typography.bodyLarge  // 17px
DesignSystem.Typography.body       // 15px (most common)
DesignSystem.Typography.bodySmall  // 14px

// Labels
DesignSystem.Typography.label   // 13px, medium weight
DesignSystem.Typography.caption // 12px

// Special
DesignSystem.Typography.button  // 16px, semibold
DesignSystem.Typography.link    // 15px, medium, primary color
```

### Usage Guidelines

- **Screen titles**: Use `h2` or `h3`
- **Section headers**: Use `h3` or `h4`
- **Body text**: Use `body` (15px is standard)
- **Secondary info**: Use `bodySmall` or `caption`
- **Form labels**: Use `label`

---

## Spacing System

**4px grid system** - All spacing should be multiples of 4:

```typescript
DesignSystem.Spacing.xs     // 4px
DesignSystem.Spacing.sm     // 8px
DesignSystem.Spacing.md     // 12px
DesignSystem.Spacing.base   // 16px (most common)
DesignSystem.Spacing.lg     // 20px
DesignSystem.Spacing.xl     // 24px
DesignSystem.Spacing.xxl    // 32px
DesignSystem.Spacing.xxxl   // 40px
DesignSystem.Spacing.huge   // 48px
DesignSystem.Spacing.massive // 64px
```

### Common Patterns

- **Padding inside cards**: `base` (16px)
- **Gap between elements**: `sm` (8px) or `md` (12px)
- **Section margins**: `xl` (24px) or `xxl` (32px)
- **Screen padding**: `base` (16px)

---

## Border Radius

```typescript
DesignSystem.BorderRadius.xs    // 4px
DesignSystem.BorderRadius.sm    // 6px
DesignSystem.BorderRadius.md    // 8px
DesignSystem.BorderRadius.lg    // 12px (most common for cards)
DesignSystem.BorderRadius.xl    // 16px
DesignSystem.BorderRadius.xxl   // 20px
DesignSystem.BorderRadius.round // 9999px (fully rounded pills)
```

### Usage

- **Cards**: `lg` (12px)
- **Buttons**: `md` (8px)
- **Inputs**: `md` (8px)
- **Pills/badges**: `round` (9999px)

---

## Shadows

```typescript
DesignSystem.Shadows.subtle   // Very light shadow
DesignSystem.Shadows.card     // Standard card shadow
DesignSystem.Shadows.medium   // Elevated elements
DesignSystem.Shadows.strong   // Modals, dropdowns
DesignSystem.Shadows.intense  // Full-screen modals
```

### Usage

- **Cards**: Use `card` shadow
- **Buttons**: Use `subtle` shadow
- **Modals**: Use `medium` or `strong`
- **Floating elements**: Use `medium`

---

## Common Component Patterns

### Buttons

```typescript
// Primary action (forest green)
<TouchableOpacity style={DesignSystem.Button.primary}>
  <Text style={DesignSystem.Button.primaryText}>Continue</Text>
</TouchableOpacity>

// Secondary action (golden yellow)
<TouchableOpacity style={DesignSystem.Button.accent}>
  <Text style={DesignSystem.Button.accentText}>Analyze Meal</Text>
</TouchableOpacity>

// Outlined button
<TouchableOpacity style={DesignSystem.Button.secondary}>
  <Text style={DesignSystem.Button.secondaryText}>Cancel</Text>
</TouchableOpacity>
```

### Cards

```typescript
// Standard card
<View style={DesignSystem.Card.base}>
  {/* Card content */}
</View>

// Bordered card (no shadow)
<View style={DesignSystem.Card.bordered}>
  {/* Card content */}
</View>

// Interactive card (with hover/press states)
<TouchableOpacity style={DesignSystem.Card.interactive}>
  {/* Card content */}
</TouchableOpacity>
```

### Text Inputs

```typescript
<View style={DesignSystem.Input.container}>
  <Text style={DesignSystem.Input.label}>Label</Text>
  <TextInput
    style={DesignSystem.Input.input}
    placeholderTextColor={Colors.textSecondary}
  />
</View>
```

---

## Screen Layout Patterns

### Standard Screen Structure

```typescript
<View style={styles.container}>
  {/* Header */}
  <View style={styles.header}>
    <TouchableOpacity onPress={...}>
      <Ionicons name="arrow-back" size={24} color={Colors.text} />
    </TouchableOpacity>
    <Text style={DesignSystem.Typography.h2}>Screen Title</Text>
  </View>

  {/* Content */}
  <ScrollView style={styles.scrollView}>
    {/* Content here */}
  </ScrollView>

  {/* Footer (if needed) */}
  <View style={styles.footer}>
    <TouchableOpacity style={DesignSystem.Button.accent}>
      <Text style={DesignSystem.Button.accentText}>Continue</Text>
    </TouchableOpacity>
  </View>
</View>
```

### Common Style Patterns

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    paddingTop: 60,  // Safe area + padding
    paddingHorizontal: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.md,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DesignSystem.Spacing.base,
  },
  footer: {
    padding: DesignSystem.Spacing.base,
    paddingBottom: DesignSystem.Spacing.xxxl,  // Extra for iOS home indicator
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...DesignSystem.Shadows.medium,
  },
});
```

---

## Selection & State Patterns

### Selected State (Non-Primary)

Use accent color for most selections:

```typescript
style={[
  styles.option,
  isSelected && styles.optionSelected,
]}

optionSelected: {
  borderColor: Colors.accent,
  backgroundColor: Colors.accentSubtle,
}
```

### Selected State (Primary Action)

Use forest green for primary/default selections:

```typescript
style={[
  styles.option,
  isSelected && isPrimary && styles.optionPrimarySelected,
]}

optionPrimarySelected: {
  borderColor: Colors.primary,
  backgroundColor: Colors.primary,
}

// Text on primary selected
textPrimarySelected: {
  color: Colors.textOnPrimary,  // White
}
```

### Disabled State

```typescript
disabled: {
  opacity: 0.5,
}
```

---

## Icon Usage

### Sizes

- **Small icons**: 16px or 20px
- **Standard icons**: 24px (most common)
- **Large icons**: 28px or 32px
- **Feature icons**: 48px or 64px

### Colors

- **Default**: `Colors.text`
- **Secondary**: `Colors.textSecondary`
- **On colored backgrounds**: `Colors.textOnPrimary` or `Colors.textOnAccent`
- **Interactive**: Match button/element color

---

## Common Mistakes to Avoid

### ❌ Wrong

```typescript
// Using bright green for primary UI elements
backgroundColor: Colors.success  // Too fluorescent!

// Inconsistent spacing
marginTop: 15  // Not on 4px grid

// Random colors
color: '#4ade80'  // Use color constants!

// Wrong green
backgroundColor: Colors.success  // Should be Colors.primary
```

### ✅ Correct

```typescript
// Use forest green for primary elements
backgroundColor: Colors.primary

// Use 4px grid spacing
marginTop: DesignSystem.Spacing.base  // 16px

// Use color constants
color: Colors.text

// Correct green
backgroundColor: Colors.primary  // Forest green
```

---

## Quick Reference

### Most Common Colors

- **Primary buttons/highlights**: `Colors.primary` (#2d5016 - forest green)
- **Accent buttons**: `Colors.accent` (#d4a522 - golden yellow)
- **Text**: `Colors.text` (#0A0A0A - almost black)
- **Secondary text**: `Colors.textSecondary` (#525252 - gray)
- **Borders**: `Colors.border` (#E5E5E5)
- **Success/positive feedback**: `Colors.success` (#4ade80 - bright green, use sparingly)

### Most Common Spacing

- **Screen padding**: `base` (16px)
- **Card padding**: `base` (16px)
- **Element gaps**: `sm` (8px) or `md` (12px)
- **Section margins**: `xl` (24px)

### Most Common Typography

- **Screen titles**: `h2` or `h3`
- **Body text**: `body` (15px)
- **Labels**: `label` (13px)
- **Buttons**: `button` (16px, semibold)

---

## When in Doubt

1. **Check existing screens** for similar patterns
2. **Use DesignSystem constants** instead of hardcoded values
3. **Use `Colors.primary`** (forest green) for main elements, NOT `Colors.success`
4. **Stick to 4px grid** for all spacing
5. **Use semantic color names** from Colors.ts

---

**Remember:** Consistency creates a professional, polished app. When adding new UI elements, always reference this guide and existing screens to maintain visual harmony.
