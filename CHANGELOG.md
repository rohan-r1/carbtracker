# CarbTracker - Changelog

All notable changes and milestones for the CarbTracker project.

---

## [Unreleased] - In Development

### Analysis Flow Issues
- Identified issues with backend integration responses and flow
- Pending fixes for next session

---

## [2026-02-01] - Backend Integration

### Added
- Switched from mock API to real Claude Vision API backend
- FastAPI backend running at localhost:8000
- Real AI-powered food recognition using Claude Vision

### Changed
- Meal history now uses local AsyncStorage (backend meal sync pending)
- Photos stored locally until R2 storage is configured

### Fixed
- History screen no longer fetches from backend (preserves local meals)
- Removed all debug console.log statements from analysis flow
- Fixed React import errors in quick-tap screen
- Fixed SafeAreaView deprecation warning
- Fixed ImagePicker deprecation warning

---

## [2026-01-31] - Navigation Redesign Complete

### Added
- Splash screen with 1.5s logo display
- Home-centered navigation replacing tab-based design
- Prominent "Take Photo" button on home screen
- Recent meals display with thumbnails and descriptions (3-4 most recent)
- Pull-to-refresh on home screen

### Changed
- **Major Navigation Overhaul**: Splash → Home → Camera → Analysis → Home
- Welcome screen now only shown on first launch
- Camera changed from fullScreenModal to card presentation (fixed navigation blocking)
- Description input always visible on photo preview
- Settings and History moved to separate screens (no longer tabs)

### Fixed
- Feature cards on welcome screen no longer look like buttons
- Medical disclaimer no longer overlaps with Track History
- Analysis flow now returns to home after logging meal
- Thumbnails and descriptions display correctly in meal history
- Keyboard no longer blocks action buttons after photo capture
- React "Cannot update component while rendering" error in QuickTap

### Removed
- Tab-based navigation (entire `(tabs)` folder deleted)

---

## [2026-01-30] - UI Polish & Quick-Tap Enhancement

### Added
- Quick-tap questions for portion sizes and preparation methods
- Carb adjustment granularity (±1g fine-tune buttons)
- Beverage-specific quick-tap questions
- "No food detected" error handling with user-friendly messages

### Changed
- Color scheme from green to white background for cleaner look
- "View All" button styling improved (bold green text)
- Manual adjustment UI with quick buttons and fine-tune controls

---

## [2026-01-29] - MVP Mobile App Foundation

### Added
- React Native app with Expo
- Complete analysis flow: Camera → Loading → Confirm Foods → Quick Tap → Final Estimate
- Food confirmation step (select from AI-suggested alternatives)
- Manual carb adjustment slider
- Meal logging and history
- Mock API mode for frontend-only testing
- Local photo storage with AsyncStorage
- Pull-to-refresh on history screen

### Technical Stack
- Frontend: React Native + Expo Router
- Backend: FastAPI + SQLite (local dev)
- State: Zustand stores (analysis + meals)
- AI: Claude Vision API (Anthropic)

---

## [2026-01-21 to 2026-01-26] - POC & Testing Phase

### Completed
- Week 1 testing with Claude Vision API
- 9 comprehensive tests of food recognition accuracy
- Overall accuracy: 85-90% (93%+ with user descriptions)
- Validated that AI can estimate carbs accurately enough for MVP
- Identified key improvements: food confirmation step, quick-tap questions, description field

### Key Learnings
- One-line descriptions dramatically improve accuracy for complex meals
- Portion size estimation is the biggest challenge
- Showing multiple food options (most likely + alternatives) improves trust
- Quick-tap questions address AI uncertainties effectively

---

## [2026-01-21] - Project Inception

### Initial Setup
- Created project structure
- Defined product vision and roadmap
- Set up Anthropic API integration
- Created CLAUDE.md project guide
- Established technical strategy: Claude Vision POC → MVP → Beta → Launch

### Core Vision
AI-powered carb estimation app for Type 1 diabetics
- Point camera at meal → Get instant carb estimate → Dose insulin with confidence
- iOS-first (React Native for cross-platform capability)
- Safety-first approach with disclaimers and manual override

---

## Architecture Decisions

### Frontend
- **React Native + Expo**: Cross-platform, fast development, built-in camera
- **Expo Router**: File-based navigation, type-safe routing
- **Zustand**: Lightweight state management
- **AsyncStorage**: Local data persistence

### Backend
- **FastAPI**: Fast development, clean API design, async support
- **SQLite**: Simple local dev, easy to switch to PostgreSQL later
- **Claude Vision API**: Best-in-class food recognition without custom ML
- **Cloudflare R2**: (Pending) Low-cost image storage

### Design Principles
1. Safety first: Always show confidence, allow manual override
2. Speed matters: Users need estimates in seconds, not minutes
3. Trust through transparency: Show AI reasoning, offer alternatives
4. Mobile-first: iOS launch, Android ready when needed

---

## Known Issues & Tech Debt

### Current
- Backend integration: Response format issues in analysis flow (pending fix)
- Photo storage: Using local URIs, need R2 integration
- Meal sync: Local-only storage, backend sync not implemented

### Future Enhancements
- Personal meal library (learn from corrections)
- Restaurant meal database
- Fiber/net carbs calculation
- Pump integration (Dexcom, Omnipod, etc.)
- Export to Apple Health
- Android Play Store release

---

## Team
- **Product Owner**: Rohan
- **Technical Lead**: Claude (AI CTO)

---

*For detailed project overview and development guidelines, see CLAUDE.md*
