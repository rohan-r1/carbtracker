# CarbTracker - Project Overview

**Product Owner:** Rohan
**Technical Lead:** Claude (AI CTO Co-founder)
**Project Status:** Planning & Initial Development
**Last Updated:** January 21, 2026

---

## Vision

A full-fledged AI-powered mobile application (iOS primary, Android secondary) that helps Type 1 diabetics estimate carbohydrate content from meal photos, making insulin dosing decisions faster and more accurate.

**Target Platforms:**
- **iOS** - Primary platform (launching first)
- **Android** - Secondary platform (planned for post-launch)

**End Goal:** Production-ready app in App Store that users can download and use daily for carb tracking and insulin dosing support.

---

## Product Owner's Role (Rohan)

You own:
- Product vision and roadmap
- User experience design and customer journeys
- Feature prioritization
- User testing and feedback collection
- Go-to-market strategy
- Regulatory compliance decisions
- Partnerships (pumps, endocrinologists, etc.)

---

## Technical Lead's Role (Claude)

I will handle:
- Technical architecture and infrastructure decisions
- Code implementation and debugging
- API integrations (Anthropic, cloud services, etc.)
- Performance optimization
- Security and data privacy
- Cost management and scaling strategy
- Technical risk assessment
- Explaining technical tradeoffs in plain language for your decision-making

---

## Core Problem We're Solving

**User Pain Point:** Type 1 diabetics must estimate carbs for every meal to dose insulin correctly. Current methods:
- Time-consuming (looking up nutrition info)
- Inaccurate (eyeballing portions)
- Impossible for complex/restaurant meals
- Leads to blood sugar management issues

**Our Solution:** Point camera → Get instant carb estimate → Dose with confidence

---

## Technical Strategy

### Phase 1: Proof of Concept (Current - Weeks 1-4)
**Goal:** Validate that AI vision can estimate carbs accurately enough to be useful

**Approach:**
- Use Claude's Vision API (Anthropic) - no custom AI training needed yet
- Build simple test scripts to analyze meal photos
- Test accuracy with 20-30 of your real meals
- Target: ±15g accuracy on simple meals, ±25g on complex dishes

**Why this approach:**
- Fastest way to validate the concept
- Low cost ($0.01-0.05 per image)
- No ML expertise required
- Can pivot quickly if accuracy isn't good enough

**Technical Decisions Made:**
- ✅ Claude Vision API over OpenAI GPT-4 Vision (better food analysis in my testing)
- ✅ Python for testing scripts (easier for data analysis)
- ✅ **Enhanced prompt to show multiple food possibilities** (addresses misidentification issue)
- ✅ **MVP will include confirmation step** - AI shows top options, user selects correct one
- ✅ **Optional text description for bowl/soup meals** (addresses submerged ingredient blind spot)
- ⏳ Will reassess if we need custom ML models after accuracy testing

**Test Results Summary (9 tests completed):**
- Overall accuracy: 85-90% (93%+ when uncertainties addressed)
- Food ID accuracy: 85% (misses on submerged/ambiguous items)
- Key weak spots: portion size estimation, soups/curries with hidden ingredients
- Key finding: One-line description turns 33% accuracy → 75-83% for bowl meals
- See PROGRESS_LOG.md for full test-by-test breakdown

### Phase 2: MVP Mobile App (Weeks 5-12)
**Goal:** Production-ready mobile app for iOS (with Android capability built-in)

**Launch Strategy:** iOS-first approach
- Build with React Native = works on both platforms
- Focus testing and polish on iOS initially
- Android version available with minimal additional work when ready

**Tech Stack Recommendation:**
- **Frontend:** React Native with Expo
  - Why: Build once, runs natively on both iOS and Android
  - Why: Expo handles App Store/Play Store builds and deployment
  - Why: Large developer community = easier to hire help later
  - Why: You can test on your own iPhone immediately via Expo Go app
  - Why: Camera integration built-in (critical for this app)
  - Why: Can "eject" to native code later if needed for advanced features

- **Backend:** Python FastAPI + PostgreSQL
  - Why: Clean API design, fast development
  - Why: Postgres handles structured data well (meal history, user accounts)

- **Hosting:** Railway or Render
  - Why: Simple deployment, reasonable costs
  - Why: Auto-scales as users grow
  - Expected cost: $20-50/month for MVP

