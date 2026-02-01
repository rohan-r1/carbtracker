# TestFlight Setup Checklist

Complete step-by-step guide for distributing CarbTracker via TestFlight.

## Timeline Overview

- **Day 1:** Apple Developer enrollment + bug fixes (Today)
- **Day 2:** Wait for Apple approval (usually same day)
- **Day 3:** Build and submit to TestFlight
- **Day 4:** Invite beta testers + monitor

---

## Phase 1: Pre-Flight Preparation ✅

### Critical Bug Fixes (COMPLETED)
- [x] Fixed history screen crash (removed undefined `isLoading`)
- [x] Fixed privacy/terms links (shows "Coming soon" alert)
- [x] Created EAS configuration file

### Remaining Pre-Flight Tasks
- [ ] Deploy backend to Railway (see RAILWAY_DEPLOYMENT_GUIDE.md)
- [ ] Update API_BASE_URL in `constants/api.ts` with Railway URL
- [ ] Test locally on your physical iPhone
- [ ] Verify camera permissions work
- [ ] Complete at least 2 full meal analyses
- [ ] Test with empty history (verify no crash)
- [ ] Test privacy/terms links (verify alerts show)

### Testing Script (Run This Before Building)
```bash
cd carbtracker-app
npx expo start
```

**Test these flows:**
1. ✅ Open app → Camera permission prompt → Grant
2. ✅ Take photo → Add description → Analyze meal
3. ✅ Confirm foods → Answer quick questions → Log meal
4. ✅ View history → See logged meal
5. ✅ Settings → Tap Privacy Policy → See "Coming soon" alert
6. ✅ Settings → Tap Terms → See "Coming soon" alert
7. ✅ Force quit app → Reopen → History still shows meals
8. ✅ Delete all meals → View history → See empty state (no crash)

---

## Phase 2: Apple Developer Account Setup

### Step 1: Enroll in Apple Developer Program
1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Click "Enroll" in the top right
3. Sign in with your Apple ID (use your primary email)
4. Choose enrollment type:
   - **Individual:** For personal projects ($99/year)
   - **Organization:** Requires DUNS number ($99/year)
   - **Recommended:** Individual for beta testing

### Step 2: Complete Enrollment Form
**Information needed:**
- Legal name
- Address
- Phone number
- Payment method (credit card)

**Cost:** $99/year (auto-renews)

### Step 3: Review and Submit
- Review Apple Developer Agreement
- Pay $99 enrollment fee
- Submit application

**Expected wait time:**
- Usually approved within hours
- Sometimes takes up to 24 hours
- Check email for approval notification

### Step 4: Get Your Team ID
Once approved:
1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Click "Membership" in sidebar
3. Find your **Team ID** (10-character code like "A1B2C3D4E5")
4. **SAVE THIS** - you'll need it for EAS configuration

---

## Phase 3: EAS Build Setup

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

### Step 2: Login to Expo/EAS
```bash
eas login
```

**Don't have an Expo account?**
```bash
eas register
```

### Step 3: Update EAS Configuration

