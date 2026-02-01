# CarbTracker Navigation Redesign - Testing Guide

## Quick Start Testing

### First Launch Test
1. **Clear app data** (simulate fresh install)
   ```bash
   cd carbtracker-app
   npx expo start --clear
   ```
2. Scan QR code with Expo Go
3. **Expected:** Splash screen → Welcome screen
4. Tap "Get Started"
5. **Expected:** Navigate to Home screen
6. Close app and reopen
7. **Expected:** Splash screen → Home screen (skip welcome)

---

## Feature Testing Checklist

### ✅ Splash Screen
- [ ] Logo displays centered
- [ ] "CarbTracker" text visible
- [ ] Displays for ~1.5 seconds
- [ ] First launch → routes to Welcome
- [ ] Subsequent launches → routes to Home

### ✅ Welcome Screen
- [ ] Feature cards visible (3 items)
- [ ] Feature cards don't look clickable (subtle background)
- [ ] Medical disclaimer visible at bottom
- [ ] Disclaimer doesn't overlap "Track History" feature
- [ ] "Get Started" button works
- [ ] Routes to Home screen on tap

### ✅ Home Screen
**Header:**
- [ ] "CarbTracker" title on left
- [ ] Settings icon on right
- [ ] Settings icon opens Settings screen

**Take Photo Button:**
- [ ] Large gradient button visible
- [ ] Camera icon + "Take Photo" text
- [ ] Button has shadow/elevation
- [ ] Tapping opens Camera modal

**Recent Meals Section:**
- [ ] "Recent Meals" title visible
- [ ] "View All" button on right
- [ ] Shows empty state if no meals: "No meals yet. Take your first photo!"

**With Meals:**
- [ ] Shows up to 4 most recent meals
- [ ] Each meal shows thumbnail (or placeholder)
- [ ] Each meal shows truncated description (5 words max)
- [ ] Each meal shows time ago (e.g., "2h ago")
- [ ] Each meal shows carbs badge (e.g., "45g")
- [ ] "View All" routes to History screen

**Pull to Refresh:**
- [ ] Pull down gesture works
- [ ] Loading spinner appears
- [ ] Meals refresh from API

### ✅ Camera Modal
**Open/Close:**
- [ ] Opens as full-screen modal
- [ ] Close button (X) visible in top-right
- [ ] Close button returns to Home

**Camera View:**
- [ ] Live camera preview works
- [ ] "Position your meal in the frame" text visible
- [ ] Gallery button (bottom-left) works
- [ ] Capture button (bottom-center) works
- [ ] Flip camera button (bottom-right) works

**Photo Preview:**
- [ ] Captured photo displays
- [ ] "Add description (optional)" button visible
- [ ] Tapping shows text input
- [ ] Description input accepts text
- [ ] "Retake" button works (returns to camera)
- [ ] "Analyze Meal" button works (starts analysis)

### ✅ Analysis Flow
**Loading Screen:**
- [ ] Animated icon displays
- [ ] "Analyzing your meal..." text visible
- [ ] Transitions to Confirm Foods automatically

**Confirm Foods:**
- [ ] Detected foods listed
- [ ] Uncertain items show alternatives
- [ ] Can select between alternatives
- [ ] "Continue" button works

**Quick Tap Questions:**
- [ ] Questions displayed clearly
- [ ] Options tappable
- [ ] Selected state visible
- [ ] "Continue" button works

**Final Estimate:**
- [ ] Total carbs displayed prominently
- [ ] Breakdown shows all foods
- [ ] Adjustment buttons work (+1g, +5g, -1g, -5g)
- [ ] "Log Meal" button works
- [ ] Alert shows "Meal Logged!"
- [ ] "Back to Home" button returns to Home

**Error Handling:**
- [ ] No food detected → Alert with "Retake Photo" / "Cancel"
- [ ] Analysis failed → Alert with "Try again" / "Cancel"
- [ ] Both return to appropriate screen

### ✅ History Screen
**Navigation:**
- [ ] Opens from "View All" on Home
- [ ] Header shows "Meal History"
- [ ] Back button returns to Home

**Content:**
- [ ] Meals grouped by date
- [ ] Date headers visible (e.g., "Friday, Jan 31")
- [ ] Each meal shows full photo (not thumbnail)
- [ ] Each meal shows full description
- [ ] Each meal shows time (e.g., "6:30 PM")
- [ ] Each meal shows carbs badge

