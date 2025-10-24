# 🚀 Deployment Guide - Render & Vercel

Complete guide for deploying Dimentia Project v2.0 to production.

## 📋 Prerequisites

- ✅ Firestore API enabled (see `ENABLE_FIRESTORE.md`)
- ✅ GitHub account with repository
- ✅ Render.com account (free tier available)
- ✅ Vercel account (free tier available)

## 🔥 Step 1: Enable Firestore (CRITICAL!)

**⚠️ DO THIS FIRST** or deployment will fail!

1. Visit: https://console.firebase.google.com/project/dpcs-67de3/firestore
2. Click "Create Database"
3. Choose Production mode
4. Select location (e.g., `us-central1`)
5. Click "Enable"
6. **Wait 2 minutes** for API to activate

Verify:
```bash
# Test locally first
curl http://localhost:8000/health
# Should show: "database": "connected"
```

## 🎯 Step 2: Deploy Backend to Render.com

### 2.1 Push Code to GitHub

```powershell
cd c:\Users\wanna\Desktop\RPC2.0
git add .
git commit -m "Ready for deployment - Firebase configured, CORS fixed"
git push origin main
```

### 2.2 Create Web Service on Render

1. Go to: https://dashboard.render.com/

2. Click **"New +"** → **"Web Service"**

3. **Connect Repository**:
   - Connect your GitHub account
   - Select repository: `Gaurav8302/DPCS`

4. **Configure Service**:
   ```
   Name: dimentia-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

5. **Select Plan**:
   - Free tier is fine for testing
   - Paid tier for production (better performance)

### 2.3 Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

```bash
FIREBASE_PROJECT_ID=dpcs-67de3

FIREBASE_PRIVATE_KEY_ID=a057dbb24d21d0539b4e562b192c2072a658aec2

FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDp5ZqhBRo7uefq
C9hiqmnxYX4fs8fazdnLu6m2xO4KPNZ4wg0rY4GZXbJ06WupYxBpU7sTUSPHjSaU
UoXgB1MjbF1GoiRapVnYa3+vjzDVNLwM9qe1/xzNxfzPCAMBIXKEvXqo2qEPNspi
DN1XZoTUxl3xBcvA8iql2rdOdod+MtS/KAW4aLTnURNGi9A1XvA1UWAO0WxKPGur
RsRXlAJnfdkly4XfL/sP84cmywJoHl3pAmPzqj5DVg3LDfAdDwaAMoHHnG5aLLf2
D8BjYUkF845T3JJq51qORG0RtiiJZhpHuXZFlS6VaU5PoTxMBUFg0PvcXAPrmSjV
FuGt5lufAgMBAAECggEAAI9gi3tySdlS5cTJoqSPraruc+H7G+M7lcbNwt/G2CRu
b+W7DnwvAzCAUYk0sbg2OKJYMWeTsP+0mSh3bb35CKJS3W0TiexQJtVxWVQyqWEt
TdASPpfR3OiP9VaqpOOxHSavSSYUTMsZAfarNUy5wkWHnQ59tekQ0u9GETyH2dAB
LLvzNG6V6T6BfZ9n3ruUzENJXVbVshKWnFPHzK8jqm/EUVbDGEYDpUEBmIijvE92
okLrJS9fBnJ9kmFjHI7QRBpBH4FPoDDo9BLBiu0DwBRvMKp4ilc6HJG+hTSn6D8L
BcejJIgazytQZjGutWyyWEX1fMMlqQ1HoB9nM5tnXQKBgQD7KVnuijDv2JA2X9v3
Mbi75NgThUY041rXQ9r8I0DxoO6GQm4V/hKG52fKlajNqZVAUJM+gjFxY4tQkuWk
+0zMmm4clgZOLkfty0xR1yK7e7TGqnAtnPBBONjCQDUKR3CZ9d3zGjUuTsICMG7/
qlf7bVhLAtjVxUfdrq7k/EBG9QKBgQDuZxvpHRTV/4IGDpcKT3flGa/bTiRFL6cE
/GXdlfQciX7ULA+1RMwFJBp9HQrtoW4Oi/9SBNiWo0qIh1fZB4v7HLuFZYvkKLB3
7fJRWoMhXpj+fzZ09X8KwEYeBjwRt2DYlUvZliwO+iFNKESwg2s7R7AUdxCIIUnH
o4E1qCezwwKBgQDHr2vB3Hrl5i9aG8Kd+RkfweUNOBPGbtBFf7x2ZGz47vNVKTGv
KI6AVTDO/0fzI5X3SViYBRjcRsF3sSMFlYrMzScocRrYQ7GKXOzz0HDb0JG8tbt0
eGcH4/NqFXRWFNBwh+sLodWQWKuk4+8MM9m5m4jsMnpFE5F8rap9ghR0lQKBgHao
VUj6k4NLsACpxF16XjdmSJQD2aOh6yRdJ6pZV23YtYqO/6Z+PnmUlaaODQFnZqrQ
3VyKUu7vCUrY6k14JyDuFRt5Bl6iLesTQJdjUH8MYWPSF12xTvEf8AZDniRHPGmw
LVd4Gie+MVMA5udgEcAolygods76molGBSqarmAXAoGATkWqnJoQJsArwUF3Ih/O
UE6SrjMxOZaWBPx0LDQxDE2rMIcTIvPQ3Bfp7YdELyXNSqBOydFO/RbGKxTrbSTT
EEVO3O427Oyc1vYWpbh0i7T8BnJL9f+fJSdoiLmEvaQNuERqH6YHNcF8IiDV8Pdn
VRALnhk+Hfx0oHfjpr8CXWM=
-----END PRIVATE KEY-----"

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@dpcs-67de3.iam.gserviceaccount.com

