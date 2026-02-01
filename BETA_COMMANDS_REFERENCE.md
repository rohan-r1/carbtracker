# Beta Launch - Quick Command Reference

Fast reference for common commands during beta testing setup and management.

---

## Railway Backend Deployment

### Initial Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Navigate to API directory
cd carbtracker-api

# Login to Railway
railway login

# Initialize project
railway init
```

### Set Environment Variables
```bash
railway variables set ANTHROPIC_API_KEY=your_key_here
railway variables set DATABASE_URL=sqlite:///./carbtracker.db
railway variables set ENVIRONMENT=production
```

### Deploy
```bash
# Deploy to Railway
railway up

# Get your production URL
railway domain

# View logs
railway logs

# View status
railway status
```

### Monitoring
```bash
# Watch logs in real-time
railway logs --tail

# Check project status
railway status
```

---

## EAS Build & TestFlight

### Initial Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo/EAS
eas login

# Check authentication
eas whoami
```

### Building for iOS
```bash
# Navigate to app directory
cd carbtracker-app

# Build for TestFlight (preview profile)
eas build --platform ios --profile preview

# Check build status
eas build:list

# View specific build
eas build:view [build-id]

# Download build
eas build:download --platform ios
```

### Submitting to TestFlight
```bash
# Submit to App Store Connect
eas submit --platform ios

# Check submission status
eas submit:list
```

### Managing Credentials
```bash
# View credentials
eas credentials

# Reset credentials (if issues)
eas credentials --reset
```

---

## Local Development & Testing

### Start Development Server
```bash
# Navigate to app directory
cd carbtracker-app

# Start Expo dev server
npx expo start

# Start with cleared cache
npx expo start -c

# Start iOS simulator
npx expo start --ios

# Start on physical device
npx expo start --tunnel
```

### Backend Development
```bash
# Navigate to API directory
cd carbtracker-api

# Start local backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Check if backend is running
curl http://localhost:8000/health

# Test analyze endpoint (requires image)
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_base64": "...", "description": "Test meal"}'
```

---

## Git Commands (Committing Updates)

### Standard Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to remote
git push origin master

# View commit history
git log --oneline -10
```

### Before TestFlight Build
```bash
# Commit all changes
git add .
git commit -m "Prepare for TestFlight build v1.0.0"
git push

# Tag the release
git tag -a v1.0.0-beta1 -m "First TestFlight beta build"
git push --tags
```

---

## Testing & Debugging

### Check Backend Connection
```bash
# Test Railway backend health
curl https://your-railway-url.railway.app/health

# Expected response: {"status":"healthy"}

# Test local backend health
curl http://192.168.4.38:8000/health
```

### iOS Device Logs
```bash
# View iOS device logs (if connected)
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "CarbTracker"'

# Or use Xcode → Window → Devices and Simulators → View Device Logs
```

### Clear App Data (Testing)
```bash
# In Expo Go or development build:
# Shake device → Developer Menu → Reload / Clear Cache

# For TestFlight build:
# Delete and reinstall app
```

---

## Google Form Management

### Get Form Link
1. Open form at [forms.google.com](https://forms.google.com)
2. Click "Send" button (top right)
3. Click link icon
4. Copy shortened URL: `https://forms.gle/AbC123`

### View Responses
1. Open form
2. Click "Responses" tab
3. View summary or individual responses

### Export to Spreadsheet
1. Responses tab → Click green spreadsheet icon
2. Opens Google Sheets with all responses
3. Analyze with pivot tables or charts

### Enable Email Notifications
1. Responses tab → Three dots menu
2. "Get email notifications for new responses"
3. You'll receive email for each submission

---

## App Store Connect

### Access TestFlight
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. My Apps → CarbTracker
3. TestFlight tab

### Add Beta Testers
```
App Store Connect → TestFlight → Internal Testing or External Testing
→ Click "+" to add testers
→ Enter email addresses
→ Testers receive invitation email from Apple
```

### Create Public Link
```
App Store Connect → TestFlight → External Testing
→ Create new group
→ Enable "Public Link"
→ Copy link: https://testflight.apple.com/join/ABCD1234
```

### View Metrics
```
TestFlight → Testers tab
- Number of installs
- Active users (7-day, 30-day)
- Crashes (if any)
```

---

## Discord Setup (Optional)

### Create Server
1. Open Discord app or web
2. Click "+" in server list
3. "Create My Own" → "For a club or community"
4. Name: "CarbTracker Beta"
5. Upload icon (optional)

### Create Channels
```
Text Channels:
- #welcome (pinned message with links)
- #installation-help
- #feedback
- #bug-reports
- #feature-requests
- #general
```

### Get Invite Link
1. Click server name → Invite People
2. "Edit invite link"
3. Set to "Never expire"
4. Copy link: `https://discord.gg/AbC123`

---

## Updating During Beta

