# 🚀 Quick Start - Localhost Development

## Start Development Servers

```powershell
# Option 1: Start everything at once
.\start-all.ps1

# Option 2: Start individually
.\start-backend.ps1   # Terminal 1
.\start-frontend.ps1  # Terminal 2
```

## Access Your Application

| What | Where | When to Use |
|------|-------|-------------|
| **Web App** | http://localhost:3000 | Main application interface |
| **API** | http://localhost:8000 | Direct API testing |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/health | Verify backend + Firebase status |

## Configuration Summary

✅ **Frontend** → Points to `http://localhost:8000` (local backend)  
✅ **Backend** → Runs on `http://localhost:8000`  
✅ **Firebase** → Connected to cloud (dpcs-67de3)  
✅ **CORS** → Allows localhost + production URLs  

## Key Files Modified

```
frontend/.env.local          → NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
backend/.env                 → ALLOWED_ORIGINS includes localhost
backend/main.py              → CORS allows localhost + production
```

## Verify Everything Works

1. **Start servers** → `.\start-all.ps1`
2. **Check backend** → http://localhost:8000/health should show `"database": "connected"`
3. **Open frontend** → http://localhost:3000
4. **Test app** → Create user, start assessment
5. **Check Firebase** → Data should appear in Firebase Console

## Switch to Production Backend (if needed)

```bash
# Edit frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=https://dpcs.onrender.com

# Restart frontend
# Ctrl+C, then: npm run dev
```

## Troubleshooting

**CORS Error?**  
→ Restart backend, clear browser cache

**Can't connect to backend?**  
→ Check http://localhost:8000/health is accessible

**Firebase not connected?**  
→ Verify backend/.env has all FIREBASE_* variables

---

**🎉 You're ready to code!** The project runs locally while using Firebase in the cloud.
