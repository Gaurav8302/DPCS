# QA Validation Checklist - Dimentia Project v2.0

## 🎯 Purpose

This document provides a comprehensive manual testing checklist to validate all features of the Dimentia cognitive assessment platform according to the PRD requirements.

---

## ✅ Pre-Testing Setup

### Environment Setup

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Firebase Firestore connected (check `/health` endpoint)
- [ ] Test data seeded (run `python scripts/seed_firestore.py`)
- [ ] Browser DevTools console open for debugging

### Test User Accounts

Create test users with different education levels:

1. **High Education** (16+ years): john.doe@example.com
2. **Medium Education** (12 years): jane.smith@example.com  
3. **Low Education** (8 years): bob.wilson@example.com
4. **No Education** (0 years): alice.johnson@example.com

---

## 📝 Section 1: User Registration & Consent

### Test: User Registration Flow

#### Steps:
1. Navigate to http://localhost:3000
2. Click "Get Started" or navigate to `/consent`
3. Read consent information
4. Fill in registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Age: "65"
   - Years of Education: "16"
5. Check the consent agreement checkbox
6. Click "Agree and Continue"

#### Expected Results:
- [ ] Consent form displays properly with all sections
- [ ] Form validation works (required fields)
- [ ] Cannot proceed without checking consent
- [ ] Education level classification displays automatically:
  - 0 years → "Not Educated"
  - 1-12 years → "Basic Schooling"
  - 13+ years → "College Level"
- [ ] User is created in Firestore (check via `/api/users/email/{email}`)
- [ ] User ID stored in sessionStorage
- [ ] Redirects to `/assessment` page

#### Edge Cases:
- [ ] Try submitting with invalid email format
- [ ] Try negative education years
- [ ] Try education years > 30

---

## 🧪 Section 2: Trail Making Test

### Test: Trail Making Functionality

#### Steps:
1. From assessment page, click "Start Trail Making Test"
2. Observe randomized node positions
3. Click nodes in correct sequence: 1-A-2-B-3-C-4-D-5-E
4. Check for line color-coding (each pair different color)
5. Submit

#### Expected Results:
- [ ] Canvas fills viewport (no scrolling needed)
- [ ] Nodes randomly scattered each test
- [ ] Connecting lines appear between nodes
- [ ] Each line has unique color
- [ ] Crossing detection works
- [ ] Correct sequence validation: 1-A-2-B-3-C-4-D-5-E
- [ ] Score: 1 point if correct sequence + no crossings
- [ ] Result saved to Firestore

#### API Test:
```bash
POST /api/score/trail-making
{
  "session_id": "session-123",
  "user_id": "user-123",
  "user_path": ["1", "A", "2", "B", "3", "C", "4", "D", "5", "E"],
  "node_positions": {...},
  "crossing_errors": 0
}
```

Expected Response:
```json
{
  "score": 1,
  "crossing_errors": 0,
  "confidence": 1.0,
  "requires_manual_review": false
}
```

---

## 🎨 Section 3: Cube Copy / Shape Drawing

### Test: 2D + 3D Shape Copy

#### Steps:
1. Start "Cube Copy" test
2. View randomized shapes to copy (2 random 2D shapes + cone)
   - Possible 2D: square, triangle, rectangle, circle
   - Always includes: 3D cone
3. Draw shapes on canvas OR use camera
4. Submit drawing

#### Expected Results:
- [ ] 3 shapes displayed (2 random 2D + 1 cone)
- [ ] Drawing canvas or camera capture available
- [ ] No file upload option (per PRD)
- [ ] Basic CV heuristic checks drawing content
- [ ] Cone detection placeholder returns confidence score
- [ ] If confidence < 0.6, `requires_manual_review` = true
- [ ] Score: 0-3 points (1 per shape)
- [ ] Model confidence displayed to user

#### API Test:
```bash
POST /api/score/cube-copy
{
  "session_id": "session-123",
  "user_id": "user-123",
  "image_data": "data:image/png;base64,...",
  "shapes_to_copy": ["square", "circle", "cone"]
}
```

Expected Response:
```json
{
  "score": 3,
  "confidence": 0.6,
  "shape_scores": {"square": 1, "circle": 1, "cone": 1},
  "requires_manual_review": false
}
```

---

## 🕐 Section 4: Clock Drawing

### Test: Clock Drawing with Randomized Time

#### Steps:
1. Start "Clock Drawing" test
2. Note the randomized target time displayed (e.g., "10:10")
3. Draw clock on canvas or capture via camera
4. Submit

#### Expected Results:
- [ ] Target time is randomized per session
- [ ] Target time stored in session data
- [ ] Drawing canvas or raw camera capture available
- [ ] No file upload option
- [ ] Placeholder image analysis runs
- [ ] Score: 0-3 points
  - Contour: 1 point
  - Numbers: 1 point
  - Hands (correct time): 1 point