Edit `carbtracker-app/eas.json` and replace placeholders:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-actual-apple-id@email.com",
        "ascAppId": "PLACEHOLDER",
        "appleTeamId": "YOUR_ACTUAL_TEAM_ID"
      }
    }
  }
}
```

**Replace:**
- `your-actual-apple-id@email.com` → Your Apple ID email
- `YOUR_ACTUAL_TEAM_ID` → Team ID from Step 4 above

**Note:** `ascAppId` will be auto-generated on first submit.

### Step 4: Configure App Identifier

Edit `carbtracker-app/app.json`:

Add the `ios` section if not present:
```json
{
  "expo": {
    "name": "CarbTracker",
    "slug": "carbtracker",
    "ios": {
      "bundleIdentifier": "com.carbtracker.app",
      "buildNumber": "1"
    }
  }
}
```

---

## Phase 4: Create TestFlight Build

### Step 1: Final Local Test
```bash
cd carbtracker-app
npx expo start
```

Test everything one more time on your iPhone.

### Step 2: Build for iOS (Preview Profile)
```bash
cd carbtracker-app
eas build --platform ios --profile preview
```

**What happens:**
1. EAS prompts for Apple ID credentials
2. Creates signing certificates automatically
3. Provisions your device
4. Builds the .ipa file (takes 15-30 minutes)
5. Uploads to Expo's servers

**First-time prompts:**
- "Set up Push Notifications?" → Yes (required for future features)
- "Generate credentials?" → Yes (EAS handles this)
- "Add your Apple ID?" → Enter your credentials

**Expected time:** 20-30 minutes for first build (faster after)

**Monitor progress:**
```bash
eas build:list
```

Or check: [expo.dev/accounts/[your-username]/projects/carbtracker/builds](https://expo.dev/accounts/)

### Step 3: Download Build (Optional)
Once complete, download the .ipa:
```bash
eas build:download --platform ios
```

You can install this directly on your device for testing (before TestFlight).

---

## Phase 5: Submit to TestFlight

### Step 1: Submit to App Store Connect
```bash
cd carbtracker-app
eas submit --platform ios --profile preview
```

**What happens:**
1. Uploads build to App Store Connect
2. Creates TestFlight entry
3. Automated TestFlight review (usually instant)

**Expected time:** 5-10 minutes

### Step 2: Access App Store Connect

Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

1. Sign in with Apple ID
2. Click "My Apps"
3. Find "CarbTracker" (auto-created)
4. Click on it

### Step 3: Configure TestFlight Settings

Navigate to **TestFlight** tab:

**Build Information:**
1. Select your uploaded build
2. Add "What to Test" notes (see template below)
3. Add export compliance info:
   - "Does your app use encryption?" → **No** (or Yes if using HTTPS)
   - If Yes: "Is it exempt?" → **Yes** (standard HTTPS)

**Test Information:**
1. Beta App Description: "AI-powered carb estimation for Type 1 diabetics"
2. Feedback Email: [Your email]
3. Privacy Policy URL: Leave blank (not required for beta)

### Step 4: "What to Test" Template

```
CarbTracker Beta v1.0.0 - Build 1

WELCOME TO THE BETA!
Thank you for helping test CarbTracker. This closed beta helps us validate the app before public launch.

WHAT'S NEW IN THIS BUILD:
- Initial beta release
- AI-powered carb estimation from meal photos
- Food confirmation with alternatives
- Quick-tap questions for improved accuracy
- Fine-tune adjustments (±1g precision)
- Meal history tracking

PLEASE TEST:
1. Take photos of 5-10 diverse meals over the next 2 weeks
2. Compare AI estimates to known carb counts when possible
3. Test the food confirmation and quick-tap features
4. Use manual adjustments as needed
5. Report accuracy (good/bad) via feedback form

KNOWN ISSUES:
- Privacy/Terms links show "Coming soon" (will be added before public launch)
- Backend may be slow during peak usage (optimizing)

HOW TO PROVIDE FEEDBACK:
📋 Quick feedback form: [INSERT GOOGLE FORM LINK]
🐛 Report bugs: [INSERT YOUR EMAIL]
💬 Ask questions: [INSERT DISCORD/EMAIL]

IMPORTANT SAFETY NOTES:
- This is BETA software - may contain bugs or inaccuracies
- Always use your judgment before dosing insulin
- Verify estimates against nutrition labels when possible
- Report any safety concerns immediately

Thank you for your help! 🙏
```

---

## Phase 6: Invite Beta Testers

### Option A: Email Invitations (Recommended for Small Group)

**Pros:** Control who tests, personal invitations
**Cons:** Must add testers individually

**Steps:**
1. In TestFlight tab → "Internal Testing" or "External Testing"
2. Click "Add Testers"
3. Enter email addresses (one per line)
4. Click "Add"
5. Testers receive automated email from Apple

**Internal vs External:**
- **Internal:** Up to 100 testers, instant access, Apple employees/contractors only
- **External:** Up to 10,000 testers, requires Apple review (usually instant)

**Recommendation:** Use External Testing for community members

### Option B: Public Link (Easiest for Community)

**Pros:** Share one link, anyone can join
**Cons:** Less control over who tests

**Steps:**
1. Go to TestFlight → External Testing
2. Create new group: "Community Beta"
3. Add your build to the group
4. Enable "Public Link"
5. Copy the link (format: `https://testflight.apple.com/join/ABCD1234`)
6. Share link in email/Discord/community

**Limits:**
- Max 10,000 testers per public link
- Beta expires after 90 days (can renew)

### Gradual Rollout Strategy

**Week 1: Close Friends (3-5 testers)**
- Send personal email invitations
- Provide direct support via text/call
- Fix critical bugs before wider release
- Goal: Validate installation process

**Week 2: Expand (10-15 testers)**
- Share public link with community
- Send email with installation guide
- Set up Discord/Slack for support
- Goal: Validate accuracy and UX

