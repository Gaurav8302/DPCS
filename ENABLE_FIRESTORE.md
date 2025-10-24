# 🔥 Firebase Firestore Setup Guide

## ⚠️ CRITICAL: Enable Firestore API

The backend requires Firestore to be enabled in your Firebase project. Without this, you'll see errors like:

```
403 Cloud Firestore API has not been used in project dpcs-67de3 before or it is disabled
```

## 🎯 Quick Fix (2 Minutes)

### Option 1: Via Firebase Console (Recommended)

1. **Visit Firebase Console**:
   - Go to: https://console.firebase.google.com/project/dpcs-67de3/firestore

2. **Create Database**:
   - Click "Create Database"
   - Select "Start in **Production mode**" (or Test mode for development)
   - Choose a location (e.g., `us-central1`)
   - Click "Enable"

3. **Wait 1-2 minutes** for the API to propagate

4. **Test Your Backend**:
   - Restart your backend server
   - Visit: http://localhost:8000/health
   - You should see: `"database": "connected"`

### Option 2: Via gcloud CLI

If you have gcloud installed:

```bash
gcloud services enable firestore.googleapis.com --project=dpcs-67de3
```

## 📊 Verify Firestore is Enabled

### From Firebase Console

1. Go to: https://console.firebase.google.com/project/dpcs-67de3
2. Look for "Firestore Database" in the left sidebar
3. You should see your database (not a "Get Started" button)

### From Backend Health Check

```bash
# Start backend
cd backend
.\venv311\Scripts\Activate.ps1
python -m uvicorn main:app --reload

# Test health endpoint (in another terminal)
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "service": "dimentia-api",
  "database": "connected"  ← Should say "connected"
}
```

## 🗂️ Firestore Database Structure

Once enabled, the app will create these collections:

- **users** - User profiles and demographics
- **sessions** - Assessment sessions
- **results** - Test results and scores
- **audit_logs** - Activity tracking

## 🔐 Security Rules (Optional for Production)

For production, set up Firestore security rules:

1. Go to: https://console.firebase.google.com/project/dpcs-67de3/firestore/rules

2. Add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow backend service account full access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 Troubleshooting

### Error: "PERMISSION_DENIED"

**Cause**: Firestore API not enabled or service account lacks permissions

**Fix**:
1. Enable Firestore (see above)
2. Verify service account has "Cloud Datastore User" role
3. Go to: https://console.cloud.google.com/iam-admin/iam?project=dpcs-67de3
4. Find: `firebase-adminsdk-fbsvc@dpcs-67de3.iam.gserviceaccount.com`
5. Ensure it has "Cloud Datastore User" or "Owner" role

### Error: "SERVICE_DISABLED"

**Cause**: Firestore API explicitly disabled

**Fix**:
```bash
gcloud services enable firestore.googleapis.com --project=dpcs-67de3
```

Or use the Firebase Console method above.

### Backend Starts But Shows "firestore_api_not_enabled"

**Cause**: API not enabled yet

**Fix**: Follow "Option 1: Via Firebase Console" above

## ✅ Deployment Checklist

Before deploying to Render or Vercel:

- [ ] Firestore API enabled in Firebase Console
- [ ] Service account has proper permissions
- [ ] Environment variables set in Render:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY_ID`
  - `FIREBASE_CLIENT_ID`
  - `FIREBASE_CLIENT_CERT_URL`
- [ ] Test locally: `http://localhost:8000/health` shows "connected"

## 📞 Need Help?

If you're still having issues:

1. Check Firebase Console: https://console.firebase.google.com/project/dpcs-67de3
2. Verify all environment variables are set correctly
3. Check backend logs for specific error messages
4. Ensure your service account JSON file is valid

---

**Time to enable Firestore**: 2 minutes  
**After enabling**: Wait 1-2 minutes for changes to propagate
