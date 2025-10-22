# 🏗️ Dimentia Project Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                  │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Browser    │  │   Mobile     │  │   Tablet     │             │
│  │   (React)    │  │   (Future)   │  │   (Future)   │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                       │
│         └──────────────────┴──────────────────┘                       │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │ HTTPS
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                    PRESENTATION LAYER                                  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Next.js 14 Application                           │    │
│  │                                                               │    │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │    │
│  │  │ Landing │  │ Test     │  │ Results  │  │  Admin   │    │    │
│  │  │ Page    │  │ Modules  │  │ Page     │  │Dashboard │    │    │
│  │  └─────────┘  └──────────┘  └──────────┘  └──────────┘    │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │          NextAuth.js Authentication                  │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │         State Management (Context API)               │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │ REST API / JSON
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                      API LAYER                                         │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                FastAPI Application                            │    │
│  │                                                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │    │
│  │  │  Users   │  │ Sessions │  │ Scoring  │  │  Verify  │   │    │
│  │  │  Router  │  │  Router  │  │  Router  │  │  Router  │   │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │    │
│  │                                                               │    │
│  │  ┌──────────┐  ┌──────────────────────────────────────┐    │    │
│  │  │ Results  │  │      Middleware & Security           │    │    │
│  │  │  Router  │  │  (CORS, JWT, Rate Limiting)          │    │    │
│  │  └──────────┘  └──────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                                 │
│                                                                       │
│  ┌────────────────────────┐  ┌────────────────────────┐            │
│  │  Scoring Algorithms    │  │  Data Validation       │            │
│  │                        │  │                        │            │
│  │  • Trail Making        │  │  • Pydantic Models     │            │
│  │  • Cube/2D Copy        │  │  • Input Sanitization  │            │
│  │  • Clock Drawing       │  │  • Type Checking       │            │
│  │  • Naming (Fuzzy)      │  └────────────────────────┘            │
│  │  • Attention           │                                          │
│  │  • Language            │  ┌────────────────────────┐            │
│  │  • Abstraction         │  │  Education Classifier  │            │
│  │  • Recall              │  │                        │            │
│  │  • Orientation         │  │  • Not Educated (0)    │            │
│  └────────────────────────┘  │  • Basic (1-12)        │            │
│                               │  • College (13+)       │            │
│                               └────────────────────────┘            │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                      DATA LAYER                                        │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │            MongoDB Atlas (Cloud Database)                     │    │
│  │                                                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │    │
│  │  │  users   │  │ sessions │  │  results │  │   logs   │   │    │
│  │  │Collection│  │Collection│  │Collection│  │Collection│   │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │    │
│  │                                                               │    │
│  │  Features:                                                    │    │
│  │  • Automatic backups                                          │    │
│  │  • Encryption at rest                                         │    │
│  │  • Replication                                                │    │
│  │  • ACID transactions                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### User Registration & Test Flow

```
┌─────────┐                                                         
│ Patient │                                                         
└────┬────┘                                                         
     │                                                              
     │ 1. Access Platform                                          
     ▼                                                              
┌────────────┐                                                      
│  Browser   │                                                      
└─────┬──────┘                                                      
      │                                                             
      │ 2. Create Account                                          
      ▼                                                             
┌──────────────┐      3. POST /api/users      ┌──────────────┐   
│   Frontend   ├──────────────────────────────►│   Backend    │   
│  (Next.js)   │                                │  (FastAPI)   │   
└──────┬───────┘                                └──────┬───────┘   
       │                                                │           
       │                                         4. Classify        
       │                                         Education Level    
       │                                                │           
       │                                                ▼           
       │                                         ┌─────────────┐   
       │                                         │  MongoDB    │   
       │                                         │   users     │   
       │                                         └──────┬──────┘   
       │                                                │           
       │◄──────── 5. User Created ────────────────────┘           
       │                                                             
       │ 6. Start Test Session                                     
       ├──────────────────────────────────────►                    
       │      POST /api/sessions                                   
       │                                                             
       │◄──────── 7. Session ID ─────────────────                  
       │                                                             
       │ 8. Complete Module (e.g., Trail Making)                   
       ├──────────────────────────────────────►                    
       │   POST /api/score/trail-making                            
       │   { user_path, nodes, ... }                               
       │                                                             
       │                                         9. Score Algorithm 
       │                                         Calculates Result  
       │                                                │           
       │                                                ▼           
       │                                         ┌─────────────┐   
       │                                         │  MongoDB    │   
       │                                         │  results    │   
       │                                         └──────┬──────┘   
       │                                                │           
       │◄──────── 10. Score & Confidence ─────────────┘           
       │          { score: 1, confidence: 1.0 }                    
       │                                                             
       │ 11. Update Session Progress                               
       ├──────────────────────────────────────►                    
       │   PUT /api/sessions/{id}                                  
       │                                                             
       │ ... Repeat for all 9 modules ...                          
       │                                                             
       │ 12. Get Final Results                                     
       ├──────────────────────────────────────►                    
       │   GET /api/results/{session_id}                           
       │                                                             
       │                                         13. Aggregate      
       │                                         • Calculate total  
       │                                         • Apply education  
       │                                         • Determine level  
       │                                                │           
       │◄──────── 14. Complete Report ────────────────┘           
       │   { total_score: 28,                                      
       │     interpretation: "Normal",                             
       │     section_scores: {...} }                               
       │                                                             
       ▼                                                             
┌────────────┐                                                      
│  Results   │                                                      
│   Page     │                                                      
└────────────┘                                                      
```

