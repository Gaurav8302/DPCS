# Firebase Migration Guide

## Complete Firebase Implementation

Due to MongoDB TLS errors on both Windows and Linux (Render), we're migrating to Firebase Firestore.

## Step 1: Clean Setup

### Delete Corrupted Files
```powershell
cd C:\Users\wanna\Desktop\RPC2.0
Remove-Item backend\database\connection.py -Force
Remove-Item backend\database\models.py -Force
```

### Create New connection.py

Create `backend/database/connection.py`:

```python
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore

db: Optional[firestore.Client] = None

async def connect_to_firebase() -> None:
    global db
    try:
        print("🔌 Connecting to Firebase...")
        cred_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID", "dpcs-67de3"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\\\n", "\\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL", ""),
        }
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        _ = db.collection("_healthcheck").limit(1).get()
        print("✅ Successfully connected to Firebase Firestore!")
    except Exception as e:
        print(f"❌ Failed to connect to Firebase: {str(e)[:200]}")
        print("💡 Check Firebase environment variables")
        raise

async def close_firebase_connection() -> None:
    global db
    if db:
        db = None
        print("✅ Firebase connection closed")

def get_firestore_client() -> firestore.Client:
    if db is None:
        raise RuntimeError("Firestore not initialized")
    return db

def get_collection(collection_name: str):
    return get_firestore_client().collection(collection_name)
```

### Create New models.py

Create `backend/database/models.py` - keep the same models, just update imports.

## Step 2: Update requirements.txt

Replace MongoDB packages:

```txt
fastapi==0.110.0
uvicorn[standard]==0.29.0
firebase-admin>=6.5.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
email-validator==2.1.1
python-dotenv==1.0.1
certifi>=2024.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
httpx>=0.27.0
fuzzywuzzy>=0.18.0
python-Levenshtein>=0.20.0
Pillow>=11.0.0
PyYAML>=6.0
numpy>=1.24.0
opencv-python-headless>=4.8.0
```

## Step 3: Update main.py

Change imports:
```python
from database.connection import connect_to_firebase, close_firebase_connection
```

Change lifespan:
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_firebase()
    yield
    await close_firebase_connection()
```

Change health check:
```python
@app.get("/health")
async def health_check():
    from database.connection import get_firestore_client
    try:
        db = get_firestore_client()
        _ = db.collection("_healthcheck").limit(1).get()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "version": "2.0.0",
        "service": "dimentia-api",
        "database": db_status
    }
```

## Step 4: Firebase Service Account Setup

1. Go to https://console.firebase.google.com
2. Select project **dpcs-67de3**
3. Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download JSON file
6. Extract these values for Render:
   - `project_id`
   - `private_key_id`
   - `private_key` (keep the \\n characters)
   - `client_email`
   - `client_id`
   - `client_x509_cert_url`

## Step 5: Update .env

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=dpcs-67de3
FIREBASE_PRIVATE_KEY_ID=paste-from-json
FIREBASE_PRIVATE_KEY=paste-from-json-with-newlines
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dpcs-67de3.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=paste-from-json
FIREBASE_CLIENT_CERT_URL=paste-from-json

# JWT Configuration (keep existing)
SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars-dimentia-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application Settings
DEBUG=True
ENVIRONMENT=development

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Step 6: Render Environment Variables

```
PYTHON_VERSION=3.11.9
FIREBASE_PROJECT_ID=dpcs-67de3
FIREBASE_PRIVATE_KEY_ID=<from-json>
FIREBASE_PRIVATE_KEY=<from-json-keep-backslash-n>
FIREBASE_CLIENT_EMAIL=<from-json>
FIREBASE_CLIENT_ID=<from-json>
FIREBASE_CLIENT_CERT_URL=<from-json>
SECRET_KEY=<generate-random>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-app.vercel.app
```

## Step 7: Test Locally

```powershell
cd backend
.\\venv311\\Scripts\\Activate.ps1
pip install firebase-admin
uvicorn main:app --reload
```

Visit: http://127.0.0.1:8000/health

Should see: `{"status": "healthy", "database": "connected"}`

## Step 8: Commit and Deploy

```powershell
git add .
git commit -m "Migrate from MongoDB to Firebase Firestore"
git push origin main
```

Render will auto-deploy with Firebase!

## Firestore Collections Structure

```
sessions/
  - {session_id}
    - candidate_name: string
    - started_at: timestamp
    - status: string
    
results/
  - {result_id}
    - session_id: string
    - test_name: string
    - score: number
    - timestamp: timestamp
```

## Benefits Over MongoDB

✅ No TLS/SSL configuration issues
✅ No IP whitelisting needed
✅ Better free tier (Spark plan)
✅ Real-time capabilities
✅ Automatic scaling
✅ Built-in authentication

## Note

Router files (sessions.py, scoring.py, etc.) still need Firebase query syntax updates, but basic connection will work!
