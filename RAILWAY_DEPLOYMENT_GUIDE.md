# Railway Backend Deployment Guide

This guide walks you through deploying the CarbTracker backend API to Railway for beta testing.

## Prerequisites

- Railway account (sign up at railway.app)
- Anthropic API key
- Git repository (your code is already in Git)

## Step 1: Install Railway CLI

Open terminal and run:
```bash
npm install -g @railway/cli
```

Verify installation:
```bash
railway --version
```

## Step 2: Login to Railway

```bash
railway login
```

This opens a browser window. Complete authentication.

## Step 3: Initialize Railway Project

Navigate to your API directory:
```bash
cd carbtracker-api
```

Initialize Railway project:
```bash
railway init
```

When prompted:
- Choose "Create a new project"
- Give it a name: "carbtracker-api"
- Select your team (or personal account)

## Step 4: Configure Environment Variables

Create a production environment file (DO NOT commit this):
```bash
# Create .env.production file
echo "ANTHROPIC_API_KEY=your_actual_key_here" > .env.production
echo "DATABASE_URL=sqlite:///./carbtracker.db" >> .env.production
echo "ENVIRONMENT=production" >> .env.production
```

**Important:** Replace `your_actual_key_here` with your real Anthropic API key.

Add environment variables to Railway:
```bash
railway variables set ANTHROPIC_API_KEY=your_actual_key_here
railway variables set DATABASE_URL=sqlite:///./carbtracker.db
railway variables set ENVIRONMENT=production
```

Or set them in the Railway dashboard:
1. Go to railway.app/dashboard
2. Select your project
3. Go to Variables tab
4. Add each variable

## Step 5: Create Dockerfile (if not exists)

Railway auto-detects Python apps, but a Dockerfile ensures consistency:

Create `carbtracker-api/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Railway will map this)
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Step 6: Deploy to Railway

From the `carbtracker-api` directory:
```bash
railway up
```

This will:
- Build your application
- Deploy to Railway's infrastructure
- Provide a temporary URL

**Expected time:** 2-5 minutes for first deployment

## Step 7: Get Your Production URL

After deployment completes:
```bash
railway domain
```

This shows your app's URL, something like:
`carbtracker-api-production.up.railway.app`

Or get it from the dashboard:
1. Go to railway.app/dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Your URL is shown there

**Add a custom domain (optional):**
```bash
railway domain add api.carbtracker.app
```

## Step 8: Test Your Deployed API

Test the health check endpoint:
```bash
curl https://your-railway-url.railway.app/health
```

Expected response:
```json
{"status": "healthy"}
```

Test the analyze endpoint (requires image):
```bash
curl -X POST https://your-railway-url.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_base64": "...", "description": "Test meal"}'
```

## Step 9: Update Mobile App Configuration

Edit `carbtracker-app/constants/api.ts`:

```typescript
// Change production URL to your Railway URL
export const API_BASE_URL = __DEV__
  ? 'http://192.168.4.38:8000' // Your local IP for development
  : 'https://your-railway-url.railway.app'; // Your Railway URL
```

Commit this change:
```bash
git add carbtracker-app/constants/api.ts
git commit -m "Update production API URL to Railway"
```

## Step 10: Monitor Your Deployment

### View Logs
```bash
railway logs
```

Or in the dashboard:
1. Go to railway.app/dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment to view logs

### Monitor Usage
1. Go to railway.app/dashboard
2. Select your project
3. Click "Usage" tab
4. View metrics and costs

### Set Up Alerts

In Railway dashboard:
1. Go to project settings
2. Add notification webhooks or email alerts
3. Set budget alerts (recommended: $50/month)

## Cost Expectations

**Railway Pricing (as of 2024):**
- First $5/month free
- Pay-as-you-go after that
- ~$0.000463/GB-hour for resources

**Expected beta costs (10-15 testers):**
- API hosting: $20-30/month
- Database storage: Included
- Bandwidth: ~$5-10/month
- **Total: $20-50/month**

## Troubleshooting

### Deployment fails
```bash
railway logs
```
Check for:
- Missing dependencies in requirements.txt
- Environment variable issues
- Port binding errors

### Can't connect to API
- Verify URL: `railway domain`
- Check firewall: Railway should be public by default
- Test with curl: `curl https://your-url/health`
- Check logs: `railway logs`

### High costs
- Check usage dashboard
- Review Anthropic API call frequency
- Consider adding caching
- Set up budget alerts

### Database issues
SQLite limitations with Railway:
- SQLite file storage is ephemeral (resets on redeploy)
- For persistent storage, upgrade to PostgreSQL:

```bash
railway add --plugin postgresql
```

Then update DATABASE_URL:
```bash
railway variables set DATABASE_URL=${{RAILWAY_DATABASE_URL}}
```

## Redeploying Updates

When you fix bugs or add features:

```bash
cd carbtracker-api
git commit -am "Your changes"
railway up
```

Railway automatically redeploys on push if you enable GitHub integration.

## Rollback to Previous Version

If something breaks:
```bash
railway rollback
```

Or in the dashboard:
1. Go to Deployments
2. Select previous successful deployment
3. Click "Rollback"

## Alternative: Enable GitHub Auto-Deploy

Connect Railway to your GitHub repo:
1. In Railway dashboard, go to Settings
2. Click "Connect GitHub"
3. Select your repository
4. Choose branch (e.g., `master`)
5. Enable auto-deploy

Now every push to master triggers automatic deployment.

## Next Steps

After successful deployment:
1. ✅ Update mobile app API URL
2. ✅ Test from mobile app (not just curl)
3. ✅ Set up monitoring alerts
4. ✅ Document your Railway URL in team notes
5. ✅ Proceed with TestFlight build

## Support

- Railway Docs: docs.railway.app
- Railway Discord: railway.app/discord
- Your contact: [INSERT YOUR CONTACT]

---

**Important:** Keep your Anthropic API key secure. Never commit `.env` files to Git!