- [ ] Confidence score displayed
- [ ] Manual review flag if needed

#### API Test:
```bash
POST /api/score/clock-drawing
{
  "session_id": "session-123",
  "user_id": "user-123",
  "image_data": "data:image/png;base64,...",
  "target_time": "10:10"
}
```

Expected Response:
```json
{
  "score": 3,
  "scores": {"contour": 1, "numbers": 1, "hands": 1},
  "confidence": 0.7,
  "requires_manual_review": false
}
```

---

## 🦁 Section 5: Naming Task

### Test: Animal Naming with Fuzzy Matching

#### Steps:
1. Start "Naming Test"
2. View 3 high-resolution animal images (randomized, balanced)
3. For each animal:
   - Type name in text input OR
   - Use voice input
4. Submit responses

#### Expected Results:
- [ ] 3 animals displayed (randomized each test)
- [ ] Animal images from `/public/assets/animals/`
- [ ] High-resolution images load properly
- [ ] Text input available
- [ ] Voice input option available
- [ ] Fuzzy matching accepts ≥60% similarity
  - "lion" = "lion" ✓
  - "rhinoceros" = "rhino" ✓
  - "elephant" = "elefant" ✓ (typo)
- [ ] Score: 0-3 points (1 per correct identification)

#### Test Cases:
- [ ] Exact matches: "lion", "elephant", "camel"
- [ ] Close matches: "rhino" for "rhinoceros"
- [ ] Typos: "elefant" for "elephant"
- [ ] Wrong answers: "cat" for "lion" (should score 0)

#### API Test:
```bash
POST /api/score/naming
{
  "session_id": "session-123",
  "user_id": "user-123",
  "responses": [
    {"animal": "lion", "user_answer": "lion"},
    {"animal": "rhinoceros", "user_answer": "rhino"},
    {"animal": "camel", "user_answer": "camel"}
  ]
}
```

Expected Response:
```json
{
  "score": 3,
  "confidence": 1.0,
  "individual_scores": [
    {"animal": "lion", "user_answer": "lion", "similarity": 1.0, "score": 1},
    ...
  ]
}
```

---

## 🎯 Section 6: Attention Tests (Separate Screens)

### Test 6A: Forward Digit Span

#### Steps:
1. Start "Attention - Forward" test
2. Pop-up shows 5 random digits, one at a time (e.g., 2-1-8-5-4)
3. User enters sequence in same order
4. Submit

#### Expected Results:
- [ ] 5-digit randomized sequence
- [ ] Digits appear one at a time (pop-up)
- [ ] User inputs sequence
- [ ] Score: 1 point if exact match
- [ ] Score: 0 points if any error

### Test 6B: Backward Digit Span

#### Steps:
1. Start "Attention - Backward" test
2. Pop-up shows 3 random digits (e.g., 7-4-2)
3. User enters sequence in **reverse** order (2-4-7)
4. Submit

#### Expected Results:
- [ ] 3-digit randomized sequence
- [ ] User must reverse the sequence
- [ ] Score: 1 point if correctly reversed
- [ ] Score: 0 points if incorrect

### Test 6C: Vigilance

#### Steps:
1. Start "Attention - Vigilance" test
2. Click "Start"
3. See countdown: 3-2-1
4. Watch letter sequence (2s per letter)
5. Tap screen when target letter appears (e.g., "A")

#### Expected Results:
- [ ] Countdown displays
- [ ] Letters appear for 2 seconds each
- [ ] User taps when target appears
- [ ] Hit, miss, false alarm tracking
- [ ] Score:
  - 0-1 error: 3 points
  - 2 errors: 2 points
  - 3 errors: 1 point
  - >3 errors: 0 points
- [ ] Each subtask saved separately in Firestore

#### API Tests:
```bash
POST /api/score/attention/forward
POST /api/score/attention/backward
POST /api/score/attention/vigilance
```

---

## 🗣️ Section 7: Language

### Test 7A: Sentence Repetition

#### Steps:
1. Start "Sentence Repetition" test
2. Read sentence on screen
3. Type the sentence (copy/paste DISABLED)
4. Punctuation insertion allowed
5. Submit

#### Expected Results:
- [ ] Copy/paste disabled in input field
- [ ] Punctuation can be added manually
- [ ] Fuzzy scoring:
  - 80-100% similarity: 1 point (full credit)
  - 70-79% similarity: 0.5 points (1 mark deduction)
  - <70% similarity: 0 points
- [ ] Score: 0-2 points total

#### Test Cases:
- [ ] Perfect match: "I only know that John is the one to help today"
- [ ] Minor difference: "I only know John is the one to help today" (missing "that")
- [ ] Major difference: "John is helping today"

### Test 7B: Verbal Fluency