- **Image Storage:** Cloudflare R2
  - Why: Cheaper than AWS S3
  - Why: Fast global delivery

**Features:**
1. Camera interface
2. AI analysis with **food confirmation step**
   - Shows most likely foods + similar alternatives
   - User taps to confirm correct identification
   - Then displays carb estimate
3. Carb estimate with confidence level
4. Manual override/correction
5. Meal history log
6. Basic user authentication

**Key UX Flow (based on Tests #1-9 learnings):**
1. User takes photo
2. Optional: User adds one-line description (especially for soups, curries, bowls)
3. AI shows: "I see: Banana (95% confident) + [Twinkie OR Madeleine - tap one]"
4. AI asks quick-tap questions if uncertain (size, preparation, hidden ingredients)
5. App shows: "Total: 43g carbs (Banana 28g + Madeleine 15g)"
6. User can adjust or confirm

### Phase 3A: First Polish Round (Current - Weeks 5-6)
**Goal:** Fix critical issues and polish UX before beta launch

**Critical (Must Have):**
- [✅] No food detection error handling - COMPLETE
- [✅] Carb adjustment granularity (+/- 1g) - COMPLETE
- [✅] Beverage quick-tap questions - COMPLETE
- [ ] Basic app icon (placeholder OK)
- [ ] Prominent medical disclaimers

**Important (Should Have):**
- [ ] Loading state improvements
- [ ] Better error messages
- [ ] Welcome screen polish
- [ ] History sorting/filtering basics

**Nice to Have (Can Defer to Beta Feedback):**
- Professional app icon design
- Splash screen animations
- Advanced analytics
- Additional quick-tap categories

### Phase 3B: Closed Beta Launch (Weeks 7-10)
**Goal:** Real-world testing with T1D community before public launch

**Why Beta-First:**
- Safety: Real T1D users validate accuracy before public release
- Feedback: Learn what features matter most to actual users
- Trust: Build credibility within T1D community
- Iteration: Fix issues before reputation risk

**Technical Setup:**
- [ ] Apple Developer Account ($99/year)
- [ ] EAS Build configuration for TestFlight
- [ ] Build iOS app bundle
- [ ] Upload to TestFlight
- [ ] Create beta tester group

**Community Outreach:**
- [ ] Identify 10-20 T1D beta testers
- [ ] Create feedback collection form
- [ ] Set up communication channel (email/Discord/Slack)
- [ ] Draft beta tester invitation message
- [ ] Create beta testing guidelines

**Success Metrics:**
- 80%+ beta testers actively use app for 2+ weeks
- 85%+ accuracy on carb estimates (based on user corrections)
- <10% critical bugs/crashes
- 70%+ user satisfaction rating
- Identify top 5 feature requests

### Phase 3C: Beta Refinement (Weeks 11-13)
**Goal:** Address feedback and polish for App Store submission

**Based on Beta Feedback:**
- Fix bugs discovered in field
- Improve accuracy based on real usage patterns
- Add most-requested features
- Refine UX pain points
- Polish app icon and branding

### Phase 4: Public App Store Launch (Month 4-6)
**Goal:** Public release on iOS App Store

**Launch Checklist:**
- [ ] App Store listing (name, description, screenshots)
- [ ] Privacy Policy and Terms of Service
- [ ] App Review compliance (especially medical disclaimers)
- [ ] Analytics integration (usage tracking, crash reporting)
- [ ] Customer support plan (feedback, bug reports)

**Distribution Strategy:**
- **Launch:** Free app to build user base and trust
- **Monetization:** Add optional paid features in Phase 5 based on user feedback

### Phase 5: Enhanced Product & Android Launch (Month 6+)
**Pending POC results and user feedback**

Potential features:
- Personal meal library (learns from your corrections)
- Restaurant meal database
- Fiber/net carbs calculation
- Fat and protein estimates (for extended bolus decisions)
- Integration with Dexcom/pump APIs
- Export to Apple Health / Google Fit
- Android version on Google Play Store
- Multi-user beta testing community

---

## Critical Medical/Legal Considerations

### Safety First
- **Always show confidence levels** - user must know when AI is uncertain
- **Prominent manual override** - never lock users into AI estimate
- **Consider showing ranges** (e.g., "40-50g") rather than exact numbers
- **Clear disclaimers** - "estimation tool, not a medical device"

### Regulatory Path for App Store Launch
**Current Position:** Personal tool / wellness app (not FDA regulated)

**For App Store submission:**
- **Category:** Health & Fitness or Medical (with appropriate disclaimers)
- **Positioning:** "Nutritional tracking and logging tool" NOT "medical diagnosis device"
- **Required Disclaimers:**
  - "Not intended to replace medical advice"
  - "Consult healthcare provider for insulin dosing"
  - "Estimates are not guaranteed accurate"
  - "User assumes all risk"

**Apple App Review Considerations:**
- Medical apps face extra scrutiny
- Must be clear about limitations
- Cannot make medical claims without FDA clearance
- Must have privacy policy (especially for health data)
- Should mention "for informational purposes only"

**FDA Classification:**
- Positioning as "food logging tool" avoids FDA medical device classification
- Cannot claim to "diagnose" or "treat" diabetes
- Cannot position as replacement for medical advice
- If we add pump integration or dosing recommendations → need FDA review

**My Recommendation:**
- Launch as "decision support tool" that helps with carb tracking
- User makes all final decisions about insulin
- Clear disclaimers throughout the app
- Monitor user feedback and adjust positioning as needed

---

## Current Week 1 Priorities

From your previous conversation, the Week 1 checklist focuses on:

### Days 1-2: API Setup & Testing
- Set up Anthropic API account
- Write test script
- Analyze 5 known meals

### Days 3-4: Prompt Engineering
- Refine the AI prompt for better accuracy
- Test with reference objects (plates, forks for scale)
- Track accuracy metrics

### Days 5-7: Validation & Planning
- Test edge cases (mixed dishes, restaurant meals, liquids)
- Calculate average accuracy
- Decide if we proceed to mobile app development

**Success Criteria:** ±15g accuracy on simple meals before moving forward

---

## My Technical Advice to You

### Things You Should Care About (Product Decisions):
1. **Accuracy threshold** - What accuracy level makes this useful for you?
2. **Speed** - How fast does the estimate need to be? (2 seconds? 10 seconds?)
3. **Meal types** - Which meal categories matter most? (home cooked? restaurants? packaged foods?)
4. **Corrections** - How should users correct wrong estimates? What UI makes sense?
5. **History** - What meal data is valuable to see later?

### Things I'll Handle (Technical Implementation):
1. API performance optimization
2. Image compression and upload
3. Database schema design
4. Error handling and retry logic
5. Caching strategies
6. Security (encryption, auth tokens, etc.)

### When I'll Ask for Your Input:
- Tradeoffs that affect user experience (e.g., "faster but less accurate" vs "slower but more precise")
- Feature prioritization when resources are limited
- Cost vs. benefit decisions (e.g., "spend $200/month for 20% better accuracy?")
- Anything touching user data privacy

---

## Cost Projections

### Phase 1 (Testing): ~$10-20 total
- API calls for 30-50 test images
- Free development tools

### Phase 2 (MVP Development): ~$100-150/month
- Hosting: $30-50
- Database: $20
- Image storage: $10
- API calls (assuming 10 meals/day for testing): $30-50

### Phase 3 (App Store Launch): ~$300-500/month + one-time costs
**One-time:**
- Apple Developer Account: $99/year
- Privacy policy legal review: $200-500 (optional but recommended)

**Monthly:**
- Hosting: $50-100 (higher tier for production)
- Database: $25-50
- Image storage: $20-30
- API calls (100 active users, 3 meals/day avg): $150-300
- Analytics/monitoring: $0-50

### Phase 4 (Growth - 500 users): ~$1,000-1,500/month
- Scales linearly with usage
- Main cost: API calls per image (~$0.01-0.02 each)
- 500 users × 3 meals/day × 30 days = 45,000 API calls/month = ~$450-900
- Plus infrastructure: ~$200-400/month

### Phase 4+ (1,000+ users): Consider optimization
- Fine-tuned custom model (cheaper per call, upfront cost)
- Or negotiate enterprise pricing with Anthropic
- Or implement tiered pricing for users

---

## Next Steps

### Immediate (This Session):
1. ✅ Create this claude.md file
2. Set up project structure for Week 1 testing
3. Get Anthropic API configured
4. Write first test script

### Your Action Items:
1. Create Anthropic account and get API key
2. Provide API key to me for configuration
3. Start taking photos of meals with known carb counts
4. Think about: What accuracy level would make you actually use this daily?

### My Action Items:
1. Set up project folder structure
2. Write API test script
3. Create prompt template for carb estimation
4. Build tracking spreadsheet for accuracy metrics

---

## Questions for You to Consider

1. **User research:** Besides yourself, who else would test this early? (Other T1D friends? Online community?)
2. **Meal types:** What 20 meals do you eat most often? (These should be our test set)
3. **Deal-breakers:** What would make this NOT useful? (Too slow? Not accurate enough? Too expensive per estimate?)
4. **Success metric:** What would make you say "This is ready for other people to try"?

---

## Communication Guidelines

When I explain technical things:
- I'll use analogies and plain language first
- I'll explain WHY before diving into HOW
- I'll present options with pros/cons for your decision
- I'll flag when something is my technical opinion vs. when you need to decide
- I'll tell you when you're about to do something risky or expensive

When you make product decisions:
- Tell me the user outcome you want
- I'll figure out how to build it
- If there are technical constraints, I'll explain them clearly
- If your idea conflicts with best practices, I'll offer alternatives with reasons

---

## Bug Fixing Workflow

**When you report a bug, I will follow this process:**

1. **Write a test first** - Before attempting any fix, I'll write a test that reproduces the bug
2. **Delegate to subagents** - Use specialized subagents to fix the bug while I oversee
3. **Prove the fix** - Verify the bug is fixed by running the test and confirming it passes

**Why this approach:**
- Tests document the bug clearly
- Prevents regression (bug won't come back unnoticed)
- Validates the fix actually works
- Creates a safety net for future changes

**What this means for you:**
- Bug fixes may take slightly longer (test writing + fix)
- You'll see test files created alongside fixes
- Higher confidence that bugs stay fixed

---

## Git Commit Guidelines

**When creating commits:**
- Write clear, descriptive commit messages
- Use present tense ("Fix bug" not "Fixed bug")
- Include root cause and implementation details for bug fixes
- **DO NOT include "Co-Authored-By" lines**
- Keep messages concise but informative

---

## Deployment Workflow

**CRITICAL: Backend is hosted on Railway and requires deployment**

### Current Infrastructure:
- **Backend API**: Hosted on Railway (auto-deploys from git push)
- **Frontend**: React Native app runs locally during development via Expo
- **Database**: PostgreSQL on Railway
- **Image Storage**: Cloudflare R2

### When Making Code Changes:

**Frontend Changes Only** (carbtracker-app/):
- Changes hot-reload automatically in Expo during development
- Press `r` in Expo terminal to manually reload if needed
- No deployment needed for local testing
- For production: Build and submit to App Store (Phase 3+)

**Backend Changes** (carbtracker-api/):
- ⚠️ **ALWAYS deploy to Railway after backend changes**
- Local changes don't affect the live app until deployed
- Railway auto-deploys when you push to git

**Deployment Steps:**
1. Make backend code changes
2. Test locally if needed (optional):
   ```bash
   cd carbtracker-api
   uvicorn app.main:app --reload
   # Update frontend api.ts to localhost:8000
   ```
3. **Commit and push** (triggers Railway deployment):
   ```bash
   git add -A
   git commit -m "Description of changes"
   git push
   ```
4. **Verify deployment**:
   - Railway dashboard shows deployment status
   - Usually takes 1-2 minutes
   - Test with a new photo analysis to confirm changes

**Changes Requiring Backend Deployment:**
- Any modifications to `carbtracker-api/` files
- Prompt changes (claude_vision.py)
- API endpoint changes
- Database schema changes
- Environment variable updates

**Changes NOT Requiring Deployment:**
- Frontend UI changes
- React Native component updates
- Local styling changes
- Navigation changes

### My Responsibility as Technical Lead:
- **ALWAYS complete deployment when making backend changes**
- Don't leave backend changes uncommitted or unpushed
- Verify Railway deployment succeeds before marking work complete
- Inform you if deployment fails or needs manual intervention

---

## Working Agreement

**My commitment:** I will prioritize building something that works and is maintainable over building something "perfect." I will speak up if a decision creates technical risk or user safety issues.

**Your commitment:** Make product decisions based on user needs, provide clear feedback on technical tradeoffs, and let me know when technical explanations aren't making sense.

**Our shared goal:** Ship a carb estimation tool that you trust enough to use on yourself every day.

---

*Ready to build something that helps people? Let's start with Week 1.*
