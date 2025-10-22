# 🚀 Vercel Deployment - Quick Setup

## For Your Current Deployment Screen

### 1. Root Directory
Click **"Edit"** next to "frontend" and make sure it says:
```
frontend
```

### 2. Environment Variables
Click **"Environment Variables"** and add these THREE variables:

#### Variable 1: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://dpcs-y5hy45.vercel.app` (use your project name)
- **Environment**: Select all (Production, Preview, Development)

#### Variable 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate with this command:
  ```bash
  openssl rand -base64 32
  ```
  Or use this temporary one for now:
  ```
  MWRkZjg3YzYtNjU0ZC00YzIzLWE4YjQtOWJjMzI1ZGFiN2Nm
  ```
- **Environment**: Select all (Production, Preview, Development)

#### Variable 3: NEXT_PUBLIC_BACKEND_URL
- **Key**: `NEXT_PUBLIC_BACKEND_URL`
- **Value**: `https://dimentia-backend.onrender.com` (your Render URL)
- **Environment**: Select all (Production, Preview, Development)

### 3. Deploy
Click the **"Deploy"** button at the bottom.

## After First Deployment

1. Note your actual Vercel URL (e.g., `dpcs-abc123.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual URL
4. Click **"Redeploy"**

## Update Backend CORS

In your Render backend dashboard:
1. Go to **Environment** tab
2. Update `ALLOWED_ORIGINS` to:
   ```
   ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
   ```
3. Click **"Save Changes"**
4. Wait for auto-redeploy

## Common Issues

### "env.NEXTAUTH_URL should be string"
- Make sure NEXTAUTH_URL is added as environment variable
- Value should be a full URL: `https://your-app.vercel.app`
- Include `https://` prefix

### "NEXTAUTH_SECRET is required"
- Add NEXTAUTH_SECRET environment variable
- Use a random 32+ character string
- Generate with: `openssl rand -base64 32`

### Build fails
- Check Root Directory is set to `frontend`
- Verify all 3 environment variables are added
- Check build logs for specific errors

---

**Pro Tip**: You can always update environment variables later in Settings → Environment Variables, then redeploy.