#### Steps:
1. Start "Verbal Fluency" test
2. Click "Start Recording"
3. See countdown: 3-2-1
4. Speak words starting with "F" for 60 seconds
5. Timer auto-stops at 60s

#### Expected Results:
- [ ] Microphone permission requested
- [ ] 3-2-1 countdown
- [ ] 60-second timer visible
- [ ] Auto-stop after 60s
- [ ] Backend placeholder ASR processes audio
- [ ] Fuzzy matching: ≤60% spelling error tolerance
- [ ] Score:
  - ≥11 words: 2 points
  - <11 words: 0 points

#### API Tests:
```bash
POST /api/score/language/sentence-repetition
POST /api/score/language/verbal-fluency
```

---

## 🧩 Section 8: Abstraction

### Test: Similarity Identification

#### Steps:
1. Start "Abstraction" test
2. View word pairs (e.g., "train - bicycle")
3. Select similarity from multiple choice OR type answer
4. Submit

#### Expected Results:
- [ ] Multiple choice UI available
- [ ] Two word pairs presented
- [ ] User selection recorded
- [ ] Score: 0-2 points (1 per correct pair)

#### Test Cases:
- [ ] "train - bicycle" → "means of transportation" ✓
- [ ] "watch - ruler" → "measuring instruments" ✓
- [ ] Wrong answer: "train - bicycle" → "metal objects" ✗

#### API Test:
```bash
POST /api/score/abstraction
{
  "session_id": "session-123",
  "user_id": "user-123",
  "responses": [
    {"pair": "train-bicycle", "answer": "means of transportation", "correct": true},
    {"pair": "watch-ruler", "answer": "measuring instruments", "correct": true}
  ]
}
```

---

## 🧠 Section 9: Delayed Recall

### Test: Word Memory

#### Steps:
1. At start of assessment, user shown 5 words to remember
2. After completing other tests (~15 minutes), return to recall
3. User types or speaks words they remember
4. Submit

#### Expected Results:
- [ ] 5 words presented at beginning
- [ ] Recall happens after other tests
- [ ] Fuzzy matching accepts similar spellings
- [ ] Score: 0-4 points (capped at 4 per PRD)

#### Test Cases:
- [ ] Perfect: "face, velvet, church, daisy, red"
- [ ] With typos: "fase, velvet, chruch, daisy" (should accept)
- [ ] Partial: "face, church, red" (3 points)

#### API Test:
```bash
POST /api/score/delayed-recall
{
  "session_id": "session-123",
  "user_id": "user-123",
  "original_words": ["face", "velvet", "church", "daisy", "red"],
  "recalled_words": ["face", "velvet", "church", "daisy"]
}
```

---

## 📍 Section 10: Orientation

### Test: Date, Time, Place

#### Steps:
1. Start "Orientation" test
2. Answer 5 questions:
   - Date (number)
   - Month (name)
   - Year (number)
   - Day of week (name)
   - City (from geolocation)
3. Submit

#### Expected Results:
- [ ] **PRD change**: "Name of this place" removed → now 5 questions
- [ ] Date verified against server time
- [ ] Month verified (name or number)
- [ ] Year verified
- [ ] Day of week verified
- [ ] City verified via browser geolocation + reverse geocoding (or mock)
- [ ] Score: 0-5 points (1 per question)

#### API Tests:
```bash
POST /api/verify/location
{
  "city": "San Francisco",
  "latitude": 37.7749,
  "longitude": -122.4194
}

POST /api/verify/orientation
{
  "session_id": "session-123",
  "user_id": "user-123",
  "responses": {
    "date": "15",
    "month": "December",
    "year": "2024",
    "day": "Sunday",
    "city": "San Francisco"
  }
}
```

---

## 🎯 Section 11: Total Scoring & Results

### Test: Final Score Calculation

#### Steps:
1. Complete all test sections
2. Navigate to results/dashboard
3. View total score and interpretation

#### Expected Results:
- [ ] **Total Score**: 0-30 points
- [ ] **Education Adjustment**: +1 point if education < 13 years (not college level)
- [ ] **Interpretation Ranges**:
  - 26-30: "Normal"
  - 18-25: "Mild Cognitive Impairment"
  - 10-17: "Moderate Cognitive Impairment"
  - <10: "Severe Cognitive Impairment"
- [ ] Section breakdown shown
- [ ] Manual review flag visible if applicable

#### Score Distribution Test:

| Section | Max Points |
|---------|-----------|
| Trail Making | 1 |
| 2D/3D Shapes | 3 |
| Clock Drawing | 3 |
| Naming | 3 |
| Attention | 5 |
| Language | 4 |
| Abstraction | 2 |
| Delayed Recall | 4 |
| Orientation | 5 |
| **TOTAL** | **30** |

#### API Test:
```bash
GET /api/results/{session_id}
```

