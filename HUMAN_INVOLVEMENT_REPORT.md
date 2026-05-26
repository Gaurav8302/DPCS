# Human Involvement Report - PRD Refactoring

## Executive Summary

This report outlines the tasks that require human intervention to complete the full PRD implementation for the AI-Powered Digital MoCA Dementia Screening Platform.

---

## ✅ Completed Refactoring Tasks

### Backend Scoring (`backend/utils/scoring.py`)
- ✅ Added `score_attention_serial7()` for Serial 7s test (3 points max)
- ✅ Fixed `score_attention_vigilance()` to return 1 point (0-1 errors) instead of 3 points
- ✅ Updated `score_verbal_fluency()` to return 1 point max (not 2)
- ✅ Added PRD constants: `NAMING_ACCEPTABLE_ANSWERS`, `MEMORY_WORDS`, `ABSTRACTION_PAIRS`, `SENTENCES`
- ✅ Updated abstraction scoring with PRD word pairs (Hammer/Screwdriver, Matches/Lamp)

### Backend Session Tracker (`backend/utils/session_tracker.py`)
- ✅ Added education adjustment (+1 point for ≤12 years education)
- ✅ Updated `SECTION_CONFIG` with all PRD subsections
- ✅ Updated `AGGREGATE_MAX` with correct point distributions

### Backend API (`backend/routers/scoring.py`)
- ✅ Added `/attention/serial7` endpoint
- ✅ Updated vigilance response model

### Frontend Test Pages
- ✅ Created `attention-serial7.tsx` - New Serial 7s test page
- ✅ Updated `naming.tsx` - Uses PRD animals (Lion, Rhinoceros, Camel)
- ✅ Updated `abstraction.tsx` - Free-text input with PRD word pairs
- ✅ Updated `sentence-repetition.tsx` - PRD sentences
- ✅ Updated `memory-learning.tsx` - PRD words (LEG, COTTON, SCHOOL, TOMATO, WHITE)
- ✅ Updated `delayed-recall.tsx` - Uses PRD memory words
- ✅ Updated `assessment.tsx` - 14 modules in PRD-specified order

### Tests
- ✅ All 32 scoring tests pass
- ✅ Tests updated for PRD specifications

---

## 🔴 CRITICAL: Human Action Required

### 1. Animal Images for Naming Test
**Priority: HIGH**

The naming test now uses PRD-specified animals. Missing images:

| Animal | Status | Action Required |
|--------|--------|-----------------|
| Lion | ✅ Exists | `lion.webp` |
| Rhinoceros | ❌ Missing | Add `rhino.webp` or `rhinoceros.webp` |
| Camel | ❌ Missing | Add `camel.webp` |

**Location:** `frontend/public/animal_assets/`

**Instructions:**
1. Obtain royalty-free images of a rhinoceros and camel
2. Recommended size: 400x300 pixels
3. Format: WebP or PNG for web optimization
4. Name files: `rhino.webp` and `camel.webp`
5. Update `frontend/src/pages/tests/naming.tsx` if using different filenames

### 2. Computer Vision Models (Placeholder Implementation)
**Priority: MEDIUM**

The following scoring functions use placeholder heuristics instead of actual CV models:

#### a) Clock Drawing Test (`score_clock_drawing`)
- **Current:** Basic placeholder returning random-ish scores
- **Required:** CV model that evaluates:
  - Contour integrity (circle shape)
  - Number placement (12 numbers evenly distributed)
  - Hand positions (hour and minute hands at correct angles)
  
**PRD Requirement:** 3 points max
- 1 point: Contour (circle present)
- 1 point: Numbers (all 12 present, correct positions)
- 1 point: Hands (correct time shown)

#### b) Cube Copy Test (`score_cube_copy`)
- **Current:** Basic placeholder
- **Required:** CV model that evaluates:
  - 3D shape recognition
  - Line intersections and angles
  - Perspective accuracy

**Action:** Integrate a CV service (e.g., Google Cloud Vision, Azure Computer Vision, or custom TensorFlow model)

### 3. GPS Reverse Geocoding for Orientation
**Priority: LOW**

