# Quick Render Deployment Guide

## Prerequisites
- GitHub repository with your code pushed
- Render account (https://render.com)
- MongoDB Atlas cluster configured

## Deploy Backend to Render

### Step 0: Configure Firebase (CRITICAL!)

**Before deploying, you MUST set up a Firebase service account:**

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project **dpcs-67de3**
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file (keep it secure!)
6. You'll need values from this file for Render environment variables

**The JSON file contains:**
- `project_id`
- `private_key_id`
- `private_key`
- `client_email`
- `client_id`
- `client_x509_cert_url`

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/dimentia-project.git
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `dimentia-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
PYTHON_VERSION=3.11.9
FIREBASE_PROJECT_ID=dpcs-67de3
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-from-json-file
FIREBASE_PRIVATE_KEY=your-private-key-from-json-file-keep-the-newlines
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dpcs-67de3.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id-from-json-file
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40dpcs-67de3.iam.gserviceaccount.com
SECRET_KEY=generate-random-32-char-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Important Firebase Notes:**
- Download service account JSON from Firebase Console
- Copy values from the JSON file to environment variables
- For `FIREBASE_PRIVATE_KEY`, copy the entire value including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters in the private key (don't replace them)

**Generate SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment (2-3 minutes).

Your backend will be live at: `https://dimentia-backend.onrender.com`

### Step 5: Verify

Test the health endpoint:
```bash
curl https://dimentia-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "service": "dimentia-api",
  "database": "connected"
}
```

## Deploy Frontend to Vercel

### Step 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 2: Environment Variables

Add these in Vercel:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-here
NEXT_PUBLIC_BACKEND_URL=https://dimentia-backend.onrender.com
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### Step 3: Deploy

Click **"Deploy"** and wait (2-3 minutes).

Your frontend will be live at: `https://your-app-name.vercel.app`

### Step 4: Update Backend CORS

Go back to Render and update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://your-app-name.vercel.app
```

Then click **"Manual Deploy"** → **"Deploy latest commit"**

## MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

## Verification Checklist

- [ ] Backend health check returns "connected" for database
- [ ] Frontend loads without errors
- [ ] API calls from frontend to backend work
- [ ] CORS headers allow frontend domain
- [ ] MongoDB operations work (create session, save results)
- [ ] HTTPS enabled on both services (automatic)

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify `PYTHON_VERSION=3.11.9` is set
- Ensure `requirements.txt` is in `backend/` directory

### MongoDB connection fails
- Verify `MONGO_ENABLE_TLS=true`
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify connection string has correct username/password

### Frontend can't reach backend
- Check `NEXT_PUBLIC_BACKEND_URL` points to Render URL
- Verify `ALLOWED_ORIGINS` in backend includes Vercel URL
- Check Render service is running

### CORS errors
- Update `ALLOWED_ORIGINS` in Render to include exact Vercel URL
- Redeploy backend after changing CORS settings

## Free Tier Notes

**Render Free Tier**:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

**Solution for production**: Upgrade to Render Starter ($7/month) for always-on service

## Production URLs

After deployment, update these in your documentation:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://dimentia-backend.onrender.com`
- **API Docs**: `https://dimentia-backend.onrender.com/docs`

## Next Steps

1. Test all 9 cognitive assessment modules
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up database backups in MongoDB Atlas
5. Enable Vercel analytics for performance monitoring