### Push App Update to TestFlight
```bash
# 1. Make code changes
cd carbtracker-app

# 2. Test locally
npx expo start
# Test on your device

# 3. Commit changes
git add .
git commit -m "Fix: [description of what you fixed]"
git push

# 4. Build new version
eas build --platform ios --profile preview

# 5. Submit to TestFlight
eas submit --platform ios

# 6. Add "What's New" in App Store Connect
# TestFlight → Select new build → Add release notes

# 7. Notify testers via Discord/email
```

### Update Backend
```bash
# 1. Make changes
cd carbtracker-api

# 2. Test locally
uvicorn app.main:app --reload

# 3. Commit changes
git add .
git commit -m "Fix: [description]"
git push

# 4. Deploy to Railway
railway up

# 5. Verify deployment
curl https://your-railway-url.railway.app/health
```

---

## Monitoring Commands

### Check Railway Usage
```bash
# View current usage
railway status

# View logs (last 100 lines)
railway logs

# Monitor logs in real-time
railway logs --tail
```

### Check TestFlight Stats
```
App Store Connect → TestFlight → Metrics
- Installs this week
- Active last 7 days
- Crashes (crash logs available)
```

### Check Google Form Submissions
```
1. Open form → Responses tab
2. Summary view shows:
   - Total responses
   - Average ratings
   - Response charts
3. Individual view shows each submission
```

---

## Troubleshooting Commands

### EAS Build Fails
```bash
# View build logs
eas build:view [build-id]

# Clear local cache
npx expo start -c

# Reset credentials
eas credentials --reset

# Try building again
eas build --platform ios --profile preview --clear-cache
```

### Railway Backend Issues
```bash
# Check logs for errors
railway logs

# Restart service
railway restart

# Check environment variables
railway variables

# Redeploy
railway up
```

### Can't Connect to Backend
```bash
# Verify Railway URL
railway domain

# Test health endpoint
curl https://your-railway-url.railway.app/health

# Check if service is running
railway status

# View recent logs
railway logs
```

---

## Cost Monitoring

### Railway Costs
```bash
# View current month usage
railway status

# Set budget alert:
# 1. Go to railway.app/dashboard
# 2. Project Settings → Usage
# 3. Set budget alert ($50 recommended)
```

### Anthropic API Costs
```bash
# View usage:
# 1. Go to console.anthropic.com
# 2. Settings → Usage
# 3. View this month's spend

# Expected beta cost: ~$50-150/month for 10-15 testers
```

---

## Quick File Paths

### Configuration Files
```
carbtracker-app/eas.json
carbtracker-app/app.json
carbtracker-app/constants/api.ts
carbtracker-api/.env (local only, DON'T commit)
```

### Documentation
```
BETA_LAUNCH_SUMMARY.md (this file)
TESTFLIGHT_SETUP_CHECKLIST.md
RAILWAY_DEPLOYMENT_GUIDE.md
BETA_TESTER_QUICK_START.md
FEEDBACK_FORM_TEMPLATE.md
```

---

## Emergency Commands

### Rollback Railway Deployment
```bash
# View previous deployments
railway deployments

# Rollback to previous version
railway rollback
```

### Cancel EAS Build
```bash
# If build is taking too long or stuck
eas build:cancel [build-id]
```

### Remove TestFlight Tester
```
App Store Connect → TestFlight → Testers
→ Select tester → Remove
```

---

## Useful Links

- **Railway Dashboard:** railway.app/dashboard
- **App Store Connect:** appstoreconnect.apple.com
- **Expo Dashboard:** expo.dev/accounts/[username]/projects/carbtracker
- **Anthropic Console:** console.anthropic.com
- **Google Forms:** forms.google.com
- **Apple Developer:** developer.apple.com/account

---

## Daily Beta Monitoring Checklist

**Morning check (5 minutes):**
```
[ ] Check Google Form for new feedback submissions
[ ] Check Discord/email for questions or bug reports
[ ] Check App Store Connect → TestFlight → Metrics (installs, crashes)
[ ] Check Railway dashboard (uptime, errors)
```

**As needed:**
```
[ ] Respond to tester questions within 24 hours
[ ] Triage bug reports (critical vs. minor)
[ ] Thank testers for detailed feedback
[ ] Plan updates based on feedback patterns
```

**Weekly:**
```
[ ] Analyze feedback trends
[ ] Send update email to testers
[ ] Push fixes via new TestFlight build
[ ] Review costs (Railway, Anthropic API)
```

---

## Pre-Flight Test Checklist

**Before every TestFlight build, test locally:**
```bash
cd carbtracker-app
npx expo start
```

**8-Point Test:**
```
[ ] Open app → Camera permission granted
[ ] Take photo → Upload succeeds
[ ] Analyze meal → See results
[ ] Confirm foods → Select options
[ ] Answer quick questions
[ ] Adjust carbs (quick + fine-tune)
[ ] Log meal → See in history
[ ] Settings → Privacy/Terms → See alerts (not broken links)
```

---

**Keep this file bookmarked for quick reference during beta testing!** 📋
