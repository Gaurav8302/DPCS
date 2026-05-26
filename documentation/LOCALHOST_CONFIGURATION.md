# 🏠 Localhost Configuration Guide

## ✅ Configuration Complete

Your project is now configured to run on **localhost** while maintaining **Firebase connections**. Both local development and production URLs are supported in the CORS configuration.

---

## 📝 Changes Made

### 1. Frontend Configuration (`frontend\.env.local`)

**Updated to use localhost backend:**
```bash
# Backend API URL - Localhost Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production

# Production URLs (kept for reference)
# NEXT_PUBLIC_API_URL=https://dpcs.onrender.com
# NEXT_PUBLIC_BACKEND_URL=https://dpcs.onrender.com
```

**What this does:**
- Frontend will connect to local backend at `http://localhost:8000`
- NextAuth will use localhost URL for authentication
- Production URLs are commented but preserved for easy switching

---

### 2. Backend CORS Configuration (`backend\main.py`)

**Updated to support both localhost AND production:**
```python
# CORS Configuration - Allow frontend origins (localhost + production)
default_local_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",      # Alternative frontend port
    "http://127.0.0.1:3001",
    "http://localhost:8000",      # Backend itself
    "http://127.0.0.1:8000",
    "https://dpcs-722m.vercel.app",  # Production Vercel deployment
    "https://dpcs.onrender.com",     # Production backend (for health checks)
]
```

**What this does:**
- Backend accepts requests from localhost (development)
- Backend ALSO accepts requests from production URLs (Vercel/Render)
- Supports both `localhost` and `127.0.0.1` addresses
- Includes alternative ports (3001) for flexibility

---

### 3. Backend Environment Variables (`backend\.env`)

**Updated ALLOWED_ORIGINS to include both local and production:**
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,https://dpcs-722m.vercel.app,https://dpcs.onrender.com
```

**What this does:**
- Explicitly allows all necessary origins
- Keeps production URLs so deployed backend still works
- Firebase configuration remains **UNTOUCHED**

---

## 🚀 How to Run Locally

### Option 1: Start Everything at Once
```powershell
.\start-all.ps1
```
This will start both backend and frontend in separate windows.

### Option 2: Start Individually

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\start-frontend.ps1
```

---

## 🌐 Access URLs

Once running, access your application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web application |
| **Backend API** | http://localhost:8000 | FastAPI backend |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Health Check** | http://localhost:8000/health | Backend health status |

---

## 🔥 Firebase Connection

**✅ Firebase connection is UNCHANGED and ACTIVE**

- All Firebase credentials remain in `backend\.env`
- Backend still connects to Firebase Firestore on startup
- Authentication, database operations work normally
- Only the frontend-to-backend connection is now localhost

---

## 🔄 Switching Between Localhost and Production

### To Use Localhost Backend (Current Configuration):
```bash
# In frontend\.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### To Use Production Backend:
```bash
# In frontend\.env.local
NEXT_PUBLIC_BACKEND_URL=https://dpcs.onrender.com
```

Then restart the frontend:
```powershell
# Ctrl+C to stop, then:
npm run dev
```

---

## 🛡️ CORS Security

The current configuration allows:
- ✅ All localhost variations (3000, 3001, 127.0.0.1)
- ✅ Production Vercel deployment (https://dpcs-722m.vercel.app)
- ✅ Production Render backend (https://dpcs.onrender.com)
- ✅ Vercel preview deployments (via regex pattern)

This dual configuration means:
- Development works on localhost
- Production deployments still work
- You can test production API from localhost if needed

---

## 📋 Verification Checklist

After starting the servers, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts and loads at http://localhost:3000
- [ ] Health check shows Firebase connected: http://localhost:8000/health
- [ ] Can create user account
- [ ] Can start assessment
- [ ] Data saves to Firebase (check Firebase Console)
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### CORS Error in Browser Console
**Problem:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
1. Check `backend\.env` has correct ALLOWED_ORIGINS
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)

### Frontend Can't Connect to Backend
**Problem:** Network errors when making API calls

**Solution:**
1. Verify backend is running: http://localhost:8000/health
2. Check `frontend\.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
3. Restart frontend: Ctrl+C, then `npm run dev`

### Firebase Connection Error
**Problem:** `database: "not_initialized"` in health check

**Solution:**
1. Verify `backend\.env` has all Firebase credentials
2. Check Firebase service account key is valid
3. Ensure Firebase Firestore API is enabled in Firebase Console

---

## 📚 Related Files

Files that were modified:
- `frontend\.env.local` - Frontend environment config
- `backend\.env` - Backend environment config
- `backend\main.py` - CORS configuration

Files unchanged (but important):
- `backend\database\connection.py` - Firebase connection logic
- `frontend\src\lib\api.ts` - API client (uses env variables)
- `start-all.ps1`, `start-backend.ps1`, `start-frontend.ps1` - Start scripts

---

## 💡 Key Points

1. **Firebase stays connected** - All Firebase operations work normally
2. **CORS supports both** - Local and production URLs allowed
3. **Easy to switch** - Just change NEXT_PUBLIC_BACKEND_URL
4. **No production impact** - Deployed apps continue working
5. **Windows PowerShell ready** - All scripts work on Windows

---

## 🎯 Next Steps

You're all set! To start development:

```powershell
# Start both servers
.\start-all.ps1

# Open browser to http://localhost:3000
# Start coding!
```

The project will run locally while using your Firebase database in the cloud. Perfect for development without losing data persistence!
