# 🚀 Quick Start - Testing Updated Modules

## Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase project configured

## 🎯 Start Backend

```powershell
cd backend

# Activate virtual environment (if not already active)
.\venv311\Scripts\Activate.ps1

# Install/update dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

Backend will run at: http://localhost:8000
API docs at: http://localhost:8000/docs

## 🎨 Start Frontend

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Start Next.js dev server
npm run dev
```

Frontend will run at: http://localhost:3000

## 🧪 Testing Updated Modules

### Test Order (recommended):

1. **Memory Learning Phase** → `/tests/memory-learning`
   - ✅ Verify 30-second timer works
   - ✅ Check all 5 words display clearly
   - ✅ Confirm words stored in sessionStorage

2. **Trail Making Test** → `/tests/trail-making`
   - ✅ Try connecting number→number (should show warning)
   - ✅ Try connecting letter→letter (should show warning)
   - ✅ Complete correctly (no warnings)
   - ✅ Check error count displayed

3. **Naming Test** → `/tests/naming`
   - ✅ Verify all animal images load
   - ✅ Test fuzzy matching (e.g., "lyon" for "lion")
   - ✅ Check similarity scores in result alert

4. **Forward Digit Span** → `/tests/attention-forward`
   - ✅ Read instruction screen
   - ✅ Watch 3-2-1 countdown
   - ✅ Observe 2-second intervals between digits
   - ✅ Enter sequence after all digits shown

5. **Vigilance Test** → `/tests/attention-vigilance`
   - ✅ Confirm letters display for 3 seconds each
   - ✅ Tap when seeing "A"
   - ✅ Verify tap detection works

6. **Abstraction Test** → `/tests/abstraction`
   - ✅ Select multiple-choice options
   - ✅ Try submitting with incomplete answers (should be disabled)
   - ✅ Submit complete answers

7. **Delayed Recall** → `/tests/delayed-recall`
   - ✅ Verify redirects if learning phase not completed
   - ✅ Check hint references learning phase
   - ✅ Test fuzzy matching (e.g., "fase" for "FACE")

8. **Orientation Test** → `/tests/orientation`
   - ✅ Confirm fields are NOT pre-filled
   - ✅ Manually enter date, month, year, day, city
   - ✅ Submit and check verification results

## 🔍 Verification Checklist

### Backend Logs
Watch terminal for:
```
INFO:     POST /api/score/trail-making
INFO:     POST /api/score/naming
...
```

### Frontend Console
Check browser console for:
- No React errors
- Successful API calls
- SessionStorage operations

### Firebase
Verify data stored in Firestore:
- `sessions/{session_id}/results/{test_name}`
- Check for new fields: `connection_errors`, `verification`, etc.

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend won't start
```powershell
# Clear node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### CORS errors
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend/.env.local

### Images not loading
- Verify files exist in `frontend/public/animal_assets/`
- Check browser console for 404 errors

## 📊 Expected Behavior

### Trail Making
- ❌ Number→Number: Shows red warning banner
- ❌ Letter→Letter: Shows red warning banner
- ✅ Correct alternation: Adds colored line

### Naming
- Each animal image loads within 2 seconds
- Similarity ≥60%: Accepted ✓
- Similarity <60%: Rejected ✗

### Forward Digit Span
- Countdown: 3... 2... 1...
- Each digit displays for exactly 2 seconds
- 5 digits total

### Vigilance
- 60 letters total
- Each displays for 3 seconds
- Target "A" appears ~5-8 times

### Abstraction
- Cannot submit until both questions answered
- Radio buttons highlight when selected

### Delayed Recall
- Requires prior learning phase completion
- Accepts 0-5 words entered
- Fuzzy matching: "church" ≈ "chruch" ✓

### Orientation
- Empty form on load
- All 5 fields required
- Backend returns verification object

## 🎉 Success Indicators

✅ All test modules load without errors  
✅ User can complete full assessment flow  
✅ Data saves to Firebase correctly  
✅ No console errors or warnings  
✅ Responsive on mobile and desktop  

## 📝 Notes

- SessionStorage clears on browser close (expected behavior)
- GPS permission prompt may appear for orientation test
- Fuzzy matching is case-insensitive
- All times are in UTC on backend

## 🆘 Support

If you encounter issues:
1. Check CHANGELOG.md for implementation details
2. Review backend logs for API errors
3. Check browser console for frontend errors
4. Verify Firebase configuration in .env files

---

**Last Updated:** November 6, 2025  
**Status:** Ready for Testing ✅
