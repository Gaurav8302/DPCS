# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Session information missing" popup

**Symptoms:**
- Alert shows "Session information missing"
- Cannot progress to next test
- Console shows "Redirecting to consent"

**Root Cause:**
Session was not created during consent/registration

**Solution:**
1. Clear browser cache and sessionStorage:
   ```javascript
   // In browser console
   sessionStorage.clear()
   ```

2. Return to consent page: `http://localhost:3000/consent`

3. Fill out the form completely:
   - Name
   - Email
   - Age
   - Education years (number)
   - Check "I agree" checkbox

4. Click "Start Assessment"

5. Verify session in browser console:
   ```javascript
   console.log(sessionStorage.getItem('user_id'))
   console.log(sessionStorage.getItem('session_id'))
   // Should show two UUIDs
   ```

### Issue 2: "Failed to fetch" or "ERR_INTERNET_DISCONNECTED"

**Symptoms:**
- Network error in console
- API calls fail
- "Unable to connect to server" message

**Root Causes:**
- Backend server (Render) is sleeping (free tier)
- No internet connection
- CORS issue

**Solutions:**

**A. Wake up Render backend:**
1. Open in browser: https://dpcs.onrender.com
2. Wait 30-60 seconds for server to wake
3. Check endpoint: https://dpcs.onrender.com/docs
4. Should see FastAPI documentation

**B. Check internet connection:**
```powershell
# Test connectivity
ping dpcs.onrender.com
```

**C. Use local backend (development):**
1. Start backend locally:
   ```powershell
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. Update frontend/.env.local:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Restart frontend:
   ```powershell
   cd frontend
   npm run dev
   ```

### Issue 3: "Favicon 404 error"

**Symptom:**
```
Failed to load resource: the server responded with a status of 404 ()
/favicon.ico:1
```

**Solution:**
1. Add favicon to `frontend/public/favicon.ico`
2. Or add to `_document.tsx`:
   ```tsx
   <link rel="icon" href="/favicon.ico" />
   ```

**Workaround:**
- This error is cosmetic and doesn't affect functionality
- Can be safely ignored

### Issue 4: Tests starting individually instead of flowing

**Symptom:**
- Assessment page shows individual "Start Module" buttons
- Can start any test independently
- No sequential flow

**Solution:**
This is now the OLD behavior. The NEW flow is:

1. Assessment page (`/assessment`) shows overview + single "Start Assessment" button
2. Click "Start Assessment" → goes to first test (trail-making)
3. Each test auto-navigates to next test
4. Last test (orientation) → dashboard

If you see the old grid layout, clear browser cache:
```javascript
// In console
location.reload(true)
```

### Issue 5: Environment variable not loading

**Symptom:**
- `process.env.NEXT_PUBLIC_API_URL` is undefined
- API calls fail with "undefined" in URL

**Solution:**

1. Verify `.env.local` exists:
   ```
   frontend/.env.local
   ```

2. Check file content:
   ```
   NEXT_PUBLIC_API_URL=https://dpcs.onrender.com
   ```

3. Restart Next.js dev server:
   ```powershell
   # Stop server (Ctrl+C)
   npm run dev
   ```

**Note:** Environment variables are loaded at build time. Changes require restart.

### Issue 6: CORS errors

**Symptom:**
```
Access to fetch at 'https://dpcs.onrender.com/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Root Cause:**
Backend CORS configuration doesn't allow localhost

**Solution:**

1. Check `backend/main.py` has correct CORS:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Or specific origins
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. If using Vercel frontend, add Vercel domain to allow_origins

### Issue 7: Test data not saving

**Symptom:**
- Tests complete but no data in database
- Dashboard shows no results

**Possible Causes:**

1. **Backend not receiving requests:**
   - Check browser Network tab
   - Verify API calls are being made
   - Check response status codes

2. **Firebase/Firestore not configured:**
   - Verify `backend/dpcs-[...]-firebase-adminsdk-[...].json` exists
   - Check Firebase project settings
   - Verify Firestore database is active

3. **Session ID mismatch:**
   - User ID and Session ID must be consistent
   - Check what's stored in sessionStorage
   - Verify same IDs are sent in API requests

## Quick Diagnostics

Run this in browser console after completing consent:

```javascript
// Check session
console.log('User ID:', sessionStorage.getItem('user_id'))
console.log('Session ID:', sessionStorage.getItem('session_id'))

// Test API connection
fetch('https://dpcs.onrender.com/docs')
  .then(r => r.text())
  .then(html => console.log('Backend is UP'))
  .catch(e => console.error('Backend is DOWN:', e))

// Check current page
console.log('Current URL:', window.location.href)
```

Expected output:
```
User ID: 550e8400-e29b-41d4-a716-446655440000
Session ID: 550e8400-e29b-41d4-a716-446655440001
Backend is UP
Current URL: http://localhost:3000/tests/trail-making
```

## Development Workflow

### Fresh Start
```powershell
# 1. Clear everything
sessionStorage.clear()
rm -rf frontend/.next
rm -rf frontend/node_modules

# 2. Reinstall dependencies
cd frontend
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
start http://localhost:3000
```

### Testing Flow
1. Go to `/consent`
2. Fill form
3. Click "Start Assessment"
4. Should land on `/tests/trail-making`
5. Complete test
6. Should auto-navigate to `/tests/cube-copy`
7. Continue through all 12 tests
8. Should end at `/dashboard`

## Contact & Support

- GitHub: https://github.com/Gaurav8302/DPCS
- Backend: https://dpcs.onrender.com
- Issues: https://github.com/Gaurav8302/DPCS/issues

## Change Log

**Version 2.0 (Latest):**
- ✅ Fixed session management
- ✅ Fixed API integration
- ✅ Continuous test flow
- ✅ Graceful error handling
- ✅ All 12 tests functional

**Version 1.0:**
- ❌ Individual module starts
- ❌ Session key mismatch
- ❌ Wrong API endpoints
