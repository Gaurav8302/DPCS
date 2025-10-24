# Dimentia Project v2.0 - Complete Setup Guide

## 🚀 Overview

The Dimentia Project is an AI-powered cognitive assessment platform implementing the Montreal Cognitive Assessment (MoCA) digitally. This version uses **Firebase Firestore** as the database backend and supports local development with the Firestore emulator.

### Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, React Konva (drawing tasks)
- **Backend**: Python FastAPI, Firebase Firestore (firebase-admin SDK)
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)
- **Testing**: Pytest (Backend), Jest (Frontend optional)

### Scoring System (30 Points Total)

| Section | Points | Description |
|---------|--------|-------------|
| Trail Making | 1 | Connect alternating numbers and letters |
| Cube/Shape Copy | 3 | Draw 2D shapes + 3D cone (1 point each) |
| Clock Drawing | 3 | Draw clock face, numbers, hands |
| Naming | 3 | Identify 3 animals (fuzzy matching) |
| Attention | 5 | Forward/backward digit span + vigilance |
| Language | 4 | Sentence repetition + verbal fluency |
| Abstraction | 2 | Find similarities between word pairs |
| Delayed Recall | 4 | Remember words from earlier |
| Orientation | 5 | Date, month, year, day, city |

**Interpretation:**
- **26-30**: Normal
- **18-25**: Mild Cognitive Impairment
- **10-17**: Moderate Cognitive Impairment
- **<10**: Severe Cognitive Impairment

---

## 📋 Prerequisites

### Required Software

- **Node.js**: v18+ and npm
- **Python**: 3.11+ (backend tested with 3.11)
- **Git**: For version control
- **Firebase Project**: With Firestore enabled

### Optional (for local development)

- **Firebase CLI**: `npm install -g firebase-tools` (for local emulator)
- **Docker**: To run Firestore emulator in container (optional)

---

## 🔧 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### Step 2: Enable Firestore

1. In your Firebase project, navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** or **Test mode** (for development)
4. Select a region (closest to your users)

### Step 3: Generate Service Account Credentials

1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (e.g., `serviceAccountKey.json`)
4. **⚠️ IMPORTANT**: Never commit this file to version control!

### Step 4: Set Up Environment Variables

Extract the following from your service account JSON:

- `type`
- `project_id`
- `private_key_id`
- `private_key`
- `client_email`
- `client_id`
- `client_x509_cert_url`

---

## 🛠️ Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd backend
```

### 2. Create Virtual Environment

```powershell
python -m venv venv311
.\venv311\Scripts\Activate.ps1
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Optional: For local emulator (comment out for production)
# FIRESTORE_EMULATOR_HOST=localhost:8080
```

**Important Notes:**
- Replace `\n` in the private key with actual newlines or use `\\n` in the .env file
- Ensure the private key includes the full header and footer

### 5. Seed the Database (Optional)

```powershell
python scripts\seed_firestore.py
```

This creates test users and sessions for development.

### 6. Run Backend Server

```powershell
uvicorn main:app --reload --port 8000
```

**Access:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 💻 Frontend Setup

### 1. Navigate to Frontend Directory

```powershell
cd frontend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: Firebase Client SDK (if using Firebase Auth on frontend)
# NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 4. Run Frontend Development Server

```powershell
npm run dev
```

**Access:**
- Frontend: http://localhost:3000

---

## 🧪 Testing

### Backend Unit Tests

```powershell
cd backend
pip install -r tests/requirements.txt
pytest tests/ -v --cov=utils --cov=routers
```

### Test Coverage

```powershell
pytest tests/ --cov=utils --cov=routers --cov-report=html
```

View coverage report: `backend/htmlcov/index.html`

---

## 🔥 Firebase Emulator (Local Development)

### Option 1: Using Firebase CLI

#### Install Firebase Tools

```powershell
npm install -g firebase-tools
firebase login
```

#### Initialize Firebase in Project

```powershell
cd backend
firebase init firestore
```

Select your Firebase project and follow prompts.

#### Start Emulator

```powershell
firebase emulators:start --only firestore
```

**Default URL**: http://localhost:8080

#### Configure Backend to Use Emulator

In your `.env` file, add:

```env
FIRESTORE_EMULATOR_HOST=localhost:8080
```

### Option 2: Using Docker (Alternative)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  firestore-emulator:
    image: google/cloud-sdk:emulators
    command: gcloud emulators firestore start --host-port=0.0.0.0:8080
    ports:
      - "8080:8080"
    environment:
      - FIRESTORE_PROJECT_ID=demo-project
