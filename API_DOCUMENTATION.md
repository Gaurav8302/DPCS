# API Endpoints Documentation

Complete reference for all Dimentia Project API endpoints.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Health Check

### GET `/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "service": "dimentia-api"
}
```

---

## Users

### POST `/api/users`

Create a new user with automatic education level classification.

**Request Body:**
```json
{
  "email": "patient@example.com",
  "name": "John Doe",
  "education_years": 16
}
```

**Response:**
```json
{
  "_id": "uuid-here",
  "email": "patient@example.com",
  "name": "John Doe",
  "education_years": 16,
  "education_level": "college_level",
  "created_at": "2025-10-22T10:00:00Z"
}
```

**Education Level Classification:**
- 0 years: `not_educated`
- 1-12 years: `basic_schooling`
- 13+ years: `college_level`

### GET `/api/users/{user_id}`

Get user by ID.

### GET `/api/users/email/{email}`

Get user by email address.

### DELETE `/api/users/{user_id}`

Delete user (GDPR compliance).

---

## Sessions

### POST `/api/sessions`

Create a new test session.

**Request Body:**
```json
{
  "user_id": "user-uuid"
}
```

**Response:**
```json
{
  "_id": "session-uuid",
  "user_id": "user-uuid",
  "start_time": "2025-10-22T10:00:00Z",
  "completed_sections": [],
  "total_score": 0.0,
  "requires_manual_review": false,
  "section_scores": {},
  "created_at": "2025-10-22T10:00:00Z"
}
```

### GET `/api/sessions/{session_id}`

Get session details.

### PUT `/api/sessions/{session_id}`

Update session progress.

**Request Body:**
```json
{
  "completed_sections": ["trail_making", "naming"],
  "total_score": 4.0,
  "section_scores": {
    "trail_making": 1,
    "naming": 3
  }
}
```

### GET `/api/sessions/user/{user_id}`

Get all sessions for a user.

---

## Scoring Endpoints

### POST `/api/score/trail-making`

Score trail making test.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "user_path": ["1", "A", "2", "B", "3", "C", "4", "D", "5", "E"],
  "node_positions": {
    "1": {"x": 100, "y": 100},
    "A": {"x": 200, "y": 150}
  },
  "crossing_errors": 0
}
```

**Response:**
```json
{
  "score": 1,
  "crossing_errors": 0,
  "confidence": 1.0,
  "requires_manual_review": false
}
```

### POST `/api/score/cube-copy`

Score 2D figures and 3D cone copy.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "image_data": "data:image/png;base64,...",
  "shapes_to_copy": ["square", "circle", "cone"]
}
```

**Response:**
```json
{
  "score": 3,
  "confidence": 0.6,
  "shape_scores": {
    "square": 1,
    "circle": 1,
    "cone": 1
  },
  "requires_manual_review": true
}
```

### POST `/api/score/clock-drawing`

Score clock drawing test.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "image_data": "data:image/png;base64,...",
  "target_time": "10:10"
}
```

**Response:**
```json
{
  "score": 3,
  "scores": {
    "contour": 1,
    "numbers": 1,
    "hands": 1
  },
  "confidence": 0.7,
  "requires_manual_review": false
}
```

### POST `/api/score/naming`

Score animal naming test.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "responses": [
    {"animal": "lion", "user_answer": "lion"},
    {"animal": "elephant", "user_answer": "elefant"},
    {"animal": "giraffe", "user_answer": "giraffe"}
  ]
}
```

**Response:**
```json
{
  "score": 3,
  "confidence": 1.0,
  "individual_scores": [
    {"animal": "lion", "user_answer": "lion", "similarity": 1.0, "score": 1},
    {"animal": "elephant", "user_answer": "elefant", "similarity": 0.88, "score": 1}
  ]
}
```

### POST `/api/score/attention/forward`

Score forward digit span.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "user_response": [2, 1, 8, 5, 4],
  "correct_sequence": [2, 1, 8, 5, 4]
}
```

**Response:**
```json
{
  "score": 1,
  "confidence": 1.0,
  "correct": true
}
```

### POST `/api/score/attention/backward`

Score backward digit span.

### POST `/api/score/attention/vigilance`

Score vigilance test.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "taps": [2, 5, 8, 12],
  "target_indices": [2, 5, 8, 12, 18],
  "total_targets": 5
}
```

**Response:**
```json
{
  "score": 2,
  "confidence": 1.0,
  "hits": 4,
  "misses": 1,
  "false_alarms": 0
}
```

### POST `/api/score/language/sentence-repetition`

Score sentence repetition.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "sentences": [
    {
      "original": "The cat sat on the mat.",
      "user_answer": "The cat sat on the mat."
    }
  ]
}
```

**Response:**
```json
{
  "score": 2,
  "confidence": 1.0,
  "individual_scores": [
    {
      "original": "...",
      "user_answer": "...",
      "similarity": 1.0,
      "score": 1.0
    }
  ]
}
```

### POST `/api/score/language/verbal-fluency`

Score verbal fluency (F-words in 60s).

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "transcript": "fast fish fork friend family...",
  "duration_seconds": 60.0
}
```

**Response:**
```json
{
  "score": 2,
  "confidence": 0.8,
  "word_count": 12,
  "unique_words": 11
}
```

### POST `/api/score/abstraction`

Score abstraction test.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "responses": [
    {
      "pair": "train-bicycle",
      "answer": "means of transportation",
      "correct": true
    }
  ]
}
```

**Response:**
```json
{
  "score": 2,
  "confidence": 1.0
}
```

### POST `/api/score/delayed-recall`

Score delayed recall.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "original_words": ["face", "velvet", "church", "daisy", "red"],
  "recalled_words": ["face", "velvet", "church", "daisy"]
}
```

**Response:**
```json
{
  "score": 4,
  "confidence": 1.0,
  "matches": [
    {"original": "face", "recalled": "face", "similarity": 1.0, "matched": true}
  ]
}
```

---

## Verification

### POST `/api/verify/location`

Verify user's city.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "city": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "city_correct": true,
  "confidence": 0.8,
  "detected_city": "New York"
}
```

### POST `/api/verify/datetime`

Verify date, month, year, day of week.

**Request:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "date": "22",
  "month": "October",
  "year": "2025",
  "day_of_week": "Wednesday"
}
```

**Response:**
```json
{
  "date_correct": true,
  "month_correct": true,
  "year_correct": true,
  "day_correct": true,
  "score": 4,
  "confidence": 1.0
}
```

---

## Results

### GET `/api/results/{session_id}`

Get aggregated results for a session.

**Response:**
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "user_name": "John Doe",
  "education_level": "college_level",
  "total_score": 28.0,
  "max_score": 30,
  "interpretation": "Normal",
  "section_scores": {
    "trail_making": 1,
    "naming": 3,
    "clock_drawing": 3
  },
  "requires_manual_review": false,
  "completed_at": "2025-10-22T11:00:00Z",
  "individual_results": []
}
```

**Interpretation Ranges:**
- 26-30: Normal
- 18-25: Mild Cognitive Impairment
- 10-17: Moderate Cognitive Impairment
- <10: Severe Cognitive Impairment

### GET `/api/results/user/{user_id}/history`

Get all test results for a user.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- **Development**: No rate limiting
- **Production**: 100 requests per minute per IP

## CORS

Allowed origins:
- `http://localhost:3000`
- `https://*.vercel.app`
- Your production domain

---

For interactive API testing, visit: **http://localhost:8000/docs**