---

## Component Architecture

### Frontend Component Tree

```
App (_app.tsx)
│
├── SessionProvider (NextAuth)
│   │
│   ├── ProgressProvider (Context)
│   │   │
│   │   ├── IdleAlert (Global)
│   │   │
│   │   └── Page Components
│   │       │
│   │       ├── Landing Page (/)
│   │       │   ├── Header
│   │       │   ├── Hero Section
│   │       │   ├── Feature Cards
│   │       │   └── Footer
│   │       │
│   │       ├── Consent Page (/consent)
│   │       │   └── Consent Form
│   │       │
│   │       ├── Profile Setup (/profile)
│   │       │   ├── Name Input
│   │       │   ├── Email Input
│   │       │   └── Education Input
│   │       │
│   │       ├── Test Modules (/test/*)
│   │       │   ├── ProgressBar
│   │       │   ├── Instructions
│   │       │   ├── Test Interface
│   │       │   │   ├── Trail Making Canvas
│   │       │   │   ├── Drawing Canvas
│   │       │   │   ├── Image Upload
│   │       │   │   ├── Text Input
│   │       │   │   ├── Audio Recorder
│   │       │   │   └── Multiple Choice
│   │       │   └── Navigation
│   │       │
│   │       ├── Results Page (/results)
│   │       │   ├── Score Display
│   │       │   ├── Interpretation Badge
│   │       │   ├── Section Breakdown
│   │       │   ├── Charts
│   │       │   └── Export Options
│   │       │
│   │       └── Admin Dashboard (/admin)
│   │           ├── Session List
│   │           ├── Filters
│   │           ├── Manual Review Queue
│   │           └── Analytics
│   │
│   └── Global Styles & Theme
```

---

## Database Schema

### Collections Structure

```
MongoDB: dimentia_project
│
├── users
│   ├── _id: UUID
│   ├── email: String (unique)
│   ├── name: String
│   ├── education_years: Integer
│   ├── education_level: Enum
│   └── created_at: DateTime
│
├── sessions
│   ├── _id: UUID
│   ├── user_id: UUID (ref: users)
│   ├── start_time: DateTime
│   ├── completed_sections: Array<String>
│   ├── total_score: Float
│   ├── requires_manual_review: Boolean
│   ├── section_scores: Object
│   ├── created_at: DateTime
│   └── updated_at: DateTime
│
├── results
│   ├── _id: UUID
│   ├── session_id: UUID (ref: sessions)
│   ├── user_id: UUID (ref: users)
│   ├── section_name: String
│   ├── raw_score: Float
│   ├── confidence: Float
│   ├── details: Object
│   ├── requires_manual_review: Boolean
│   └── created_at: DateTime
│
└── logs (Audit Trail)
    ├── _id: UUID
    ├── user_id: UUID (ref: users)
    ├── action: String
    ├── resource_type: String
    ├── resource_id: String
    ├── ip_address: String
    ├── user_agent: String
    ├── details: Object
    └── timestamp: DateTime
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. TRANSPORT LAYER                                             │
│     • TLS 1.3 (HTTPS)                                          │
│     • Certificate from Let's Encrypt                            │
│     • HSTS Headers                                              │
│                                                                 │
│  2. AUTHENTICATION                                              │
│     • NextAuth.js                                               │
│     • JWT tokens (24h expiration)                              │
│     • Secure cookie storage                                     │
│     • Password hashing (bcrypt)                                │
│                                                                 │
│  3. AUTHORIZATION                                               │
│     • Role-based access control                                │
│     • Protected API routes                                      │
│     • Admin-only endpoints                                      │
│     • User-specific data isolation                             │
│                                                                 │
│  4. DATA PROTECTION                                             │
│     • AES-256 encryption at rest                               │
│     • Encrypted MongoDB connections                             │
│     • Environment variable protection                           │
│     • Secret rotation capability                                │
│                                                                 │
│  5. INPUT VALIDATION                                            │
│     • Pydantic models                                           │
│     • Type checking                                             │
│     • SQL injection prevention (MongoDB)                        │
│     • XSS prevention                                            │
│     • CSRF tokens                                               │
│                                                                 │
│  6. API SECURITY                                                │
│     • Rate limiting (100 req/min)                              │
│     • CORS policy                                               │
│     • Request size limits                                       │
│     • Timeout protection                                        │
│                                                                 │
│  7. AUDIT & MONITORING                                          │
│     • Audit log for all PHI access                             │
│     • Failed login attempts tracking                            │
│     • Anomaly detection (future)                               │
│     • Real-time alerts                                          │
│                                                                 │
│  8. COMPLIANCE                                                  │
│     • HIPAA - PHI handling                                     │
│     • GDPR - Right to deletion                                 │
│     • Data retention policies                                   │
│     • Regular security audits                                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Environment
```
Local Machine
├── Backend: localhost:8000
├── Frontend: localhost:3000
└── MongoDB: Atlas (cloud)
```

### Production Environment (Recommended)
```
┌─────────────────────────────────────────┐
│          Cloudflare CDN                  │
│     (DDoS Protection, Caching)          │
└────────────┬────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│         Vercel (Frontend)               │
│   • Next.js SSR/SSG                     │
│   • Global CDN                          │
│   • Automatic HTTPS                     │
│   • Environment Variables               │
└────────────┬───────────────────────────┘
             │
             ▼ API Calls