FIREBASE_CLIENT_ID=108481572190979173386

FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dpcs-67de3.iam.gserviceaccount.com

ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://dimentia.vercel.app

API_VERSION=2.0.0
API_TITLE=Dimentia Project API
DEBUG=False
ENVIRONMENT=production
```

**⚠️ IMPORTANT**: 
- Copy the ENTIRE private key including BEGIN/END lines
- Keep the `\n` characters (don't convert to actual newlines)
- Wrap in double quotes

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build
3. Once deployed, note your backend URL: `https://dimentia-backend.onrender.com`
4. Test: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Environment

Edit `frontend/.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
NEXTAUTH_URL=https://your-vercel-url.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

Commit changes:
```powershell
git add frontend/.env.local
git commit -m "Update frontend for production"
git push origin main
```

### 3.2 Deploy to Vercel

1. Go to: https://vercel.com/new

2. **Import Repository**:
   - Connect GitHub
   - Select: `Gaurav8302/DPCS`

3. **Configure Project**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=https://dimentia-backend.onrender.com
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

   Generate secret:
   ```powershell
   # In PowerShell
   $bytes = New-Object byte[] 32
   [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   [Convert]::ToBase64String($bytes)
   ```

5. Click **"Deploy"**

### 3.3 Update CORS

After Vercel deploys, you'll get your frontend URL (e.g., `https://dimentia.vercel.app`)

**Update Render environment variables**:
1. Go to Render dashboard
2. Find your backend service
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://dimentia.vercel.app,https://your-custom-domain.com
   ```
4. Save and redeploy

## ✅ Step 4: Verify Deployment

### Backend Tests

```bash
# Health check
curl https://your-backend.onrender.com/health

# API docs
https://your-backend.onrender.com/docs
```

### Frontend Tests

1. Visit: https://your-app.vercel.app
2. Try creating a test user
3. Check browser console for errors (F12)
4. Verify API calls go to backend

### Full Integration Test

1. Open frontend
2. Create a user
3. Start an assessment session
4. Complete a test module
5. View results

## 🐛 Troubleshooting

### Backend Won't Start

**Check Render logs**:
1. Render Dashboard → Your Service → Logs
2. Look for errors

Common issues:
- ❌ Firestore API not enabled → See `ENABLE_FIRESTORE.md`
- ❌ Missing environment variables → Double-check all Firebase vars
- ❌ Wrong Python version → Should be Python 3.11+

### Frontend Can't Connect to Backend

**Check CORS**:
1. Browser console (F12) → Network tab
2. Look for CORS errors
3. Verify `ALLOWED_ORIGINS` in Render includes your Vercel URL

**Check environment variables**:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_BACKEND_URL` is correct
3. Redeploy if you change variables

### Database Errors

```json
{"database": "firestore_api_not_enabled"}
```

**Fix**: Enable Firestore (see Step 1)

### 500 Errors

Check Render logs for specific error messages.

## 🔒 Security Checklist

Before going live:

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Set `DEBUG=False` in backend
- [ ] Enable Firebase security rules
- [ ] Set up custom domain with SSL
- [ ] Review CORS allowed origins
- [ ] Enable Render auto-deploy on push (optional)

## 📊 Monitoring

### Render

- Dashboard shows: Uptime, CPU, Memory
- Logs: Real-time and historical
- Alerts: Set up email notifications

### Vercel

- Analytics: Page views, load times
- Logs: Edge function and build logs
- Performance: Core Web Vitals

## 💰 Costs

### Free Tier Limits

**Render**:
- ✅ 750 hours/month free compute
- ⚠️ Spins down after 15 min inactivity
- ⚠️ First request may be slow (cold start)

**Vercel**:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Always on (no cold starts)

### Upgrade Recommendations

For production:
- Render: $7/month (always on, better performance)
- Vercel: Free tier is usually sufficient

## 🚀 Post-Deployment

1. **Test thoroughly** with real users
2. **Monitor logs** for first few days
3. **Set up backups** for Firestore data
4. **Configure custom domain** (optional)
5. **Enable analytics** (Google Analytics, etc.)

---

## 📞 Quick Reference

**Backend URL**: https://your-backend.onrender.com  
**Frontend URL**: https://your-app.vercel.app  
**API Docs**: https://your-backend.onrender.com/docs  
**Firebase Console**: https://console.firebase.google.com/project/dpcs-67de3  

**Need help?** Check the logs first, then review this guide.

---

**Total deployment time**: 30-45 minutes (including Firestore setup)  
**After first deployment**: Push to GitHub auto-deploys both services
