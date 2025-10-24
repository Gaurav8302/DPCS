# 🚨 QUICK FIX - Frontend Can't Connect to Backend

## Problem
Frontend on Vercel is trying to connect to `localhost:8000` instead of production backend.

## Solution: Update Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Select Your Project
Click on your project: **dpcs-722m** (or whatever your project name is)

### Step 3: Go to Settings
Click on **Settings** tab

### Step 4: Environment Variables
Click on **Environment Variables** in the left sidebar

### Step 5: Add These Variables

**Add each of these** (click "Add Another" for each):

#### Variable 1:
```
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://dpcs.onrender.com
Environment: Production, Preview, Development (check all 3)
```

#### Variable 2:
```
Name: NEXTAUTH_URL
Value: https://dpcs-722m.vercel.app
Environment: Production
```

#### Variable 3:
```
Name: NEXTAUTH_SECRET
Value: (generate a random string - see below)
Environment: Production, Preview, Development
```

**To generate NEXTAUTH_SECRET** (run in PowerShell):
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Step 6: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** (...)
4. Click **Redeploy**
5. Check "Use existing Build Cache" (faster)
6. Click **Redeploy**

Wait 2-3 minutes for deployment to complete.

---

## Alternative: Quick Command Line Fix

If you have Vercel CLI installed:

```powershell
cd frontend
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter: https://dpcs.onrender.com

vercel env add NEXTAUTH_URL production  
# Enter: https://dpcs-722m.vercel.app

vercel env add NEXTAUTH_SECRET production
# Enter: your-generated-secret

vercel --prod
```

---

## Verify It Worked

After redeployment:

1. Visit: https://dpcs-722m.vercel.app
2. Open browser console (F12)
3. Go to /consent page
4. Try to submit form
5. Check Network tab - should POST to `https://dpcs.onrender.com/api/users`

---

## Update Backend CORS Too!

While you're at it, update backend CORS:

1. Go to: https://dashboard.render.com/
2. Select your backend service
3. Click **Environment** tab
4. Find `ALLOWED_ORIGINS`
5. Update to:
```
ALLOWED_ORIGINS=https://dpcs-722m.vercel.app,https://dpcs.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```
6. Click **Save**
7. Wait for auto-redeploy (1-2 minutes)

---

## Expected Result

After both changes:
- ✅ Frontend connects to production backend
- ✅ No CORS errors
- ✅ Can create users
- ✅ Data saves to Firestore

---

## Test It

```bash
# 1. Check backend is running
curl https://dpcs.onrender.com/health

# 2. Check frontend environment (in browser console)
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
# Should show: https://dpcs.onrender.com

# 3. Try creating a user from consent form
```

---

**Time to fix**: 5 minutes  
**After fix**: Wait 2-3 minutes for Vercel redeploy
