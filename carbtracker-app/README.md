# CarbTracker App

React Native mobile app for AI-powered carbohydrate estimation - helping Type 1 diabetics estimate carbs from meal photos.

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

### Installation

1. Install dependencies:
```bash
cd carbtracker-app
npm install
```

2. Update API URL in `constants/api.ts`:
```typescript
// For local dev, use your computer's IP address
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP:8000'  // Replace with your local IP
  : 'https://api.carbtracker.app';
```

To find your IP:
- Windows: `ipconfig`
- macOS: `ifconfig`

3. Add app icons (required for build):
Place the following in the `assets/` folder:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

4. Start the development server:
```bash
npx expo start
```

5. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
carbtracker-app/
├── app/
│   ├── _layout.tsx         # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Tab navigator
│   │   ├── index.tsx       # Camera screen
│   │   ├── history.tsx     # Meal history
│   │   └── settings.tsx    # Settings
│   └── analyze/
│       ├── loading.tsx     # Analysis loading
│       ├── confirm-foods.tsx   # Food confirmation
│       ├── quick-tap.tsx   # Quick-tap questions
│       └── final-estimate.tsx  # Final result
├── components/             # Reusable components
├── store/
│   ├── analysisStore.ts   # Analysis state
│   └── mealsStore.ts      # Meals history
├── services/
│   └── api.ts             # API client
├── constants/
│   ├── Colors.ts          # App colors
│   └── api.ts             # API config
└── types/
    └── api.ts             # TypeScript types
```

## Features

### Camera Tab
- Full-screen camera viewfinder
- Photo capture or library selection
- Optional meal description (helps with soups, curries)

### Analysis Flow
1. **Loading** - Shows progress while AI analyzes the photo
2. **Confirm Foods** - User confirms food identification
3. **Quick-Tap Questions** - Smart questions for better accuracy
4. **Final Estimate** - Shows carb total with manual adjustment

### History Tab
- List of logged meals grouped by date
- Photo thumbnails and carb counts
- Pull-to-refresh from server

### Settings Tab
- App version info
- Privacy policy and terms
- Medical disclaimer

## Building for Production

### iOS (TestFlight)
```bash
npx eas build --platform ios --profile preview
npx eas submit --platform ios
```

### Android (APK)
```bash
npx eas build --platform android --profile preview
```

## Configuration

### EAS Build (first time)
```bash
npx eas login
npx eas build:configure
```

### Environment-specific settings
Edit `app.json` for:
- App name and slug
- Bundle identifiers
- Permission descriptions
- Plugin configurations
