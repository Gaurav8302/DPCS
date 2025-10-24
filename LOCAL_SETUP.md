# 🚀 Local Development Setup Guide

This guide will help you set up and run the Dimentia Project v2.0 on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** (optional) - For version control

## 🎯 Quick Start (3 Easy Steps)

### Step 1: Run Setup Script

Open PowerShell in the project root directory and run:

```powershell
.\setup-local.ps1
```

This script will:
- ✅ Check if Python and Node.js are installed
- ✅ Create Python virtual environment
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies
- ✅ Verify configuration files exist

**⏱️ This may take 5-10 minutes depending on your internet speed**

### Step 2: Start the Servers

You have two options:

**Option A: Start both servers together (Recommended)**
```powershell
.\start-all.ps1
```

**Option B: Start servers separately**

In one terminal:
```powershell
.\start-backend.ps1
```

In another terminal:
```powershell
.\start-frontend.ps1
```

### Step 3: Access the Application

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📖 **API Documentation**: http://localhost:8000/docs
- ❤️ **Health Check**: http://localhost:8000/health

## 📁 Project Structure

```
RPC2.0/
├── backend/
│   ├── .env                    # Backend configuration (Firebase credentials)
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── venv311/                # Python virtual environment
│   ├── database/               # Database connection & models
│   ├── routers/                # API endpoints
│   └── utils/                  # Utility functions
├── frontend/
│   ├── .env.local              # Frontend configuration
│   ├── package.json            # Node.js dependencies
│   ├── node_modules/           # Node.js packages
│   └── src/
│       ├── components/         # React components
│       ├── pages/              # Next.js pages
│       └── lib/                # API client & utilities
├── setup-local.ps1             # Setup script
├── start-backend.ps1           # Start backend server
├── start-frontend.ps1          # Start frontend server
└── start-all.ps1               # Start both servers
```

## ⚙️ Configuration Files

### Backend Configuration (`backend/.env`)

Already configured with Firebase credentials. Key settings:

```bash
# Firebase Configuration (Already set up)
FIREBASE_PROJECT_ID=dpcs-67de3
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# CORS Settings (Allows local frontend)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Environment
DEBUG=True
ENVIRONMENT=development
```

### Frontend Configuration (`frontend/.env.local`)

Points to local backend:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-dev-secret-please-change-in-production
```

## 🔧 Manual Setup (If Scripts Don't Work)

### Backend Setup

1. Navigate to backend directory:
   ```powershell
   cd backend
   ```

2. Create virtual environment:
   ```powershell
   python -m venv venv311
   ```

3. Activate virtual environment:
   ```powershell
   .\venv311\Scripts\Activate.ps1
   ```

4. Install dependencies:
   ```powershell
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. Verify .env file exists and has Firebase credentials

6. Start server:
   ```powershell
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Verify .env.local file exists

4. Start development server:
   ```powershell
   npm run dev
   ```

## 🐛 Troubleshooting

### Backend Issues

**Issue: "Import firebase_admin could not be resolved"**
- **Solution**: Virtual environment not activated. Run `.\venv311\Scripts\Activate.ps1` in backend directory

**Issue: "Firebase connection failed"**
- **Solution**: Check that `.env` file exists and contains all Firebase credentials
- Verify the `FIREBASE_PRIVATE_KEY` includes newlines as `\n`

**Issue: "Port 8000 already in use"**
- **Solution**: Another process is using port 8000. Either:
  - Stop the other process
  - Or change port in `start-backend.ps1`: `--port 8001`

**Issue: "Module not found" errors**
- **Solution**: Reinstall dependencies:
  ```powershell
  cd backend
  .\venv311\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```

### Frontend Issues

**Issue: "Cannot connect to backend"**
- **Solution**: 
  1. Verify backend is running at http://localhost:8000
  2. Check `frontend/.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
  3. Clear browser cache and reload

**Issue: "Port 3000 already in use"**
- **Solution**: 
  - Stop any other Next.js apps running
  - Or start on different port: `npm run dev -- -p 3001`

**Issue: "npm install fails"**
- **Solution**: 
  ```powershell
  # Clear cache and reinstall
  rm -r node_modules
  rm package-lock.json
  npm cache clean --force
  npm install
  ```

**Issue: "Module not found" in browser**
- **Solution**: 
  ```powershell
  # Rebuild Next.js
  rm -r .next
  npm run dev
  ```

### CORS Issues

**Issue: "CORS policy blocked"**
- **Solution**: This should be fixed! The backend now allows:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://localhost:8000`
  - Plus any origins in `.env` `ALLOWED_ORIGINS`

If still blocked:
1. Check backend logs for CORS errors
2. Verify backend `.env` has correct `ALLOWED_ORIGINS`
3. Try accessing frontend via `http://localhost:3000` (not `127.0.0.1`)

## 🧪 Testing the Setup

### Test Backend

1. Open browser to http://localhost:8000/health
2. You should see:
   ```json
   {
     "status": "healthy",
     "version": "2.0.0",
     "service": "dimentia-api",
     "database": "connected"
   }
   ```

3. Visit http://localhost:8000/docs to see interactive API documentation

### Test Frontend

1. Open browser to http://localhost:3000
2. You should see the Dimentia Project homepage
3. Check browser console (F12) for any errors

### Test Full Integration

1. Try creating a test user from the frontend
2. Check backend logs for API requests
3. Verify data is saved in Firebase Firestore

## 📦 Creating a Zip File for Sharing

To share this project with others:

1. **Clean up temporary files**:
   ```powershell
   # Remove backend cache
   rm -r backend\__pycache__
   rm -r backend\database\__pycache__
   rm -r backend\routers\__pycache__
   rm -r backend\utils\__pycache__
   
   # Remove frontend build files
   rm -r frontend\.next
   ```

2. **Keep these critical files**:
   - ✅ `backend/.env` (with Firebase credentials)
   - ✅ `frontend/.env.local`
   - ✅ All `.ps1` scripts
   - ✅ This `LOCAL_SETUP.md` guide

3. **Optional: Remove large folders** (they'll be reinstalled):
   - `backend/venv311/` (will be recreated by setup script)
   - `frontend/node_modules/` (will be recreated by setup script)

4. **Zip the entire RPC2.0 folder**

5. **Share with instructions**: 
   "Extract the zip file, open PowerShell in the extracted folder, and run `.\setup-local.ps1`"

## 🔒 Security Notes for Local Development

- ✅ Firebase credentials are included for local development
- ⚠️ **DO NOT** share this code publicly with the Firebase credentials
- ⚠️ The `.env` file contains sensitive credentials
- ✅ For production deployment, use environment variables (not committed files)

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review backend logs in the terminal
3. Check browser console for frontend errors (F12)
4. Verify all configuration files exist and are correct

## ✨ Next Steps

Once everything is running:

1. Explore the API documentation at http://localhost:8000/docs
2. Test the cognitive assessment modules
3. Review the codebase:
   - Backend routes in `backend/routers/`
   - Frontend pages in `frontend/src/pages/`
   - API client in `frontend/src/lib/api.ts`

## 🎯 Development Workflow

1. **Make changes** to code files
2. **Backend**: Server auto-reloads (hot reload enabled)
3. **Frontend**: Next.js auto-reloads in browser
4. **Test changes** immediately
5. **Commit to Git** (optional)

---

**Ready to start developing!** 🚀

Run `.\setup-local.ps1` to begin!
