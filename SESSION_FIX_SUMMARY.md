# Session and API Fixes - Summary

## Issues Fixed

### 1. Session Management
**Problem:** Tests were looking for `userId` and `sessionId` but consent page was creating `user_id` and `session_id`

**Solution:**
- Updated consent.tsx to create session when user registers
- Fixed all test files to use correct key names: `user_id` and `session_id`
- Session is now created at registration and persists through all tests

### 2. API URL Configuration
**Problem:** Frontend was using wrong environment variables and API endpoints

**Solution:**
- Changed from `NEXT_PUBLIC_BACKEND_URL` to `NEXT_PUBLIC_API_URL`
- Added fallback URL: `https://dpcs.onrender.com`
- Fixed API endpoints: `/api/score/*` → `/scoring/*`
- Updated .env.local with correct backend URL

### 3. Assessment Flow
**Problem:** Each test was an individual module requiring separate start

**Solution:**
- Redesigned assessment.tsx as a single "Start Assessment" button
- Shows all 12 modules in overview
- Clicking "Start Assessment" begins sequential flow from test 1
- Each test auto-navigates to next test on completion
- Tests proceed even if API call fails (with warning)

### 4. Error Handling
**Problem:** Network errors would block test progression

**Solution:**
- Added try-catch blocks with graceful fallback
- Allow progression to next test even if submission fails
- Show user-friendly error messages
- Log errors to console for debugging

## Files Modified

### Frontend Files
1. `frontend/src/pages/consent.tsx`
   - Fixed API URL to use NEXT_PUBLIC_API_URL
   - Changed to create both user_id and session_id
   - Redirect to /tests/trail-making instead of /assessment

2. `frontend/src/pages/assessment.tsx`
   - Redesigned as landing page with single start button
   - Shows all 12 modules in order
   - Fixed session key names (user_id, session_id)

3. `frontend/src/pages/tests/*.tsx` (All 12 test files)
   - Fixed sessionStorage keys: userId → user_id, sessionId → session_id
   - Fixed API URLs: NEXT_PUBLIC_BACKEND_URL → NEXT_PUBLIC_API_URL
   - Fixed endpoints: /api/score/ → /scoring/
   - Added fallback URL: https://dpcs.onrender.com
   - Improved error handling with graceful progression

### Configuration Files
1. `frontend/.env.local`
   - Added NEXT_PUBLIC_API_URL=https://dpcs.onrender.com
   - Updated NEXT_PUBLIC_BACKEND_URL to match

2. `frontend/public/` (Created)
   - Created public directory for static assets
   - Fixes favicon 404 error

## Test Flow

### User Journey
1. **Landing Page** (`/`) → **Consent** (`/consent`)
2. User fills form, agrees to terms → **Creates session**
3. Redirected to **Trail Making Test** (`/tests/trail-making`)
4. Completes test → Auto-navigate to **Cube Copy** (`/tests/cube-copy`)
5. Continues through all 12 tests sequentially:
   - Trail Making → Cube Copy → Clock Drawing → Naming
   - Attention Forward → Attention Backward → Attention Vigilance
   - Sentence Repetition → Verbal Fluency → Abstraction
   - Delayed Recall → Orientation
6. Final test redirects to **Dashboard** (`/dashboard`)

### Session Data
```javascript
sessionStorage: {
  user_id: "generated-uuid",
  session_id: "generated-uuid"
}
```

## API Integration

### Backend Endpoints
All tests now correctly call:
```
POST https://dpcs.onrender.com/scoring/[test-name]
```

### Available Endpoints
- `/users` - Create user and session
- `/scoring/trail-making`
- `/scoring/cube-copy`
- `/scoring/clock-drawing`
- `/scoring/naming`
- `/scoring/attention-forward`
- `/scoring/attention-backward`
- `/scoring/attention-vigilance`
- `/scoring/sentence-repetition`
- `/scoring/verbal-fluency`
- `/scoring/abstraction`
- `/scoring/delayed-recall`
- `/scoring/orientation`

## Testing Checklist

- [x] Session created at consent
- [x] Session persists across all tests
- [x] API URLs point to correct backend
- [x] All 12 tests use correct session keys
- [x] Tests auto-navigate to next test
- [x] Graceful error handling
- [x] Favicon 404 fixed
- [ ] Test end-to-end flow in browser
- [ ] Verify backend API is accessible
- [ ] Test with network disconnection

## Next Steps

1. **Test the complete flow:**
   ```bash
   cd frontend
   npm run dev
   ```
   - Navigate to http://localhost:3000
   - Complete consent form
   - Run through all 12 tests

2. **Deploy to production:**
   - Backend already on Render: https://dpcs.onrender.com
   - Frontend to deploy on Vercel
   - Ensure environment variables are set

3. **Monitor for errors:**
   - Check browser console for any remaining issues
   - Verify API calls are successful
   - Test with different education levels

## Utilities Created

1. `fix-tests.ps1` - PowerShell script to batch update test files
2. `scripts/fix-test-files.js` - Node.js alternative (if needed)

Both scripts fix:
- Session storage keys
- API URLs
- Endpoint paths