**Empty State:**
- [ ] If no meals: "No Meals Yet" message
- [ ] Icon visible
- [ ] Helpful text displayed

**Pull to Refresh:**
- [ ] Pull down gesture works
- [ ] Reloads meals from API

### ✅ Settings Screen
**Navigation:**
- [ ] Opens from Settings icon on Home
- [ ] Header shows "Settings"
- [ ] Back button returns to Home

**Sections:**
- [ ] "ABOUT" section visible
- [ ] Version number displayed
- [ ] "LEGAL" section visible
- [ ] Privacy Policy link works (opens external URL)
- [ ] Terms of Service link works (opens external URL)
- [ ] Medical Disclaimer visible at bottom
- [ ] Full disclaimer text readable

---

## Device-Specific Tests

### iOS
- [ ] SafeAreaView works correctly (notch/Dynamic Island)
- [ ] Status bar visible and styled correctly
- [ ] Back swipe gesture works on History/Settings
- [ ] Modal dismiss gesture works on Camera
- [ ] Keyboard doesn't cover input fields
- [ ] Camera permissions prompt appears
- [ ] Gallery permissions prompt appears

### Android
- [ ] SafeAreaView works correctly (system bars)
- [ ] Back button works on all screens
- [ ] Camera permissions prompt appears
- [ ] Gallery permissions prompt appears
- [ ] Ripple effects visible on buttons
- [ ] Splash screen doesn't flash

---

## Edge Case Tests

### Data States
- [ ] **0 meals:** Empty state on Home and History
- [ ] **1 meal:** Recent meals shows 1 card
- [ ] **3 meals:** Recent meals shows 3 cards
- [ ] **10+ meals:** Recent meals shows only 4 most recent
- [ ] **100+ meals:** History scrolls smoothly

### Photos
- [ ] **No photo_url:** Placeholder icon displays
- [ ] **Large photo:** Loads and displays correctly
- [ ] **Corrupted URL:** Fallback to placeholder
- [ ] **Network error:** Handles gracefully

### Descriptions
- [ ] **Short description (2 words):** Displays fully
- [ ] **Long description (20 words):** Truncates to 5 words + "..."
- [ ] **No description:** Shows "Meal" as fallback
- [ ] **Special characters:** Displays correctly

### Network
- [ ] **Offline on launch:** Shows cached meals
- [ ] **Offline during analysis:** Error alert
- [ ] **Slow network:** Loading indicators work
- [ ] **API timeout:** Error handling works

### Navigation
- [ ] **Deep link to home:** Works correctly
- [ ] **App backgrounded during analysis:** Resumes correctly
- [ ] **App killed during analysis:** Graceful recovery
- [ ] **Multiple rapid taps on buttons:** No crashes

---

## Performance Tests

### Speed
- [ ] Splash → Home transition < 2 seconds
- [ ] Camera opens instantly (<500ms)
- [ ] Photo capture is immediate
- [ ] Recent meals load instantly (from cache)
- [ ] History scrolling is smooth (60fps)

### Memory
- [ ] No memory leaks when navigating
- [ ] Photos release memory after use
- [ ] App doesn't crash with 100+ meals
- [ ] Camera preview doesn't leak

### Battery
- [ ] Camera doesn't drain excessively
- [ ] App suspends camera when backgrounded
- [ ] No background processes running

---

## Regression Tests

### Existing Features (Should Still Work)
- [ ] Camera capture quality (0.8)
- [ ] Gallery picker works
- [ ] Analysis accuracy unchanged
- [ ] Meal logging to API works
- [ ] Meal retrieval from API works
- [ ] Carbs adjustment in Final Estimate
- [ ] Quick Tap questions logic
- [ ] Food confirmation logic
- [ ] AsyncStorage persistence

---

## Accessibility Tests

### Screen Reader (VoiceOver/TalkBack)
- [ ] All buttons have labels
- [ ] Images have alt text
- [ ] Navigation is logical
- [ ] Headings are proper hierarchy

### Visual
- [ ] Text is readable at default size
- [ ] Text scales with system font size
- [ ] Sufficient color contrast
- [ ] No information conveyed by color alone

