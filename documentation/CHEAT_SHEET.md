# 📋 Dimentia Project - Quick Reference Cheat Sheet

## 🚀 Quick Commands

### Start Everything
```powershell
# Windows Quick Start (opens 2 terminals)
.\start.ps1

# Manual Start
# Terminal 1 - Backend
cd backend; .\venv\Scripts\activate; uvicorn main:app --reload

# Terminal 2 - Frontend  
cd frontend; npm run dev
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

---

## 📁 Key File Locations

### Configuration
```
.env                    # Environment variables (don't commit!)
backend/.env           # Backend copy (auto-created)
frontend/.env.local    # Frontend copy (auto-created)
```

### Backend
```
backend/main.py                # API entry point
backend/routers/scoring.py     # All 11 scoring endpoints
backend/utils/scoring.py       # Scoring algorithms
backend/database/models.py     # Data schemas
```

### Frontend
```
frontend/src/pages/_app.tsx          # App wrapper
frontend/src/pages/index.tsx         # Landing page
frontend/src/lib/api.ts              # API client
frontend/src/contexts/ProgressContext.tsx  # Global state
```

---

## 🔧 Common Tasks

### Install Dependencies
```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Generate Secrets
```powershell
# PowerShell
$bytes = New-Object Byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Database Reset (Development Only!)
```powershell
# Connect to MongoDB Atlas web interface
# Database Access → Browse Collections
# Select database → Drop Collection
```

---

## 🎯 Test Module Checklist

For each new test module:

- [ ] Create page in `frontend/src/pages/test/`
- [ ] Import and use ProgressBar component
- [ ] Get sessionId and userId from ProgressContext
- [ ] Build test-specific UI
- [ ] Submit to appropriate `/api/score/*` endpoint
- [ ] Call `markSectionComplete(section, score)`
- [ ] Navigate to next test
- [ ] Test on mobile
- [ ] Add to navigation flow

---

## 📊 Scoring System Quick Reference

| Section | Max | Endpoint |
|---------|-----|----------|
| Trail Making | 1 | `/api/score/trail-making` |
| Cube/2D Copy | 3 | `/api/score/cube-copy` |
| Clock Drawing | 3 | `/api/score/clock-drawing` |
| Naming | 3 | `/api/score/naming` |
| Attention Forward | 1 | `/api/score/attention/forward` |
| Attention Backward | 1 | `/api/score/attention/backward` |
| Attention Vigilance | 3 | `/api/score/attention/vigilance` |
| Sentence Repetition | 2 | `/api/score/language/sentence-repetition` |
| Verbal Fluency | 2 | `/api/score/language/verbal-fluency` |
| Abstraction | 2 | `/api/score/abstraction` |
| Delayed Recall | 4 | `/api/score/delayed-recall` |
| Orientation | 5 | `/api/verify/datetime` + `/api/verify/location` |
| **Total** | **30** | |

**Education Adjustment:** +1 if not college level (capped at 30)

**Interpretation:**
- 26-30: Normal
- 18-25: Mild
- 10-17: Moderate
- <10: Severe

---

## 🔐 Environment Variables Template

```env
# MongoDB
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/..."
MONGO_DB_NAME="dimentia_project"

# Auth
NEXTAUTH_SECRET="[32+ chars random string]"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="[32+ chars random string]"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24

# URLs
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"

# Security
ENCRYPTION_KEY="[32-byte hex string]"
```

---

## 🐛 Debugging Quick Fixes

### "MongoDB connection failed"
```powershell
# Check connection string
cat .env | Select-String MONGO_URI

# Test connection
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('MONGO_URI'))"
```

### "Module not found"
```powershell
# Backend
cd backend
.\venv\Scripts\activate
pip install --force-reinstall -r requirements.txt

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### "Port already in use"
```powershell
# Kill port 8000
$proc = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($proc) { Stop-Process -Id $proc.OwningProcess -Force }

# Kill port 3000
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($proc) { Stop-Process -Id $proc.OwningProcess -Force }
```

### "Import errors in VS Code"
```powershell
# Select Python interpreter
# Ctrl+Shift+P → "Python: Select Interpreter"
# Choose: .\backend\venv\Scripts\python.exe
```

---

## 📦 NPM Scripts (Frontend)

```powershell
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

---

## 🎨 Tailwind Utility Classes

```css
/* Buttons */
btn-primary    /* Blue primary button */
btn-secondary  /* Gray secondary button */
btn-danger     /* Red danger button */

