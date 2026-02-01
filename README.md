# CarbTracker

AI-powered carbohydrate estimation app for Type 1 diabetics. Take a photo of your meal and get instant carb estimates powered by Claude Vision API.

![Project Status](https://img.shields.io/badge/status-mvp%20development-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🎯 Overview

CarbTracker helps Type 1 diabetics quickly estimate carbohydrates from meal photos, making insulin dosing decisions faster and more accurate. Point your camera at a meal, get an AI-powered estimate in seconds, and log your meals with confidence.

**Problem**: Type 1 diabetics must estimate carbs for every meal to dose insulin correctly. Current methods are time-consuming, inaccurate, and impossible for complex restaurant meals.

**Solution**: AI-powered photo analysis that identifies foods, estimates portions, and calculates carbs in under 10 seconds.

---

## ✨ Features

### Current (MVP)
- 📸 **Smart Camera Interface** - Take photos or select from gallery
- 🤖 **AI Food Recognition** - Powered by Claude Vision API (Anthropic)
- ✅ **Food Confirmation** - Review and confirm AI-identified foods with alternatives
- 📊 **Quick-Tap Questions** - Answer quick questions about portion sizes and preparation
- 🎛️ **Manual Adjustment** - Fine-tune estimates with ±1g precision
- 📝 **Meal Descriptions** - Add optional text descriptions for better accuracy
- 📜 **Meal History** - View past meals with photos and carb counts
- 🏠 **Home Dashboard** - See recent meals at a glance

### Coming Soon
- 🔄 **Personal Meal Library** - Learn from your corrections over time
- 🍽️ **Restaurant Database** - Pre-loaded data for common restaurant meals
- 📈 **Analytics** - Track patterns in your eating habits
- 🔗 **Pump Integration** - Sync with Dexcom, Omnipod, Tandem pumps
- 📱 **Apple Health Export** - Share data with Health app
- 🌐 **Multi-language Support** - International food recognition

---

## 🏗️ Tech Stack

### Frontend (Mobile App)
- **React Native** + **Expo** - Cross-platform mobile development
- **Expo Router** - File-based navigation
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety

### Backend API
- **FastAPI** (Python) - High-performance REST API
- **SQLite** - Local development database (PostgreSQL for production)
- **Claude Vision API** (Anthropic) - AI-powered food recognition
- **Alembic** - Database migrations

### Infrastructure
- **Cloudflare R2** - Image storage (pending configuration)
- **Railway/Render** - Backend hosting (planned)
- **GitHub** - Version control

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Anthropic API key

### Mobile App Setup

```bash
# Navigate to app directory
cd carbtracker-app

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Press 'i' for iOS simulator or 'a' for Android emulator
# Or scan QR code with Expo Go app on your phone
```

### Backend Setup

```bash
# Navigate to API directory
cd carbtracker-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Configuration

**Frontend**: Edit `carbtracker-app/constants/api.ts`
- Set `USE_MOCK_API = false` to use real backend
- Update `API_BASE_URL` with your local IP for physical device testing

**Backend**: Edit `carbtracker-api/.env`
- Add your `ANTHROPIC_API_KEY`
- Configure database URL (defaults to SQLite)

---

## 📱 Usage Flow

1. **Home Screen** - Tap "Take Photo" button
2. **Camera** - Capture meal photo or select from gallery
3. **Add Description** (optional) - Describe your meal for better accuracy
4. **Analysis** - AI analyzes photo (5-10 seconds)
5. **Confirm Foods** - Review identified foods, select alternatives if needed
6. **Quick Questions** - Answer quick-tap questions about portions
7. **Final Estimate** - See total carbs with breakdown, adjust if needed
8. **Log Meal** - Save to history and return to home

---

## 📂 Project Structure

```
carbtracker/
├── carbtracker-app/          # React Native mobile app
│   ├── app/                  # Screens (Expo Router file-based)
│   │   ├── (home)/          # Home stack
│   │   ├── analyze/         # Analysis flow screens
│   │   ├── camera.tsx       # Camera interface
│   │   ├── history.tsx      # Meal history
│   │   └── settings.tsx     # App settings
│   ├── components/          # Reusable components
│   ├── constants/           # Colors, design system, API config
│   ├── services/            # API client
│   ├── store/               # Zustand state stores
│   └── types/               # TypeScript types
│
├── carbtracker-api/          # FastAPI backend
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic (Claude Vision, storage)
│   │   ├── models/          # SQLAlchemy database models
│   │   └── schemas/         # Pydantic request/response schemas
│   ├── alembic/             # Database migrations
│   └── requirements.txt     # Python dependencies
│
├── CHANGELOG.md             # Version history
├── CLAUDE.md                # Project guide and development docs
├── PROGRESS_LOG.md          # Test results and accuracy data
└── README.md                # This file
```

---

## 🧪 Testing & Accuracy

### Week 1 POC Results
- **9 comprehensive tests** completed
- **85-90% overall accuracy** (93%+ with descriptions)
- **Food identification**: 85% accuracy
- **Key finding**: One-line descriptions improve bowl/soup accuracy by 40%

### Known Limitations
- Portion size estimation challenging without reference objects
- Soups and curries with submerged ingredients harder to identify
- Restaurant meals with unknown preparation methods less accurate

See `PROGRESS_LOG.md` for detailed test results.

---

## 🗺️ Roadmap

### ✅ Phase 1: POC (Completed)
- Claude Vision API testing
- Accuracy validation
- Prompt engineering

### ✅ Phase 2: MVP App (In Progress)
- React Native mobile app
- Complete analysis flow
- Meal history and logging
- Backend integration

### 🔄 Phase 3: Polish & Beta (Current)
- Fix backend integration issues
- Improve error handling
- Add loading states
- Medical disclaimers
- Beta testing with T1D community

### 📅 Phase 4: Public Launch
- App Store submission (iOS)
- Privacy policy and terms
- Customer support system
- Analytics integration

### 🚀 Phase 5: Growth
- Android Play Store launch
- Restaurant meal database
- Pump API integrations
- Personal meal learning
- Multi-language support

---

## ⚠️ Medical Disclaimer

**CarbTracker is a nutritional estimation tool, not a medical device.**

- This app provides estimates only and should not replace medical advice
- Always consult your healthcare provider for insulin dosing decisions
- Verify estimates with nutrition labels when available
- User assumes all risk when using carb estimates for insulin dosing
- Not FDA-approved or cleared as a medical device

---

## 🤝 Contributing

This is currently a private project in active development. For questions or feedback, contact the project owner.

---

## 📄 License

Private - All Rights Reserved

---

## 👨‍💻 Team

- **Product Owner**: Rohan
- **Technical Lead**: Claude (AI Development Partner)

---

## 📊 Project Stats

- **Started**: January 21, 2026
- **Lines of Code**: ~3,200+ (TypeScript/Python)
- **Commits**: 2
- **Backend API Calls**: 9 test images analyzed
- **Average API Response Time**: 5-8 seconds

---

## 🔗 Links

- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Anthropic Claude API**: https://docs.anthropic.com
- **React Native**: https://reactnative.dev
- **Expo**: https://expo.dev

---

## 📞 Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Contact: rohan-r1

---

**Made with ❤️ for the Type 1 Diabetes community**
