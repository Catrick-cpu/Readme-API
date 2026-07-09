# Deployment Guide

Complete step-by-step instructions for deploying the GitHub README Preview API to Vercel.

## Prerequisites

- Node.js 20.x installed
- npm or yarn package manager
- GitHub account (optional, for GitHub integration)
- Vercel account (sign up at [vercel.com](https://vercel.com))

## Option 1: Vercel CLI (Recommended)

The fastest way to deploy using the Vercel CLI.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or with yarn:
```bash
yarn global add vercel
```

### Step 2: Authenticate

```bash
vercel login
```

This opens a browser window for authentication. Follow the prompts.

### Step 3: Configure Project

In your project root, run:

```bash
vercel
```

Follow the prompts:
- **Which scope?** → Your account name
- **Link to existing project?** → `N` (unless updating existing)
- **Project name?** → `github-readme-preview` (or your choice)
- **In which directory?** → `./` (default)
- **Want to override settings?** → `N`

### Step 4: Deploy to Production

```bash
vercel --prod
```

Your API is now live! You'll see output like:
```
Vercel URL: https://github-readme-preview-abc123.vercel.app
Production URL: https://github-readme-preview-abc123.vercel.app
```

### Step 5: Test Deployment

Visit your production URL with a test query:
```
https://github-readme-preview-abc123.vercel.app/api/render?type=html&content=%3Ch1%3ETest%3C%2Fh1%3E
```

## Option 2: GitHub Integration

Deploy directly from GitHub with automatic updates.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/github-readme-preview.git
git push -u origin main
```

### Step 2: Import in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Find your `github-readme-preview` repo
5. Click **"Import"**

### Step 3: Configure

The default configuration is usually sufficient:
- **Framework**: `Other`
- **Build Command**: `npm run build` (optional)
- **Output Directory**: Leave blank
- **Environment Variables**: None required

### Step 4: Deploy

Click **"Deploy"**. Vercel automatically builds and deploys your project.

### Step 5: Set Production Domain (Optional)

1. Go to project **Settings** → **Domains**
2. Add a custom domain or use the default `vercel.app` domain

## Option 3: Manual Deployment

For advanced users or CI/CD pipelines.

### Step 1: Build Locally

```bash
npm install
npm run build
```

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Deploy

```bash
vercel --prod --token YOUR_VERCEL_TOKEN
```

Get your token from [vercel.com/account/tokens](https://vercel.com/account/tokens).

## Local Development

### Start Dev Server

```bash
npm run dev
```

Runs on `http://localhost:3000`

### Test Endpoints

```bash
# Test HTML rendering
curl "http://localhost:3000/api/render?type=html&content=%3Ch1%3EHello%3C%2Fh1%3E"

# Test Markdown
curl "http://localhost:3000/api/render?type=markdown&content=%23%20Hello"

# Test Code
curl "http://localhost:3000/api/render?type=code&language=python&content=print%28%27test%27%29"
```

## Environment Variables

The API works with default settings. For production customization:

### In `vercel.json`:

```json
{
  "env": {
    "MAX_CONTENT_LENGTH": "50000",
    "MAX_SVG_WIDTH": "1200",
    "MAX_SVG_HEIGHT": "3000"
  }
}
```

### Or via Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add variables:
   - `MAX_CONTENT_LENGTH` = `50000`
   - `MAX_SVG_WIDTH` = `1200`
   - `MAX_SVG_HEIGHT` = `3000`

## Function Configuration

The project includes optimized function settings in `vercel.json`:

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

**Limits:**
- **Max Duration**: 30 seconds
- **Memory**: 1024 MB
- **Cold Start**: ~100-200ms

## Custom Domain Setup

### Add Custom Domain

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `preview.example.com`)

2. **Update DNS Records:**

   For `preview.example.com`:

   ```
   CNAME: cname.vercel.app.
   ```

   Or use nameservers:
   ```
   NS: ns1.vercel.com
   NS: ns2.vercel.com
   NS: ns3.vercel.com
   NS: ns4.vercel.com
   ```

3. **Verify Domain:**
   Wait 5-60 minutes for DNS propagation. Vercel will show verification status.

## SSL/HTTPS

Vercel automatically provides free SSL certificates via Let's Encrypt.

Your API is accessible via:
- `https://github-readme-preview.vercel.app/api/render`
- `https://your-custom-domain.com/api/render` (if configured)

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Get Required Secrets

```bash
# In Vercel project directory
vercel env pull

# This creates .env.local with:
# VERCEL_ORG_ID=...
# VERCEL_PROJECT_ID=...
```

Then in GitHub:
1. Go to **Settings** → **Secrets and variables**
2. Add repository secrets:
   - `VERCEL_TOKEN` (from [vercel.com/account/tokens](https://vercel.com/account/tokens))
   - `VERCEL_ORG_ID` (from `.env.local`)
   - `VERCEL_PROJECT_ID` (from `.env.local`)

## Monitoring & Logging

### View Logs

**In Vercel Dashboard:**
1. Select your project
2. Go to **Monitoring** → **Functions**
3. View logs for each invocation

**Via CLI:**
```bash
vercel logs api/render
```

### Performance Metrics

In Vercel Dashboard:
- **Overview** → View response times
- **Analytics** → See request patterns
- **Deployments** → Track deployment history

## Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
vercel --prod
```

### Issue: "Timeout after 30s"

**Cause:** Complex rendering taking too long

**Solution:**
1. Reduce content size
2. Increase `maxDuration` in `vercel.json`:
   ```json
   {
     "functions": {
       "api/**/*.ts": {
         "maxDuration": 45
       }
     }
   }
   ```

### Issue: "Out of memory"

**Solution:**
Increase memory in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 2048
    }
  }
}
```

### Issue: CORS errors

**Solution:** The API includes CORS headers. Ensure you're using:
- Valid request method (GET only)
- Proper URL encoding
- Correct Content-Type

## Rollback

### Via Vercel Dashboard

1. Go to **Deployments**
2. Find the version you want
3. Click the three dots
4. Select **"Promote to Production"**

### Via CLI

```bash
vercel --prod --cwd=. # Redeploy current commit
```

## Performance Optimization

### Cache Strategy

All responses include cache headers:
```
Cache-Control: public, max-age=3600, immutable
```

This means:
- Vercel edge caches for 1 hour
- Browsers cache for 1 hour
- Immutable flag prevents cache busting

### Reduce Response Size

1. **Minimize content:**
   ```
   # Good
   &content=%3Ch1%3ETest%3C%2Fh1%3E
   
   # Bad
   &content=%3Chtml%3E%3Chead%3E...very long...
   ```

2. **Use appropriate dimensions:**
   ```
   # Faster
   &width=400&height=300
   
   # Slower
   &width=1200&height=3000
   ```

## Rate Limiting (Optional)

For production deployments with high traffic, add rate limiting via Upstash:

### Install Upstash Redis

```bash
npm install @upstash/redis
```

### Add Rate Limiting Middleware

See [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting) for implementation.

## Backup & Recovery

### Automatic Backups

Vercel automatically keeps:
- Last 100 deployments
- Full deployment history
- Git integration backup

### Manual Backup

```bash
# Export environment variables
vercel env pull > .env.backup

# Save configuration
cp vercel.json vercel.json.backup
```

## Scaling

### Expected Performance

**Typical response times:**
- HTML preview: 50-150ms
- Code block: 30-100ms
- Markdown: 40-120ms
- Mermaid: 20-80ms

**Concurrent requests:** Vercel handles auto-scaling

### High Traffic Setup

For 10,000+ requests/day:
1. Use Vercel Pro plan
2. Enable Vercel Analytics
3. Monitor edge network performance
4. Consider a CDN prefix cache

## Cleanup

### Remove Project

```bash
# Remove from Vercel
vercel remove

# Or via Dashboard: Settings → Delete Project
```

### Clean Local Files

```bash
rm -rf .vercel
rm .env.local
```

## Next Steps

1. ✅ Deploy the project
2. 🧪 Test the API with examples
3. 📖 Integrate into GitHub READMEs
4. 📊 Monitor performance
5. 🔄 Set up CI/CD (optional)
6. 🎯 Add custom domain (optional)

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Community:** [github.com/vercel](https://github.com/vercel)
- **Issues:** Report in repository

---

Deployment complete! Your API is live and ready to serve preview images. 🚀
