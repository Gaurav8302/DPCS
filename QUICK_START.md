# 🚀 Quick Start Guide - Dimentia Project

Get up and running in 5 minutes!

## Prerequisites Check ✅

Open PowerShell and verify you have:

```powershell
# Check Python (need 3.11+)
python --version

# Check Node.js (need 18+)
node --version

# Check npm
npm --version

# Check pip
pip --version
```

If any are missing, install them first:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## Step 1: Get MongoDB Connection String 🗄️

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@...`)

---

## Step 2: Clone and Setup 📦

```powershell
# Navigate to your project
cd C:\Users\wanna\Desktop\RPC2.0

# Copy environment template
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

**In the .env file, update these key values:**

```env
# Replace with your MongoDB connection string
MONGO_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/..."

# Generate these with the commands below
NEXTAUTH_SECRET="[generate-this]"
ENCRYPTION_KEY="[generate-this]"
JWT_SECRET="[generate-this]"
```

**Generate secure keys:**

```powershell
# Generate NEXTAUTH_SECRET (run in PowerShell)
$bytes = New-Object Byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Copy the output and paste as NEXTAUTH_SECRET in .env
```

---

## Step 3: Use Quick Start Script ⚡

The easiest way to start:

```powershell
.\start.ps1
```

This script will:
1. ✅ Check prerequisites
2. ✅ Create Python virtual environment
3. ✅ Install all dependencies
4. ✅ Copy environment files
5. ✅ Start both backend and frontend servers

---

## Step 4: Verify Everything Works ✅

### Check Backend (API)

Open browser: http://localhost:8000/health

You should see:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "service": "dimentia-api"
}
```

### Check Frontend (Web App)

Open browser: http://localhost:3000

You should see the Dimentia landing page.

### Check API Documentation

Open: http://localhost:8000/docs

You'll see interactive API documentation where you can test endpoints.

---

## Step 5: Test with Sample Data 🧪

### Create a test user:

1. Go to http://localhost:8000/docs
2. Find `POST /api/users`
3. Click "Try it out"
4. Use this example data:

```json
{
  "email": "test@example.com",
  "name": "Test Patient",
  "education_years": 16
}
```

5. Click "Execute"
6. Copy the `_id` from the response

### Create a test session:

1. Find `POST /api/sessions`
2. Click "Try it out"
3. Enter:

```json
{
  "user_id": "PASTE-THE-ID-YOU-COPIED"
}
```

4. Click "Execute"
5. Copy the session `_id`

Now you have a user and session ready for testing!

---

## Common Issues & Solutions 🔧

### "Python not found"
```powershell
# Add Python to PATH, or use full path:
C:\Users\YourName\AppData\Local\Programs\Python\Python311\python.exe --version
```

### "MongoDB connection failed"
- Check your MONGO_URI in .env
- Verify your MongoDB Atlas IP whitelist includes your IP
- Try adding `0.0.0.0/0` to whitelist for testing

### "Module not found" errors
```powershell
# Backend
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### "Port already in use"
```powershell
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F

# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

## Manual Start (Alternative) 🔨

If the quick start script doesn't work:

### Terminal 1 - Backend:
```powershell
cd C:\Users\wanna\Desktop\RPC2.0\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item ..\.env .env
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend:
```powershell
cd C:\Users\wanna\Desktop\RPC2.0\frontend
npm install
Copy-Item ..\.env .env.local
npm run dev
```

---

## Next Steps 📚

Now that everything is running:

1. **Read the docs**:
   - API_DOCUMENTATION.md - All API endpoints
   - SETUP_GUIDE.md - Detailed setup instructions
   - DEVELOPMENT_ROADMAP.md - What's next

2. **Start building**:
   - Test modules are next priority
   - See DEVELOPMENT_ROADMAP.md Phase 3

3. **Test the API**:
   - Use http://localhost:8000/docs for interactive testing
   - Try all the scoring endpoints

4. **Explore the code**:
   - Backend: `backend/routers/` for API logic
   - Frontend: `frontend/src/pages/` for pages

---

## Development Workflow 💻

### Daily Start:
```powershell
# Terminal 1
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

# Terminal 2
cd frontend
npm run dev
```

### Making Changes:

**Backend changes** (auto-reload enabled):
- Edit files in `backend/`
- Server automatically restarts
- Test at http://localhost:8000/docs

**Frontend changes** (hot-reload enabled):
- Edit files in `frontend/src/`
- Browser automatically refreshes
- View at http://localhost:3000

### Stopping Servers:
- Press `Ctrl + C` in each terminal

---

## Useful Commands 📝

```powershell
# Backend
cd backend
.\venv\Scripts\Activate.ps1

# Run tests
pytest

# Check code
python -m pylint main.py

# Frontend
cd frontend

# Run tests
npm test

# Build for production
npm run build

# Check types
npm run type-check

# Format code
npm run format
```

---

## Project Structure Quick Reference 📁

```
RPC2.0/
├── backend/
│   ├── main.py              # Start here - main API app
│   ├── routers/             # All API endpoints
│   │   ├── users.py
│   │   ├── sessions.py
│   │   ├── scoring.py       # All 11 scoring endpoints
│   │   ├── verification.py
│   │   └── results.py
│   ├── database/            # MongoDB models
│   └── utils/               # Scoring algorithms
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Add new pages here
│   │   ├── components/      # Reusable components
│   │   ├── lib/api.ts       # API client
│   │   └── contexts/        # Global state
│   └── public/              # Static files
│
└── Documentation files
```

---

## Getting Help 🆘

### Check These First:
1. SETUP_GUIDE.md - Detailed setup
2. API_DOCUMENTATION.md - API reference
3. IMPLEMENTATION_SUMMARY.md - What's built
4. http://localhost:8000/docs - Live API docs

### Debug Mode:

**Backend verbose logging:**
```powershell
uvicorn main:app --reload --log-level debug
```

**Frontend with errors:**
```powershell
npm run dev -- --turbo
```

---

## Success Checklist ✅

- [ ] Python and Node.js installed
- [ ] MongoDB Atlas account created
- [ ] .env file configured
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Health check returns "healthy"
- [ ] Landing page loads
- [ ] API docs accessible
- [ ] Test user created successfully

---

## You're Ready! 🎉

Your Dimentia Project development environment is now set up and running!

**Next Actions:**
1. Start building test modules (see DEVELOPMENT_ROADMAP.md Phase 3)
2. Set up authentication (Phase 2)
3. Read through the codebase to understand the structure

**Happy Coding! 🚀**

---

**Need More Help?**
- Full Setup: SETUP_GUIDE.md
- API Reference: API_DOCUMENTATION.md
- Development Plan: DEVELOPMENT_ROADMAP.md
- Technical Details: IMPLEMENTATION_SUMMARY.md