┌────────────────────────────────────────┐
│    AWS EC2 / GCP Cloud Run (Backend)   │
│   • FastAPI with Uvicorn               │
│   • Nginx reverse proxy                │
│   • Systemd service                     │
│   • Let's Encrypt SSL                   │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│      MongoDB Atlas (Database)           │
│   • Cluster with replicas              │
│   • Automatic backups                   │
│   • Point-in-time recovery             │
│   • IP whitelist                        │
└────────────────────────────────────────┘
```

---

## Scoring Algorithm Flow

```
Input (User Response)
      │
      ▼
┌──────────────────┐
│  Preprocessing   │
│  • Normalize     │
│  • Clean data    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scoring Logic    │
│ (Section-specific)│
├──────────────────┤
│ Trail Making:    │
│  • Check sequence│
│  • Count errors  │
│                  │
│ Cube Copy:       │
│  • CV detection  │
│  • Shape match   │
│                  │
│ Naming:          │
│  • Fuzzy match   │
│  • Threshold 0.6 │
│                  │
│ ... etc          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Confidence      │
│  Calculation     │
│  • 0.0 - 1.0     │
│  • < 0.7 = flag  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Store Result   │
│   • Raw score    │
│   • Confidence   │
│   • Details      │
│   • Review flag  │
└────────┬─────────┘
         │
         ▼
    API Response
    { score, confidence,
      requires_manual_review }
```

---

## File Structure Map

```
RPC2.0/
│
├── 📁 backend/                 # Python FastAPI backend
│   ├── 📁 database/            # Database layer
│   │   ├── connection.py       # MongoDB connection
│   │   ├── models.py           # Data models
│   │   └── __init__.py
│   │
│   ├── 📁 routers/             # API endpoints
│   │   ├── users.py            # User management
│   │   ├── sessions.py         # Session tracking
│   │   ├── scoring.py          # All scoring endpoints
│   │   ├── verification.py     # Location/time checks
│   │   ├── results.py          # Result aggregation
│   │   └── __init__.py
│   │
│   ├── 📁 utils/               # Utilities
│   │   ├── scoring.py          # Scoring algorithms
│   │   └── __init__.py
│   │
│   ├── main.py                 # ⭐ Entry point
│   └── requirements.txt        # Dependencies
│
├── 📁 frontend/                # Next.js frontend
│   ├── 📁 src/
│   │   ├── 📁 pages/           # Routes
│   │   │   ├── _app.tsx        # App wrapper
│   │   │   ├── _document.tsx   # HTML document
│   │   │   ├── index.tsx       # Landing page
│   │   │   └── api/            # API routes (NextAuth)
│   │   │
│   │   ├── 📁 components/      # Reusable UI
│   │   │   ├── IdleAlert.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── 📁 lib/             # Utilities
│   │   │   └── api.ts          # API client
│   │   │
│   │   ├── 📁 contexts/        # State
│   │   │   └── ProgressContext.tsx
│   │   │
│   │   └── 📁 styles/          # Styles
│   │       └── globals.css
│   │
│   ├── 📁 public/              # Static assets
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind config
│   └── next.config.js          # Next.js config
│
├── 📄 .env.example             # Environment template
├── 📄 .gitignore               # Git ignore rules
├── 📄 README.md                # Project overview
├── 📄 QUICK_START.md           # ⭐ Start here!
├── 📄 SETUP_GUIDE.md           # Detailed setup
├── 📄 API_DOCUMENTATION.md     # API reference
├── 📄 IMPLEMENTATION_SUMMARY.md # What's built
├── 📄 DEVELOPMENT_ROADMAP.md   # Future plans
├── 📄 ARCHITECTURE.md          # ⭐ This file
└── 📜 start.ps1                # Quick start script
```

---

**Legend:**
- ⭐ = Important/Start here
- 📁 = Directory
- 📄 = Documentation
- 📜 = Script

**Last Updated**: October 22, 2025
