# Vercel Deployment Guide

Quick reference for deploying the GitHub README Preview API to Vercel.

## Current Status

✅ **Node.js Runtime Updated to 24.x**  
✅ **Vercel Configuration Ready**  
✅ **All Dependencies Installed**

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Authenticate with Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

**Preview Deployment (staging):**
```bash
vercel
```

**Production Deployment:**
```bash
vercel --prod
```

## Build Configuration

### Package.json Settings
```json
{
  "engines": {
    "node": "24.x"
  }
}
```

### Vercel.json Settings
```json
{
  "version": 2,
  "runtime": "nodejs24.x",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

## API Endpoints

Once deployed, your API will be available at:

**v1 Endpoint (Original):**
```
https://your-project.vercel.app/api/render
```

**v2 Endpoint (New Plugin System):**
```
https://your-project.vercel.app/api/render-v2
```

## Example Requests

### List All Renderers
```bash
curl "https://your-project.vercel.app/api/render-v2?list=true"
```

### Get Renderer Metadata
```bash
curl "https://your-project.vercel.app/api/render-v2?catalog=true"
```

### Render Markdown
```bash
curl "https://your-project.vercel.app/api/render-v2?type=markdown&content=%23%20Hello%20World"
```

### Render Code
```bash
curl "https://your-project.vercel.app/api/render-v2?type=code&language=python&content=print%28%22Hello%22%29"
```

## Testing Locally

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Test in browser or curl
curl "http://localhost:3000/api/render-v2?list=true"
```

## Deployment Checklist

- [ ] Node.js version updated to 24.x
- [ ] Dependencies installed (`npm install`)
- [ ] Local testing passed (`npm run dev`)
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Authenticated with Vercel (`vercel login`)
- [ ] Environment variables set (if any)
- [ ] Production deployment ready (`vercel --prod`)

## Environment Variables

Currently, no environment variables are required. The API works out of the box.

Optional future variables (in `vercel.json`):
- `MAX_CONTENT_LENGTH` - Max request size (default: 50000 bytes)
- `MAX_SVG_WIDTH` - Max SVG width (default: 1200px)
- `MAX_SVG_HEIGHT` - Max SVG height (default: 3000px)

## Performance

**Typical Response Times:**
- Markdown: 40-120ms
- Code: 30-100ms
- HTML: 50-150ms
- Charts: 50-100ms
- Diagrams: 20-80ms

**Caching:**
- Edge cache: 1 hour
- Browser cache: 1 hour
- Cache type: Immutable content

**Scaling:**
- Auto-scales with Vercel
- No cold start penalty
- Concurrent requests: Unlimited

## Monitoring

After deployment, monitor via Vercel Dashboard:

1. **Overview Tab**
   - Deployment status
   - Build time
   - Last deployment

2. **Analytics Tab**
   - Request count
   - Response times
   - Error rates

3. **Logs Tab**
   - Function logs
   - Error logs
   - Performance metrics

## Troubleshooting

### Build Fails

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Rebuild locally
npm run build

# Check for errors
npm run dev

# Fix any issues before deploying
```

### Deployment Timeout

**Problem:** Functions take >30 seconds

**Solution:**
- Reduce content size
- Increase `maxDuration` in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### Memory Issues

**Problem:** Out of memory errors

**Solution:**
- Increase memory in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 2048
    }
  }
}
```

### 404 Errors

**Problem:** Endpoints not found

**Solution:**
- Verify file exists: `api/render.ts` or `api/render-v2.ts`
- Check file names match exactly
- Rebuild and redeploy

## Rollback

If you need to revert to a previous deployment:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments**
4. Find the previous version
5. Click menu (...) → **Promote to Production**

## Domain Configuration

### Using Vercel Domain
```
https://your-project.vercel.app/api/render-v2
```

### Custom Domain
1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your domain
3. Update DNS records (follow Vercel instructions)
4. Use: `https://your-domain.com/api/render-v2`

## Cost

Vercel pricing:
- **Free tier:** 100 GB bandwidth/month, unlimited functions
- **Pro tier:** $20/month, 1 TB bandwidth
- **Enterprise:** Custom

Current API usage should fit comfortably in free tier.

## Support

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/functions/serverless-functions

**Project Documentation:**
- See [TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md)
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide

---

**Status:** Ready for deployment  
**Node.js:** 24.x  
**Runtime:** Serverless Functions  
**Endpoints:** 2 (v1 + v2)

Deploy with: `vercel --prod` 🚀