```

Run:

```powershell
docker-compose up -d
```

---

## 🚀 Running the Complete Application

### Using Provided Scripts (PowerShell)

#### Start Everything

```powershell
.\start-all.ps1
```

This script:
1. Activates Python virtual environment
2. Starts backend server (port 8000)
3. Starts frontend dev server (port 3000)

#### Start Backend Only

```powershell
.\start-backend.ps1
```

#### Start Frontend Only

```powershell
.\start-frontend.ps1
```

### Manual Start (Step-by-Step)

**Terminal 1 - Backend:**

```powershell
cd backend
.\venv311\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```powershell
cd frontend
npm run dev
```

**Terminal 3 - Firestore Emulator (Optional):**

```powershell
firebase emulators:start --only firestore
```

---

## 🔐 Security & Production Deployment

### Environment Variables

**Never commit:**
- `.env` files
- Service account JSON files
- API keys

**Add to `.gitignore`:**

```
# Environment variables
.env
.env.local
.env.production

# Firebase
*serviceAccountKey*.json
firebase-adminsdk-*.json
```

### Firestore Security Rules

Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Production rules - require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow admin access (for admin dashboard)
    match /sessions/{session} {
      allow read: if request.auth != null && 
                     (request.auth.token.admin == true || 
                      resource.data.user_id == request.auth.uid);
    }
    
    // Public health check
    match /_healthcheck/{document} {
      allow read: if true;
    }
  }
}
```

Deploy rules:

```powershell
firebase deploy --only firestore:rules
```

### Production Environment Variables

**Backend (Render/Railway):**

Set environment variables in your hosting platform dashboard:

```
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID
FIREBASE_CLIENT_CERT_URL
ALLOWED_ORIGINS
```

**Frontend (Vercel):**

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

---

## 📊 Admin Dashboard

### Access Admin Endpoints

**Get Dashboard Stats:**

```bash
GET /api/admin/dashboard/stats
```

**View All Sessions:**

```bash
GET /api/admin/sessions?requires_review=true&limit=50
```

**View Session Details:**

```bash
GET /api/admin/sessions/{session_id}/detailed
```

**Update Review Status:**

```bash
PUT /api/admin/sessions/{session_id}/review
Body: {"requires_review": false, "notes": "Reviewed and approved"}
```

### Frontend Admin Page (To Be Implemented)

Create `frontend/src/pages/admin.tsx` to consume these endpoints.

---

## 🐛 Troubleshooting

### Issue: "Firestore API not enabled"

**Solution:**

1. Visit Firebase Console: https://console.firebase.google.com/project/YOUR-PROJECT/firestore
2. Click "Create Database"
3. Or enable via CLI:

```bash
gcloud services enable firestore.googleapis.com --project=YOUR-PROJECT-ID
```

### Issue: "Private key parse error"

**Solution:**

Ensure the private key in `.env` has proper formatting:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

Use `\\n` for newlines in .env files.

### Issue: "CORS error" on frontend

**Solution:**

1. Check `ALLOWED_ORIGINS` in backend `.env`
2. Ensure frontend URL is included:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Issue: Tests failing

**Solution:**

1. Ensure virtual environment is activated
2. Install test dependencies:

```powershell
pip install -r tests/requirements.txt
```

3. Run tests with verbose output:

```powershell
pytest tests/ -v -s
```

---

## 📚 API Documentation

Full API documentation available at:

**Local:** http://localhost:8000/docs

**Sections:**

- **Users**: Create, retrieve, delete users
- **Sessions**: Manage test sessions
- **Scoring**: Score individual test sections
- **Verification**: Location and datetime verification
- **Results**: Get aggregated results with interpretation
- **Admin**: Admin dashboard endpoints

---

## 🎯 Development Workflow

1. **Start Services**: Run `.\start-all.ps1`
2. **Register User**: Navigate to http://localhost:3000/consent
3. **Complete Assessment**: Go through each test section
4. **View Results**: Check dashboard at http://localhost:3000/dashboard
5. **Admin Review**: Use admin endpoints to review sessions

---

## 📞 Support

For issues or questions:

1. Check this README
2. Review QA.md for validation checklist
3. Consult API documentation at `/docs`
4. Check Firebase Console for database status

---

## 📝 License

This project is proprietary. All rights reserved.

---

**Version**: 2.0.0  
**Last Updated**: December 2024  
**Database**: Firebase Firestore  
**Scoring**: 30-point MoCA scale