**Week 3-4: Iterate**
- Push updates based on feedback
- Monitor engagement and usage
- Prepare for public launch decision

---

## Phase 7: Beta Tester Communication

### Email Invitation Template

**Subject:** You're Invited - CarbTracker Beta Testing

```
Hi [Name],

You're invited to help beta test CarbTracker, an AI-powered carb estimation app for Type 1 diabetics!

🎯 WHAT IT DOES:
Take a photo of your meal → Get instant carb estimate → Make better dosing decisions

📱 HOW TO INSTALL (3 minutes):
1. Check your email for "Join the CarbTracker beta on TestFlight" from Apple
   OR use this link: [TestFlight link]
2. Install TestFlight app if you don't have it (free from App Store)
3. Tap "Start Testing" in the email/link
4. Install CarbTracker
5. Open and grant camera permissions

📖 QUICK START GUIDE:
See attached BETA_TESTER_QUICK_START.md for step-by-step instructions

🧪 WHAT I NEED FROM YOU:
- Test with 5-10 real meals over the next 2 weeks
- Submit feedback after each meal: [Google Form link]
- Report bugs immediately: [Your email/Discord]
- Be honest - critical feedback helps most!

⚠️ IMPORTANT SAFETY NOTES:
- This is beta software - may have bugs or inaccuracies
- Always use your judgment before dosing insulin
- Read the medical disclaimers in the app
- Don't share publicly yet (closed beta only)

💬 QUESTIONS OR ISSUES?
- Discord: [Discord link if you set one up]
- Email: [Your email]
- Full guide: BETA_TESTING_GUIDE.md (attached)

🙏 THANK YOU!
Your feedback will directly shape the final product and help the entire T1D community.

Let's build something great together!

[Your name]

---
Attachments:
- BETA_TESTER_QUICK_START.md
- BETA_TESTING_GUIDE.md
```

### Discord Setup (Optional but Recommended)

**Create channels:**
- #welcome (intro + links)
- #installation-help
- #feedback
- #bug-reports
- #feature-requests
- #general

**Welcome message:**
```
Welcome to the CarbTracker Beta! 🎉

📱 INSTALL:
TestFlight link: [link]
Quick start: [link to guide]

💬 CHANNELS:
#installation-help - Can't get it working?
#feedback - Share your experience
#bug-reports - Found a bug? Report here
#feature-requests - Ideas for improvement

📋 FEEDBACK FORM:
After each meal: [Google Form]

⚠️ REMEMBER:
This is beta software. Always use your judgment before dosing insulin.

Let's make this great! 🚀
```

---

## Phase 8: Monitoring & Updates

### Daily Monitoring (First Week)

**Check these daily:**
1. App Store Connect → TestFlight → Metrics
   - How many installs?
   - How many active users?
   - Crash reports?

2. Google Form submissions
   - Are testers actively testing?
   - What's the accuracy feedback?

3. Discord/Email
   - Answer questions promptly
   - Thank testers for feedback

4. Railway Dashboard
   - Backend uptime OK?
   - API response times normal?
   - Costs within budget?

### Pushing Updates

When you fix bugs or add features:

**Step 1: Make changes locally**
```bash
cd carbtracker-app
# Make your code changes
```

**Step 2: Test locally**
```bash
npx expo start
# Test on your device
```

**Step 3: Build new version**
```bash
eas build --platform ios --profile preview
```

**Step 4: Submit to TestFlight**
```bash
eas submit --platform ios
```

**Step 5: Add "What's New" notes**
In App Store Connect:
1. Go to TestFlight
2. Select new build
3. Add release notes describing changes

**Step 6: Notify testers**
Post in Discord or send email:
```
🚀 NEW BUILD AVAILABLE (v1.0.0 build 2)

WHAT'S NEW:
- Fixed: [bug description]
- Improved: [feature improvement]
- Added: [new feature]

Update now via TestFlight (you'll get a notification)

Thanks for your continued testing! 🙏
```

### Weekly Check-ins

**Week 1 email:**
```
Subject: CarbTracker Beta - Week 1 Update

Hi beta testers!

Quick update after week 1:

✅ WHAT'S WORKING:
- X testers actively using
- Y meals analyzed
- Great feedback on [feature]

🐛 FIXES COMING:
- [Bug 1] - fix in next build
- [Bug 2] - investigating

📊 PLEASE KEEP TESTING:
We need more data on [specific meal types]

Questions? Reply or post in Discord.

Thank you! 🙏
[Your name]
```