Expected Response:
```json
{
  "session_id": "session-123",
  "user_id": "user-123",
  "user_name": "Test User",
  "education_level": "college_level",
  "total_score": 28,
  "max_score": 30,
  "interpretation": "Normal",
  "section_scores": {...},
  "requires_manual_review": false,
  "completed_at": "2024-12-15T10:30:00"
}
```

---

## ⏰ Section 12: Inactivity Detection

### Test: Idle Alert

#### Steps:
1. Start any test section
2. Stop all mouse/keyboard/touch activity for 60 seconds
3. Observe alert

#### Expected Results:
- [ ] After 60 seconds of inactivity, flashing overlay appears
- [ ] Alert displays message: "Are you still there?"
- [ ] Alert is dismissible by clicking anywhere
- [ ] After dismissal, timer resets
- [ ] Alert reappears after another 60s of inactivity

---

## 👨‍💼 Section 13: Admin Dashboard

### Test: Admin Endpoints

#### Setup:
Access admin endpoints directly via API or create admin UI.

#### Test 13A: Dashboard Stats

```bash
GET /api/admin/dashboard/stats
```

Expected Response:
```json
{
  "total_sessions": 10,
  "sessions_requiring_review": 2,
  "total_users": 5,
  "avg_score": 24.5,
  "interpretation_distribution": {
    "Normal": 6,
    "Mild": 3,
    "Moderate": 1,
    "Severe": 0
  }
}
```

#### Test 13B: View All Sessions

```bash
GET /api/admin/sessions?requires_review=true&limit=10
```

Expected:
- [ ] Returns sessions requiring manual review
- [ ] Pagination works (limit/skip)
- [ ] Includes user info and scores

#### Test 13C: View Detailed Session

```bash
GET /api/admin/sessions/{session_id}/detailed
```

Expected:
- [ ] Full session details
- [ ] All individual test results
- [ ] User education info
- [ ] Adjusted score shown

#### Test 13D: Update Review Status

```bash
PUT /api/admin/sessions/{session_id}/review
{
  "requires_review": false,
  "notes": "Reviewed - score confirmed"
}
```

Expected:
- [ ] Review flag updated
- [ ] Notes saved
- [ ] Timestamp updated

---

## 🔬 Section 14: Unit Tests

### Backend Tests

Run all tests:

```powershell
cd backend
pytest tests/ -v --cov=utils --cov=routers
```

#### Expected Results:
- [ ] All scoring function tests pass
- [ ] Trail making scoring correct
- [ ] Naming fuzzy matching works
- [ ] Attention scoring accurate
- [ ] Language scoring correct
- [ ] Abstraction scoring works
- [ ] Delayed recall fuzzy matching functional
- [ ] Orientation scoring correct
- [ ] Code coverage >80%

---

## 🔒 Section 15: Security & Edge Cases

### Test: Data Privacy

- [ ] No service account JSON in repository
- [ ] `.env` files in `.gitignore`
- [ ] No sensitive data in frontend logs
- [ ] CORS configured correctly

### Test: Error Handling

- [ ] Invalid user ID returns 404
- [ ] Invalid session ID returns 404
- [ ] Missing required fields returns 400
- [ ] Malformed data returns 422

### Test: Edge Cases

- [ ] Empty drawing submission
- [ ] Very long user inputs
- [ ] Special characters in text fields
- [ ] Non-English characters (if applicable)
- [ ] Multiple rapid submissions

---

## ✅ Final Checklist

### Functionality
- [ ] All 10 test sections working
- [ ] Scoring accurate (30-point scale)
- [ ] Education level classification correct
- [ ] Results interpretation correct
- [ ] Inactivity alert functional
- [ ] Admin dashboard accessible

### Technical
- [ ] Backend API responds
- [ ] Frontend loads and navigates
- [ ] Firestore connected
- [ ] All API endpoints work
- [ ] Unit tests pass
- [ ] No console errors

### UX/UI
- [ ] Responsive design
- [ ] Clear instructions
- [ ] Progress indicators
- [ ] Error messages helpful
- [ ] Loading states shown

### Documentation
- [ ] README_FIREBASE.md complete
- [ ] QA.md (this document) complete
- [ ] API docs accessible at `/docs`
- [ ] Setup instructions clear

---

## 📊 Test Report Template

Use this template to document test results:

```
# QA Test Report - Dimentia v2.0
**Date**: YYYY-MM-DD
**Tester**: [Your Name]
**Environment**: Local / Staging / Production

## Summary
- Total Tests: XX
- Passed: XX
- Failed: XX
- Blocked: XX

## Failed Tests
1. [Test Name]
   - Expected: ...
   - Actual: ...
   - Screenshot: ...
   - Priority: High/Medium/Low

## Notes
- ...
```

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Ready for Testing