### Touch Targets
- [ ] All buttons are at least 44×44 points
- [ ] Buttons have adequate spacing
- [ ] Swipe gestures work smoothly

---

## User Flow Tests

### Complete Happy Path
1. Launch app (first time)
2. See splash → welcome
3. Tap "Get Started"
4. See home screen
5. Tap "Take Photo"
6. See camera
7. Capture meal photo
8. (Optional) Add description
9. Tap "Analyze Meal"
10. See loading
11. Confirm foods
12. Answer quick tap questions
13. Review final estimate
14. Adjust carbs if needed
15. Tap "Log Meal"
16. See success alert
17. Tap "Back to Home"
18. See new meal in Recent Meals
19. Pull to refresh (verify meal is there)
20. Tap "View All"
21. See meal in History
22. Tap back to Home
23. Tap Settings icon
24. Review settings
25. Tap back to Home

**Expected:** No errors, smooth flow, all data persists

### Camera Cancel Flow
1. From Home, tap "Take Photo"
2. See camera modal
3. Tap "X" to close
4. **Expected:** Return to Home, no analysis started

### Retake Photo Flow
1. From Home, tap "Take Photo"
2. Capture photo
3. Tap "Retake"
4. **Expected:** Return to camera view
5. Capture new photo
6. Continue to analysis

### No Food Detected Flow
1. Capture photo of empty plate or non-food item
2. Tap "Analyze Meal"
3. **Expected:** Alert "No Food Detected"
4. Tap "Retake Photo"
5. **Expected:** Return to camera (not preview)
6. Or tap "Cancel"
7. **Expected:** Return to Home

---

## Known Issues to Watch For

### Potential Problems
- [ ] Camera permissions denied on first launch
- [ ] AsyncStorage race condition on fast app switching
- [ ] Image URLs with special characters
- [ ] Timezone issues in meal timestamps
- [ ] Large images causing memory warnings
- [ ] Rapid navigation causing state inconsistencies

### If You See These, Report:
- Console errors or warnings
- Navigation delays > 500ms
- Memory warnings in Expo Dev Tools
- Crashed or frozen screens
- Data not persisting between launches
- Images not loading
- API errors not handled gracefully

---

## Test Data Setup

### Create Test Meals
Use these commands to add test data:

```bash
# In the app, manually log meals by:
1. Taking photos of real meals
2. Completing analysis flow
3. Repeat 5-10 times for realistic data

# Or use API directly (if available):
curl -X POST http://your-api/meals \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test meal",
    "carbs_logged": 45,
    "photo_url": "https://example.com/meal.jpg"
  }'
```

### Test Scenarios
1. **New User:** Clear AsyncStorage, clear app data
2. **Returning User:** Normal launch with existing data
3. **Power User:** 50+ meals logged
4. **Empty State:** No meals logged
5. **Offline:** Airplane mode enabled

---

## Testing Priority

### Critical (Must Pass Before Beta)
1. ✅ Splash → Home/Welcome routing
2. ✅ Camera modal opens/closes
3. ✅ Analysis flow completes
4. ✅ Meal logs successfully
5. ✅ Recent meals display correctly
6. ✅ History screen works
7. ✅ Settings screen works
8. ✅ No crashes or errors

### High (Should Pass Before Beta)
1. Pull to refresh works
2. Empty states display
3. Error handling works
4. Back buttons work
5. Thumbnails load
6. Time formatting correct

### Medium (Nice to Have)
1. Smooth animations
2. Fast performance
3. Proper accessibility
4. Edge case handling

---

## Bug Report Template

If you find issues, report using this format:

```markdown
**Issue:** [Brief description]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Device:**
- Model: [iPhone 14 Pro / Pixel 7 / etc.]
- OS: [iOS 17.2 / Android 14 / etc.]
- App Version: 1.0.0

**Screenshots/Logs:**
[Attach if available]

**Severity:**
[ ] Critical - App crashes/data loss
[ ] High - Feature doesn't work
[ ] Medium - UI issue
[ ] Low - Minor polish
```

---

## Test Sign-Off

### Tester: _______________
### Date: _______________

- [ ] All Critical tests passed
- [ ] All High priority tests passed
- [ ] No crashes encountered
- [ ] Performance is acceptable
- [ ] Ready for beta testing

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Last Updated:** January 31, 2026
**Version:** 1.0.0
