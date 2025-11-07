# Fix for 404 Error on Trail Making Test

## Problem
Frontend shows: `Failed to load resource: the server responded with a status of 404 (Not Found)`
URL shows as `:8000/api/score/trail-making` (missing hostname)

## Root Cause
The frontend was started BEFORE the `.env.local` file was updated with `NEXT_PUBLIC_API_URL=http://localhost:8000`.

Next.js caches environment variables at startup, so changes to `.env.local` require a restart.

## Solution

### Step 1: Stop the Frontend
In the terminal running the frontend, press `Ctrl+C` to stop the server.

### Step 2: Restart the Frontend
```powershell
cd C:\Users\wanna\Desktop\RPC2.0
.\start-frontend.ps1
```

OR if you want to start both servers fresh:
```powershell
.\start-all.ps1
```

### Step 3: Verify
1. Open http://localhost:3000
2. Navigate to the trail-making test
3. The API calls should now go to `http://localhost:8000/api/score/trail-making` (with full URL)

## Why This Happens
- Next.js reads `process.env.NEXT_PUBLIC_*` variables at build/start time
- They are embedded into the JavaScript bundle
- Changing `.env.local` doesn't affect already-running processes
- You must restart the dev server to pick up new environment variables

## Quick Check
To verify the environment variable is loaded, open browser console and run:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```
You should see: `http://localhost:8000`

If you see `undefined` or the old URL, restart the frontend server.