The orientation test could auto-detect city/place using device GPS:

**Current:** Manual user input
**Enhancement:** Use reverse geocoding API

**Options:**
- Google Maps Geocoding API
- OpenStreetMap Nominatim (free)
- Mapbox Geocoding API

**Files to Update:**
- `frontend/src/pages/tests/orientation.tsx`
- `backend/routers/scoring.py` (add validation endpoint)

---

## 🟡 Recommended Enhancements

### 1. Speech Recognition for Verbal Fluency
**Current:** Manual text input
**Enhancement:** Use Web Speech API or external service

```javascript
// Already partially implemented in frontend
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
```

### 2. Audio Recording for Sentence Repetition
**Current:** Text comparison
**Enhancement:** Record and transcribe user's spoken response

### 3. Manual Review Interface
**Current:** `requires_manual_review` flag set on low-confidence scores
**Enhancement:** Create admin panel for clinician review

**Suggested Fields for Review:**
- Session ID
- Test type
- User response
- AI score
- Confidence level
- Override score input

### 4. Firebase Security Rules
**Current:** May be permissive
**Action:** Review `firestore.rules` for production security

---

## 📋 Environment Setup Verification

Before deploying, verify:

```bash
# Backend (venv311)
cd backend
.\venv311\Scripts\Activate.ps1
pip install -r requirements.txt
python -m pytest tests/ -v

# Frontend
cd frontend
npm install
npm run build
```

---

## 📊 PRD Score Distribution Verification

| Domain | PRD Points | Implementation |
|--------|------------|----------------|
| Visuospatial/Executive | 5 | ✅ Trail(1) + Cube(1) + Clock(3) |
| Naming | 3 | ✅ Lion(1) + Rhinoceros(1) + Camel(1) |
| Attention | 6 | ✅ Forward(1) + Backward(1) + Vigilance(1) + Serial7(3) |
| Language | 3 | ✅ Sentences(2) + Fluency(1) |
| Abstraction | 2 | ✅ Hammer/Screwdriver(1) + Matches/Lamp(1) |
| Delayed Recall | 5 | ✅ 5 words × 1pt each |
| Orientation | 6 | ✅ 6 questions × 1pt each |
| Education Bonus | +1 | ✅ Added if ≤12 years education |
| **Total** | **30 (+1)** | ✅ |

---

## 🔧 Files Modified During Refactoring

### Backend
1. `backend/utils/scoring.py` - Added Serial 7s, fixed vigilance, PRD constants
2. `backend/utils/session_tracker.py` - Education adjustment, section config
3. `backend/utils/__init__.py` - Exports
4. `backend/routers/scoring.py` - Serial 7s endpoint
5. `backend/tests/test_scoring.py` - Updated tests

### Frontend
1. `frontend/src/pages/tests/attention-serial7.tsx` - **NEW**
2. `frontend/src/pages/tests/naming.tsx` - PRD animals
3. `frontend/src/pages/tests/abstraction.tsx` - Free-text input
4. `frontend/src/pages/tests/sentence-repetition.tsx` - PRD sentences
5. `frontend/src/pages/tests/memory-learning.tsx` - PRD words
6. `frontend/src/pages/tests/delayed-recall.tsx` - PRD words fallback
7. `frontend/src/pages/tests/attention-vigilance.tsx` - Navigation to Serial 7s
8. `frontend/src/pages/assessment.tsx` - 14 modules in order
9. `frontend/src/lib/api.ts` - Serial 7s API function

---

## ⚠️ Known Warnings (Non-Critical)

From test output:
1. `PendingDeprecationWarning` for multipart - Update starlette/form parsers
2. `PydanticDeprecatedSince20` - Migrate `class Config` to `ConfigDict`

These don't affect functionality but should be addressed for future compatibility.

---

## Next Steps

1. **Immediate:** Add missing animal images (rhino, camel)
2. **Short-term:** Test full assessment flow end-to-end
3. **Medium-term:** Implement CV models for drawing tests
4. **Long-term:** Add speech recognition, admin review panel

---

*Report generated after PRD refactoring on the RPC2.0 project*
