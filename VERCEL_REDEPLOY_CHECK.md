# ✅ Vercel Redeploy Checklist

## Current Status
- ✅ Environment variables set in Vercel dashboard
- ✅ Code pushed to GitHub (commit: 8852cb8)
- ⏳ Waiting for Vercel auto-redeploy

## Issue Diagnosis
The frontend code is **correctly** using:
```typescript
// frontend/src/pages/consent.tsx (line 27)
fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, ...)

// frontend/src/lib/api.ts (line 3)
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
```

**Problem**: Vercel is still serving the OLD build (before env vars were set)

## Solution: Force Redeploy

### Option 1: Manual Redeploy in Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to **Deployments** tab
4. Look for deployment with status "Ready" 
5. Click **three dots (...)** → **Redeploy**
6. ✅ Check "Use existing Build Cache"
7. Click **Redeploy**

### Option 2: Trigger New Deployment (We Just Did This!)
- ✅ Pushed commit 8852cb8 to main branch
- Vercel should auto-detect and redeploy
- Wait 2-3 minutes

### Option 3: Delete .vercel Cache and Redeploy
If the above doesn't work, clear Vercel's build cache:
1. Vercel Dashboard → Your Project
2. Settings → General
3. Scroll down to "Build & Development Settings"
4. Click "Clear Build Cache"
5. Go to Deployments → Redeploy latest

## How to Check if Redeploy Worked

### Check 1: Deployment Time
In Vercel Deployments tab, check if there's a new deployment AFTER you set the env vars (should be within last 5 minutes)

### Check 2: Browser Console Test
```javascript
// Open your deployed site: https://dpcs-722m.vercel.app
// Open Console (F12)
// Run this:
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

// Expected output:
// ✅ "https://dpcs.onrender.com"
// ❌ "http://localhost:8000" or undefined = NOT redeployed yet
```

### Check 3: Hard Refresh Browser
Even after redeploy, your browser might cache the old files:
- **Windows**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- **Nuclear option**: Clear browser cache completely

### Check 4: Network Tab
1. Open site: https://dpcs-722m.vercel.app/consent
2. Open DevTools (F12) → Network tab
3. Fill out form and submit
4. Look for POST request
5. URL should be: ✅ `https://dpcs.onrender.com/api/users`
6. NOT: ❌ `http://localhost:8000/api/users`

## Vercel Deployment Logs
To see what's happening:
1. Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Click "Building" or "Deployment" section
4. Check logs for:
   ```
   Environment Variables
   NEXT_PUBLIC_BACKEND_URL = https://dpcs.onrender.com
   NEXTAUTH_URL = https://dpcs-722m.vercel.app
   NEXTAUTH_SECRET = ***
   ```

## If Still Not Working

### Debug Environment Variables in Build
Add this to your `next.config.js`:

```javascript
module.exports = {
  // ...existing config
  
  // This will print env vars during build
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev) {
      console.log('🔍 NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
    }
    return config
  }
}
```

Then redeploy and check build logs.

## Expected Timeline
- ✅ Env vars set: Done (2 days ago)
- ✅ Code pushed: Done (just now - 8852cb8)
- ⏳ Vercel detects push: ~30 seconds
- ⏳ Build starts: ~1 minute
- ⏳ Build completes: ~2-3 minutes
- ⏳ Deployment: ~30 seconds
- ✅ Live with new env vars: **~3-5 minutes total**

## Current Time Check
Check your Vercel dashboard NOW to see if there's a new deployment in progress!

**Last Git Push**: Just now (8852cb8)
**Expected Deployment**: Should be building now or just finished

---

## Nuclear Option: Clear Everything
If nothing works:
1. Vercel Dashboard → Settings → General
2. Scroll to bottom → **Delete Project**
3. Reconnect GitHub repo
4. Re-add environment variables
5. Deploy fresh