/* Layout */
card           /* White card with shadow */
container      /* Max-width container */

/* Form */
input-field    /* Styled input field */

/* Progress */
progress-step           /* Circle step indicator */
progress-step-active    /* Current step */
progress-step-completed /* Completed step */
```

---

## 🔄 Git Workflow

```powershell
# Daily workflow
git status
git add .
git commit -m "feat: implement naming test module"
git push origin main

# Create feature branch
git checkout -b feature/trail-making-test
# ... work on feature ...
git add .
git commit -m "feat: add trail making test UI"
git push origin feature/trail-making-test
```

---

## 📱 Test on Mobile

```powershell
# Find your local IP
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.10)

# Update .env
NEXTAUTH_URL="http://192.168.1.10:3000"
NEXT_PUBLIC_BACKEND_URL="http://192.168.1.10:8000"

# Restart servers
# Access from phone: http://192.168.1.10:3000
```

---

## 🎯 Testing Checklist

### Before Committing
- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] New feature works as expected
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API calls successful
- [ ] Data persists correctly

### Before Pushing
- [ ] All tests pass
- [ ] No sensitive data in code
- [ ] .env not committed
- [ ] Documentation updated
- [ ] Commit message descriptive

---

## 🔗 Quick Links

- [Next Steps](WHATS_NEXT.md) - What to build next
- [API Docs](API_DOCUMENTATION.md) - All endpoints
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup
- [Roadmap](DEVELOPMENT_ROADMAP.md) - Future plans
- [Architecture](ARCHITECTURE.md) - System design

---

## 💡 Pro Tips

1. **Backend First**: Always test API endpoints before building UI
2. **Console Logs**: Add them everywhere during development
3. **Component Reuse**: Build reusable components early
4. **State Management**: Use ProgressContext for global state
5. **Error Handling**: Always catch errors and show user feedback
6. **Save Often**: Commit working features immediately
7. **Test Mobile**: Test on actual device, not just browser resize
8. **Read Errors**: Error messages usually tell you exactly what's wrong

---

## 🆘 Emergency Fixes

### "Everything is broken"
```powershell
# Nuclear option - fresh start
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

cd ..\frontend
Remove-Item -Recurse -Force node_modules, .next
npm install

# Restart both servers
```

### "Database is corrupted"
```powershell
# MongoDB Atlas → Browse Collections
# Delete problematic documents manually
# Or drop and recreate collections
```

### "Can't connect to MongoDB"
```powershell
# 1. Check MongoDB Atlas is not paused
# 2. Check IP whitelist (add 0.0.0.0/0 for testing)
# 3. Check username/password in MONGO_URI
# 4. Try connection string in MongoDB Compass app
```

---

## 📝 Code Snippets

### Create API Call (Frontend)
```typescript
import { api } from '@/lib/api'

const result = await api.post('/api/score/naming', {
  session_id: sessionId,
  user_id: userId,
  responses: [/* ... */]
})
```

### Get User Context
```typescript
import { useProgress } from '@/contexts/ProgressContext'

const { sessionId, userId, markSectionComplete } = useProgress()
```

### Protected API Route (Backend)
```python
from fastapi import Depends, HTTPException
from database import get_collection

@router.get("/protected")
async def protected_route():
    # Add auth check here
    return {"message": "Access granted"}
```

---

## 🎓 Education Level Logic

```typescript
// Automatically calculated from education_years
0 years       → not_educated
1-12 years    → basic_schooling
13+ years     → college_level

// Used for scoring adjustment
if (education_level !== 'college_level') {
  total_score = Math.min(total_score + 1, 30)
}
```

---

**Print this page and keep it handy! 📄**

**Last Updated**: October 22, 2025
