# CarbTracker Beta Testing Guide
**Version:** 1.0
**Last Updated:** January 30, 2026
**Beta Phase:** Closed Beta (Phase 3B)

---

## Welcome Beta Testers! 🎉

Thank you for helping test CarbTracker before the public launch. As a Type 1 diabetic yourself, your feedback is invaluable in making this app safe, accurate, and truly useful for the T1D community.

**What you're testing:** An AI-powered app that estimates carbohydrates from meal photos to help with insulin dosing decisions.

**Your role:** Use the app for real meals, provide honest feedback, and help us identify issues before launching to the App Store.

---

## How to Get Started

### 1. Install the App (TestFlight)

You'll receive an email invitation to TestFlight (Apple's beta testing platform).

**Steps:**
1. Install TestFlight app from App Store (if you don't have it)
2. Open the invitation email on your iPhone
3. Tap "View in TestFlight"
4. Install CarbTracker Beta
5. Open the app

**First Time Setup:**
- No account required (beta version)
- Grant camera permissions when prompted
- Read the medical disclaimers

### 2. Test with Real Meals

**We need you to test 5-10 meals minimum over 2-4 weeks.**

**Types of meals to test:**
- ✅ Simple meals (single food items)
- ✅ Complex meals (multiple components)
- ✅ Restaurant meals
- ✅ Beverages (soda, juice, beer, coffee drinks)
- ✅ Home-cooked meals
- ✅ Packaged foods (with known carb counts)

**What to track for each meal:**
1. Take the photo in the app
2. Follow the AI analysis flow
3. Note the estimated carbs
4. Compare to actual carbs (if known from label/database)
5. Record your feedback

---

## What We're Testing

### Critical Items:

**1. Accuracy**
- How close are the carb estimates to reality?
- Which meal types are most accurate?
- Which meal types need improvement?

**2. Safety**
- Does the app clearly show when it's uncertain?
- Are the disclaimers prominent enough?
- Do you feel safe using these estimates for dosing?

**3. Usability**
- Is the flow intuitive?
- Any confusing steps?
- How fast is it compared to your current method?

**4. Reliability**
- Any crashes or freezes?
- Does the camera work smoothly?
- Do photos upload consistently?

### New Features in This Build:

**Feature 1: Fine-Tune Carb Adjustments**
- You can now adjust estimates by ±1g for precision
- Quick adjustments: -10, -5, 0, +5, +10, +15, +20
- Fine-tune: -1, +1 (tap multiple times to accumulate)

**Please test:**
- Does the ±1g fine-tune feel useful?
- Are the adjustment buttons easy to use?
- Do you use quick adjustments more or fine-tune more?

**Feature 2: Beverage Questions**
- For drinks, the app now asks about type, size, and fullness
- This helps estimate carbs for liquids (which AI can't judge well)

**Please test with:**
- Full beverages (soda, juice, beer)
- Partially consumed drinks
- Diet/zero-sugar drinks
- Large smoothies/coffees

**Critical test:** Nearly empty glass → should estimate close to 0g, not full amount

---

## How to Provide Feedback

### Option 1: Quick Feedback Form (Preferred)
[Google Form link will be provided]

**For each meal you test, submit:**
- Meal type/description
- AI estimate
- Actual carbs (if known)
- Accuracy rating (1-5 stars)
- Any issues or notes

### Option 2: Detailed Feedback
For bugs, feature requests, or detailed feedback:
[Email/Discord/Slack link will be provided]

**Include:**
- Clear description of issue/suggestion
- Steps to reproduce (for bugs)
- Screenshots (if applicable)
- What you expected vs. what happened

---

## What to Report

### 🚨 Report Immediately (Critical):

**Safety Issues:**
- Dangerous overestimations (especially for beverages)
- App crashes during meal logging
- Estimates with no uncertainty shown when clearly uncertain
- Missing disclaimers

**How to report:** Email/message us directly (don't wait)

### 📝 Report When Convenient:

**Accuracy Issues:**
- Consistently wrong estimates for certain foods
- Foods not recognized
- Portion sizes way off

**Usability Issues:**
- Confusing UI/flow
- Buttons hard to tap
- Text hard to read
- Features you can't find

**Feature Requests:**
- Things you wish the app could do
- Improvements to existing features
- Integration ideas (Dexcom, Apple Health, etc.)

---

## Testing Scenarios

### Scenario 1: Simple Packaged Food
**Goal:** Test accuracy with known carb counts

**Example:** Banana, granola bar, apple
1. Take photo in app
2. Let AI analyze
3. Note estimate
4. Look up actual carbs (nutrition label/database)
5. Calculate accuracy: `|(estimate - actual)| / actual * 100`
6. Report: Estimate, Actual, Accuracy %

**Success:** ±15% accuracy

### Scenario 2: Complex Home-Cooked Meal
**Goal:** Test multi-food analysis

**Example:** Chicken breast, rice, broccoli
1. Take photo of full plate
2. Confirm each food item AI identifies
3. Answer any quick-tap questions
4. Note total estimate
5. Compare to your usual carb counting method
6. Report: Did AI identify all foods? How close was total?

**Success:** Identifies all major components, ±20g total

### Scenario 3: Restaurant Meal
**Goal:** Test with unknown carb counts

**Example:** Burger and fries, pasta dish
1. Take photo in app
2. Complete analysis
3. Use estimate to dose insulin
4. Track blood sugar response (if comfortable)
5. Report: Did the estimate lead to good BG control?

**Success:** Estimate usable for dosing (no severe highs/lows)

### Scenario 4: Beverage (Critical Test)
**Goal:** Test new beverage questions feature

**Example:** Partially consumed soda, beer, juice
1. Take photo of beverage
2. Answer type, size, fullness questions
3. Note estimate
4. Compare to actual carbs (nutrition label)
5. **Critical:** Test nearly-empty glass → should be ~0g, not 30-40g

**Success:**
- Full 12oz soda → 35-45g
- Diet soda → 0-5g
- Nearly empty → 0-10g
- Large smoothie → 70-90g

### Scenario 5: Daily Use (Most Important)
**Goal:** Test real-world usability

**Use CarbTracker for all meals for 3-7 days:**
1. Note time saved vs. your usual method
2. Track how often you manually adjust estimates
3. Note which features you use most
4. Identify any friction points
5. Report: Would you use this daily after launch?

**Success:** Faster than manual carb counting, accurate enough to trust

---

## Feedback We're Looking For

### Questions to Answer:

**Accuracy:**
- What's the average accuracy for simple meals? Complex meals?
- Which food types are most accurate? Least accurate?
- Are portion sizes generally correct?

**Speed:**
- How long does analysis take? (Goal: <10 seconds)
- Is this faster than your current method?
- Any delays or slow steps?

**Usability:**
- Is the flow intuitive or confusing?
- Which features are most useful?
- What's missing or frustrating?

**Trust:**
- Do you feel comfortable using these estimates for dosing?
- Do you trust the app more over time or less?
- What would increase your confidence?

**Value:**
- Would you use this daily?
- Would you recommend to other T1Ds?
- Would you pay for this? How much?

---

## Beta Testing Timeline

**Week 1-2: Learning Phase**
- Get familiar with the app
- Test with 5-10 meals
- Report initial feedback
- Identify any critical bugs

**Week 3-4: Daily Use Phase**
- Use for most/all meals
- Track accuracy patterns
- Note usability improvements needed
- Test edge cases

**End of Beta:**
- Complete final feedback survey
- Share overall thoughts
- Suggest top 3 improvements
- Vote on feature priorities

---

## What Happens Next

### During Beta:
- We'll fix bugs you report
- We may push app updates via TestFlight
- You'll see improvements based on your feedback
- We'll communicate changes and ask for retesting

### After Beta:
- We'll implement top-requested features
- Polish the app based on your input
- Submit to App Store for public release
- **You get lifetime free access** (as thanks for beta testing)

### Your Impact:
- Your feedback directly shapes the final product
- You're helping improve T1D technology for the community
- You'll be credited as beta tester (if you want)

---

## Important Disclaimers

### This is BETA Software:
- ✅ Safe to test with real meals (with your usual precautions)
- ⚠️ May have bugs, crashes, or inaccuracies
- ⚠️ Always verify estimates before dosing if unsure
- ⚠️ Not a replacement for medical advice

### Medical Disclaimer:
**CarbTracker is an estimation tool, not a medical device.**

- Estimates are NOT guaranteed accurate
- You assume all risk for insulin dosing decisions
- Always consult your healthcare provider
- Use your best judgment for every dose
- Check blood sugar after meals as usual

**If the app gives a clearly wrong estimate, don't use it. Trust your experience and report the issue.**

---

## Beta Tester Support

### Questions?
[Contact email/Discord/Slack]

### Found a Bug?
[Bug report form/channel]

### Want to Chat?
[Optional: Beta tester Discord/Slack community]

### Need Help?
[FAQ or troubleshooting link]

---

## Tips for Effective Testing

### Do:
- ✅ Test diverse meal types
- ✅ Compare estimates to known values when possible
- ✅ Be honest in feedback (even if critical)
- ✅ Report bugs promptly
- ✅ Note both good and bad experiences
- ✅ Use the app regularly for best feedback

### Don't:
- ❌ Blindly trust every estimate (use your judgment)
- ❌ Skip reporting issues (we need to know!)
- ❌ Share the app publicly yet (closed beta only)
- ❌ Expect perfection (it's beta software)
- ❌ Hesitate to ask questions

---

## Frequently Asked Questions

**Q: Is this safe to use for actual insulin dosing?**
A: The app provides estimates to help inform your decisions, but you should always use your best judgment. If an estimate seems off, trust your experience and adjust. Check blood sugar after meals as you normally would.

**Q: What if the estimate is way off?**
A: Please report it! Include the photo, estimate, and actual carbs. This helps us improve accuracy. Meanwhile, trust your usual carb counting method.

**Q: Can I share the app with other T1Ds?**
A: Not yet. This is a closed beta, so please keep it within our testing group for now. After we launch publicly, share away!

**Q: Will my data be kept private?**
A: Yes. Meal photos and data are stored securely and used only for improving the app. We won't share your data or use it for other purposes.

**Q: What if the app crashes?**
A: Please report it with details about what you were doing when it crashed. We'll fix it ASAP.

**Q: How often will the app be updated during beta?**
A: We'll push updates as we fix bugs and add features based on your feedback. TestFlight will notify you of updates.

**Q: I have a feature idea. Where do I suggest it?**
A: Use the feedback form or message us directly. We love hearing ideas!

**Q: Can I test on Android?**
A: Not yet. Beta is iOS-only for now. Android version coming after public iOS launch.

---

## Thank You! 🙏

Your participation in this beta is incredibly valuable. You're not just testing an app—you're helping build a tool that could make life easier for thousands of Type 1 diabetics.

We're building CarbTracker FOR the T1D community, WITH the T1D community. Your voice matters.

Thank you for being part of this journey.

**Let's build something great together.**

---

**Questions or Issues?**
Contact: [Your contact info here]

**Beta Testing Portal:**
[Links to feedback forms, bug reports, community chat]

**App Version:** 1.0.0-beta
**Build:** [TestFlight build number]

