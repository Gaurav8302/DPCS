# ✅ Pre-Deployment Checklist

Quick checklist before sharing code or deploying to production.

## 🔒 Security & Credentials

- [ ] **Remove/Update Firebase credentials in `.env` files**
  - ⚠️ The current `.env` files contain REAL credentials
  - For sharing: Replace with placeholder values
  - For deployment: Use environment variables on hosting platform

- [ ] **Check `.gitignore` includes**:
  - [ ] `backend/.env`
  - [ ] `frontend/.env.local`
  - [ ] `backend/venv*` and `frontend/node_modules`
  - [ ] Firebase service account JSON files

- [ ] **Generate new `NEXTAUTH_SECRET` for production**:
  ```powershell
  # Generate secure secret
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  [Convert]::ToBase64String($bytes)
  ```

## 🔥 Firebase Setup

- [ ] **Enable Firestore API** (CRITICAL!)
  - Visit: https://console.firebase.google.com/project/dpcs-67de3/firestore
  - Click "Create Database"
  - Wait 2 minutes for activation
  - See: `ENABLE_FIRESTORE.md` for details

- [ ] **Verify Firebase permissions**:
  - Service account has "Cloud Datastore User" role
  - Check: https://console.cloud.google.com/iam-admin/iam?project=dpcs-67de3

- [ ] **Test Firebase connection locally**:
  ```powershell
  cd backend
  .\venv311\Scripts\Activate.ps1
  python -m uvicorn main:app --reload
  # Then visit: http://localhost:8000/health
  # Should show: "database": "connected"
  ```

## 🧪 Local Testing

- [ ] **Backend works locally**:
  - [ ] Server starts without errors
  - [ ] Health check returns "connected": http://localhost:8000/health
  - [ ] API docs accessible: http://localhost:8000/docs
  - [ ] No import errors

- [ ] **Frontend works locally**:
  - [ ] Runs without errors: `npm run dev`
  - [ ] No 404 errors for `/api/auth/*`
  - [ ] Can connect to backend
  - [ ] No console errors (F12)

- [ ] **Full integration test**:
  - [ ] Create a test user
  - [ ] Start a session
  - [ ] Complete a test module
  - [ ] View results

## 📦 Code Quality

- [ ] **No sensitive data in code**:
  - [ ] No hardcoded passwords
  - [ ] No API keys in source files
  - [ ] No personal information

- [ ] **Clean up temporary files**:
  ```powershell
  # Remove Python cache
  Get-ChildItem -Path . -Include __pycache__ -Recurse -Force | Remove-Item -Force -Recurse
  
  # Remove build artifacts (optional - will be rebuilt)
  Remove-Item -Path frontend\.next -Recurse -Force -ErrorAction SilentlyContinue
  ```

- [ ] **Updated documentation**:
  - [ ] README.md reflects current state
  - [ ] LOCAL_SETUP.md has correct instructions
  - [ ] All guides are up to date

## 🚀 Deployment Prep

- [ ] **Environment variables documented**:
  - [ ] All required variables listed in deployment guide
  - [ ] Example values provided (without real credentials)

- [ ] **Render configuration** (`backend/render.yaml`):
  - [ ] Build command correct
  - [ ] Start command correct
  - [ ] Environment variables placeholder

- [ ] **Vercel configuration** (`frontend/vercel.json`):
  - [ ] Routes configured
  - [ ] Environment variables set

- [ ] **Git repository ready**:
  ```powershell
  git status  # Check for uncommitted changes
  git add .
  git commit -m "Ready for deployment - All bugs fixed, docs updated"
  ```

## 📝 Sharing as ZIP

If sharing locally without Git:

- [ ] **Clean build artifacts**:
  ```powershell
  # Remove large folders (they'll be reinstalled)
  Remove-Item backend\venv311 -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item frontend\node_modules -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item frontend\.next -Recurse -Force -ErrorAction SilentlyContinue
  ```

- [ ] **Keep essential files**:
  - [ ] `.env` files (with real credentials for trusted recipients)
  - [ ] All `.ps1` setup scripts
  - [ ] `LOCAL_SETUP.md` guide
  - [ ] Firebase service account JSON

- [ ] **Include instructions**:
  - [ ] `README_LOCAL.md` in root
  - [ ] Instructions: "Run `.\setup-local.ps1` to get started"

## 🌐 Production Deployment

- [ ] **Firestore enabled** (see above)

- [ ] **Backend deployed to Render**:
  - [ ] Repository connected
  - [ ] Environment variables set (ALL Firebase vars)
  - [ ] Build successful
  - [ ] Health check returns 200: `/health`

- [ ] **Frontend deployed to Vercel**:
  - [ ] Repository connected
  - [ ] Environment variables set
  - [ ] Build successful
  - [ ] Site loads without errors

- [ ] **CORS configured**:
  - [ ] Backend `ALLOWED_ORIGINS` includes frontend URL
  - [ ] Test: Frontend can call backend APIs

- [ ] **Post-deployment verification**:
  - [ ] Create test user from production frontend
  - [ ] Complete a test session
  - [ ] Verify data saved in Firestore

## ✅ Final Checks

- [ ] **Documentation complete**:
  - [ ] `LOCAL_SETUP.md` - Local development
  - [ ] `ENABLE_FIRESTORE.md` - Firebase setup
  - [ ] `DEPLOYMENT_PRODUCTION.md` - Production deployment

- [ ] **All scripts work**:
  - [ ] `setup-local.ps1`
  - [ ] `start-backend.ps1`
  - [ ] `start-frontend.ps1`
  - [ ] `start-all.ps1`

- [ ] **Tested on fresh machine** (if possible):
  - [ ] Extract ZIP/clone repo
  - [ ] Run setup script
  - [ ] Verify everything works

---

## 🎯 Quick Actions

### For Local Sharing (ZIP)
```powershell
# Clean and prepare
Remove-Item backend\venv311 -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item frontend\node_modules -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path . -Include __pycache__ -Recurse -Force | Remove-Item -Force -Recurse

# Zip the entire folder
Compress-Archive -Path .\* -DestinationPath ..\Dimentia-Project-v2.zip
```

### For Git Push & Deploy
```powershell
# Commit all changes
git add .
git commit -m "Production ready - Firebase configured, bugs fixed"
git push origin main

# Then follow DEPLOYMENT_PRODUCTION.md
```

---

**Time to complete checklist**: 15-20 minutes  
**After first time**: 5 minutes for subsequent deployments