---

## Troubleshooting Guide

### Build Fails

**Error: "No valid signing certificate"**
```bash
eas credentials
# Follow prompts to regenerate
```

**Error: "Bundle identifier already exists"**
- Change `bundleIdentifier` in app.json
- Or delete old app in App Store Connect

**Error: "Build timed out"**
- Try again (sometimes Expo servers are busy)
- Check build logs: `eas build:view [build-id]`

### Can't Submit to TestFlight

**Error: "No eligible builds"**
- Wait 5-10 minutes after build completes
- Refresh App Store Connect page
- Check build status: `eas build:list`

**Error: "Export compliance required"**
- In App Store Connect → TestFlight
- Select build → Export Compliance
- Answer encryption questions

### Testers Can't Install

**"This beta is full"**
- Check tester limit (100 internal, 10,000 external)
- Remove inactive testers
- Create new test group

**"Beta expired"**
- TestFlight betas last 90 days
- Upload new build or renew existing

**"Not compatible with this device"**
- Check iOS version requirement
- Your app requires iOS 13+ (React Native default)

### High Railway Costs

**Set usage alerts:**
```bash
railway settings
# Enable budget notifications
```

**Optimize Anthropic API usage:**
- Add response caching
- Reduce image size before sending
- Rate limit analysis requests

---

## Success Metrics (Check After 2 Weeks)

### Adoption
- [ ] 80%+ of invited testers installed successfully
- [ ] 70%+ actively using (5+ meals logged)
- [ ] Average session time: 2-5 minutes

### Engagement
- [ ] 50+ total meals analyzed
- [ ] 30+ feedback form submissions
- [ ] Active discussions in Discord/email

### Accuracy
- [ ] 85%+ estimates within ±20g (based on user feedback)
- [ ] <15% report inaccurate estimates
- [ ] Identify problem areas (specific food types)

### Reliability
- [ ] Crash rate under 5%
- [ ] Backend uptime over 95%
- [ ] Average analysis time under 10 seconds

### Satisfaction
- [ ] 70%+ would use daily
- [ ] 3+ positive testimonials
- [ ] Top 3 feature requests identified

---

## Next Steps After Successful Beta

### Week 3-4: Polish
- [ ] Fix top bugs reported by testers
- [ ] Improve accuracy for problem food types
- [ ] Implement most-requested features (if feasible)
- [ ] Professional app icon (hire designer or use Fiverr)
- [ ] Create privacy policy and terms of service

### Week 4-5: Prepare Public Launch
- [ ] Set up production environment
- [ ] Create App Store listing (screenshots, description)
- [ ] Plan marketing strategy
- [ ] Set up customer support (email, Discord)
- [ ] Prepare press kit / demo video

### Week 5-6: Public App Store Launch
- [ ] Submit for App Review
- [ ] Announce to community
- [ ] Monitor reviews and ratings
- [ ] Provide ongoing support

---

## Cost Summary

**One-time costs:**
- Apple Developer Account: $99/year
- (Optional) Professional app icon: $50-200
- (Optional) Legal review of privacy policy: $200-500

**Monthly costs (beta):**
- Railway hosting: $20-50
- Anthropic API (10-15 testers): $50-150
- **Total: $70-200/month**

**Monthly costs (public launch, 500 users):**
- Railway hosting: $50-100
- Anthropic API: $500-1000
- Analytics/monitoring: $0-50
- **Total: $550-1150/month**

---

## Support Resources

- **EAS Build Docs:** docs.expo.dev/build/introduction
- **TestFlight Docs:** developer.apple.com/testflight
- **Railway Docs:** docs.railway.app
- **Expo Discord:** discord.gg/expo
- **Your notes:** Keep detailed notes of issues and solutions

---

## Final Checklist Before Inviting Testers

- [ ] All critical bugs fixed
- [ ] Backend deployed to Railway and tested
- [ ] Production API URL updated in mobile app
- [ ] Tested full flow on your iPhone (end-to-end)
- [ ] TestFlight build uploaded and approved
- [ ] "What to Test" notes added in App Store Connect
- [ ] Google Form for feedback created
- [ ] Communication channel set up (Discord/email)
- [ ] Beta tester guides created and reviewed
- [ ] Email invitation drafted
- [ ] 3-5 close friends identified for initial test

**When all checked:** Send first invitations! 🚀

---

Good luck with your beta launch! You've got this. 💪
