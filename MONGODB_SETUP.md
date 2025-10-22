# Quick Setup: Local MongoDB for Prototype (No TLS)

## Option 1: Install MongoDB Community (Recommended for Prototype)

### Windows (PowerShell):
```powershell
# Install using Chocolatey
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
# After install, start MongoDB:
mongod --dbpath C:\data\db
```

### Alternative: Use MongoDB Docker
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Option 2: Use MongoDB Atlas with TLS Disabled Connection

If you want to keep using Atlas for prototype (not recommended for production):

1. In Atlas, create a database user with simple password (no special characters)
2. Whitelist your IP (or use 0.0.0.0/0 for testing ONLY)
3. Use connection string format without TLS:
   ```
   mongodb://username:password@cluster0-shard-00-00.am7ybpw.mongodb.net:27017,cluster0-shard-00-01.am7ybpw.mongodb.net:27017,cluster0-shard-00-02.am7ybpw.mongodb.net:27017/dimentia_dev?replicaSet=atlas-xxxxx-shard-0
   ```

## Current Setup (backend/.env)

For prototype, using local MongoDB (no TLS):
```
MONGO_URI=mongodb://localhost:27017/dimentia_dev
```

When deploying to production, switch to:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/...
MONGO_ENABLE_TLS=true
```

## Start the Backend

```powershell
cd C:\Users\wanna\Desktop\RPC2.0\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Should see:
```
⚠️  TLS DISABLED (prototype mode)
✅ Successfully connected to MongoDB
INFO: Uvicorn running on http://127.0.0.1:8000
```
